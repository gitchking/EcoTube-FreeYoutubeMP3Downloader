import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, convertRequestSchema } from "@shared/schema";
import { z } from "zod";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json({ success: true, message: "Message sent successfully!", id: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to save message" });
      }
    }
  });

  // YouTube to MP3 conversion endpoint
  app.post("/api/convert", async (req, res) => {
    try {
      const validatedData = convertRequestSchema.parse(req.body);
      
      // Create temporary directory for downloads
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const outputPath = path.join(tempDir, `audio_${timestamp}.%(ext)s`);
      
      // First, try to get video info to check availability
      const infoArgs = [
        '--get-title', 
        '--get-duration',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        '--referer', 'https://www.youtube.com/',
        '--no-check-certificate',
        validatedData.url
      ];

      // Check if video is accessible first
      const infoProcess = spawn('yt-dlp', infoArgs);
      let infoOutput = '';
      let infoError = '';

      infoProcess.stdout.on('data', (data) => {
        infoOutput += data.toString();
      });

      infoProcess.stderr.on('data', (data) => {
        infoError += data.toString();
      });

      infoProcess.on('close', (infoCode) => {
        if (infoCode !== 0) {
          console.error('Video info error:', infoError);
          return res.status(400).json({ 
            success: false, 
            error: "Unable to access this video. It might be private, age-restricted, or unavailable in your region." 
          });
        }

        // If info check passed, proceed with download using multiple fallback strategies
        const downloadStrategies = [
          // Strategy 1: Use bypass cookies and session persistence
          [
            '--extract-audio',
            '--audio-format', 'mp3',
            '--audio-quality', validatedData.quality.replace('k', ''),
            '--output', outputPath,
            '--no-playlist',
            '--ignore-errors',
            '--user-agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            '--referer', 'https://www.youtube.com/',
            '--add-header', 'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            '--add-header', 'Accept-Language:en-us,en;q=0.5',
            '--add-header', 'Sec-Fetch-Mode:navigate',
            '--no-check-certificate',
            '--format', '140/m4a',
            '--extractor-retries', '10',
            '--fragment-retries', '10',
            '--retry-sleep', '5',
            validatedData.url
          ],
          // Strategy 2: Use different extraction method
          [
            '--extract-audio',
            '--audio-format', 'mp3',
            '--audio-quality', validatedData.quality.replace('k', ''),
            '--output', outputPath,
            '--no-playlist',
            '--ignore-errors', 
            '--user-agent', 'facebookexternalhit/1.1',
            '--no-check-certificate',
            '--format', 'worst[height<=360]/worst',
            validatedData.url
          ],
          // Strategy 3: Simple approach with basic parameters
          [
            '--extract-audio',
            '--audio-format', 'mp3',
            '--output', outputPath,
            '--no-playlist',
            '--ignore-errors',
            '--format', '18',
            validatedData.url
          ]
        ];

        let currentStrategy = 0;

        function tryDownload() {
          if (currentStrategy >= downloadStrategies.length) {
            return res.status(500).json({ 
              success: false, 
              error: "All conversion methods failed. YouTube may be blocking requests temporarily. Please try again later." 
            });
          }

          const args = downloadStrategies[currentStrategy];
          const ytDlp = spawn('yt-dlp', args);
          let videoTitle = '';
          let error = '';

          ytDlp.stdout.on('data', (data) => {
            const output = data.toString();
            // Extract title from yt-dlp output
            const titleMatch = output.match(/\[download\] Destination: (.+)/);
            if (titleMatch) {
              videoTitle = path.basename(titleMatch[1], '.mp3');
            }
          });

          ytDlp.stderr.on('data', (data) => {
            error += data.toString();
          });

          ytDlp.on('close', (code) => {
            if (code === 0) {
              // Find the generated file
              const files = fs.readdirSync(tempDir).filter(f => f.startsWith(`audio_${timestamp}`));
              if (files.length > 0) {
                const filePath = path.join(tempDir, files[0]);
                
                // Serve the file for download
                res.download(filePath, `${videoTitle || 'audio'}.mp3`, (err) => {
                  if (err) {
                    console.error('Download error:', err);
                  }
                  // Clean up file after download
                  fs.unlink(filePath, () => {});
                });
              } else {
                res.status(500).json({ 
                  success: false, 
                  error: "Conversion completed but file not found" 
                });
              }
            } else {
              console.error(`Strategy ${currentStrategy + 1} failed:`, error);
              // Check for specific YouTube blocking errors
              if (error.includes('HTTP Error 403') || error.includes('nsig extraction failed')) {
                return res.status(429).json({ 
                  success: false, 
                  error: "YouTube is currently blocking download requests. This is a temporary issue affecting many YouTube downloaders. Please try again later or use a different video.",
                  details: "YouTube has implemented stronger anti-bot measures recently."
                });
              }
              currentStrategy++;
              tryDownload(); // Try next strategy
            }
          });
        }

        tryDownload();
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Invalid request data", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Get video info endpoint (for title preview)
  app.post("/api/video-info", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: "URL is required" });
      }

      const ytDlp = spawn('yt-dlp', [
        '--get-title', 
        '--get-duration',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        '--referer', 'https://www.youtube.com/',
        '--add-header', 'Accept-Language:en-US,en;q=0.9',
        '--no-check-certificate',
        url
      ]);
      let output = '';
      let error = '';

      ytDlp.stdout.on('data', (data) => {
        output += data.toString();
      });

      ytDlp.stderr.on('data', (data) => {
        error += data.toString();
      });

      ytDlp.on('close', (code) => {
        if (code === 0) {
          const lines = output.trim().split('\n');
          res.json({ 
            success: true, 
            title: lines[0] || 'Unknown Title',
            duration: lines[1] || 'Unknown Duration'
          });
        } else {
          res.status(400).json({ 
            success: false, 
            error: "Could not get video information" 
          });
        }
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Failed to get video information" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

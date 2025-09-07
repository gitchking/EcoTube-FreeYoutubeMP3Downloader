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
    // Set timeout for the entire request
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({ 
          success: false, 
          error: "Conversion timeout. Please try again with a shorter video or different URL." 
        });
      }
    }, 30000); // 30 second timeout

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
      
      // First, try to get video info to check availability (with timeout)
      const infoArgs = [
        '--get-title', 
        '--get-duration',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        '--referer', 'https://www.youtube.com/',
        '--no-check-certificate',
        '--socket-timeout', '30',
        validatedData.url
      ];

      // Check if video is accessible first (with timeout)
      const infoProcess = spawn('yt-dlp', infoArgs);
      let infoOutput = '';
      let infoError = '';
      let infoResolved = false;

      // Set timeout for info check
      const infoTimeout = setTimeout(() => {
        if (!infoResolved) {
          infoProcess.kill('SIGKILL');
          clearTimeout(timeoutId);
          return res.status(408).json({ 
            success: false, 
            error: "Video info check timeout. The video might be too long or unavailable." 
          });
        }
      }, 5000); // 5 second timeout for info check

      infoProcess.stdout.on('data', (data) => {
        infoOutput += data.toString();
      });

      infoProcess.stderr.on('data', (data) => {
        infoError += data.toString();
      });

      infoProcess.on('close', (infoCode) => {
        infoResolved = true;
        clearTimeout(infoTimeout);
        
        if (infoCode !== 0) {
          console.error('Video info error:', infoError);
          clearTimeout(timeoutId);
          return res.status(400).json({ 
            success: false, 
            error: "Unable to access this video. It might be private, age-restricted, or unavailable in your region." 
          });
        }

        // If info check passed, proceed with ultra-fast conversion (5-8 seconds)
        const downloadStrategies = [
          // Ultra-fast strategy with aggressive optimization for 5-8 second conversion
          {
            command: 'yt-dlp',
            args: [
              '--extract-audio',
              '--audio-format', 'mp3',
              '--audio-quality', '0', // Use fastest conversion
              '--output', outputPath,
              '--no-playlist',
              '--no-warnings',
              '--quiet',
              '--socket-timeout', '5',
              '--extractor-retries', '1',
              '--fragment-retries', '1',
              '--no-check-certificate',
              '--format', 'worstaudio[ext=m4a]/worstaudio[ext=webm]/worstaudio/worst[height<=360]',
              '--postprocessor-args', 'ffmpeg:-ac 1 -ar 22050 -b:a 64k', // Mono, low sample rate, low bitrate for speed
              validatedData.url
            ]
          }
        ];

        let currentStrategy = 0;

        function tryDownload() {
          if (currentStrategy >= downloadStrategies.length) {
            clearTimeout(timeoutId);
            return res.status(500).json({ 
              success: false, 
              error: "All conversion methods failed. YouTube may be blocking requests temporarily. Please try again later." 
            });
          }

          const strategy = downloadStrategies[currentStrategy];
          const ytDlp = spawn(strategy.command, strategy.args);
          let videoTitle = '';
          let error = '';
          let downloadResolved = false;

          // Set timeout for individual download attempt
          const downloadTimeout = setTimeout(() => {
            if (!downloadResolved) {
              ytDlp.kill('SIGKILL');
              console.log(`Strategy ${currentStrategy + 1} timed out, trying next...`);
              currentStrategy++;
              tryDownload();
            }
          }, 10000); // 10 second timeout per strategy

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
            downloadResolved = true;
            clearTimeout(downloadTimeout);
            if (code === 0) {
              clearTimeout(timeoutId);
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
                  setTimeout(() => {
                    fs.unlink(filePath, () => {});
                  }, 5000); // Delay cleanup to ensure download completes
                });
              } else {
                clearTimeout(timeoutId);
                res.status(500).json({ 
                  success: false, 
                  error: "Conversion completed but file not found" 
                });
              }
            } else {
              console.error(`Strategy ${currentStrategy + 1} (${strategy.command}) failed:`, error);
              // Check for specific YouTube blocking errors
              if (error.includes('HTTP Error 403') || error.includes('nsig extraction failed') || error.includes('Sign in to confirm')) {
                clearTimeout(timeoutId);
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
      clearTimeout(timeoutId);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Invalid request data", 
          details: error.errors 
        });
      } else {
        console.error('Conversion error:', error);
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

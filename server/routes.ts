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
      
      // Use yt-dlp (more reliable than ytdl-core) for conversion
      const args = [
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', validatedData.quality.replace('k', ''),
        '--output', outputPath,
        '--no-playlist',
        '--ignore-errors',
        validatedData.url
      ];

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
          console.error('yt-dlp error:', error);
          res.status(500).json({ 
            success: false, 
            error: error.includes('Video unavailable') 
              ? "Video is unavailable or private" 
              : "Failed to convert video. Please check the URL and try again." 
          });
        }
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

      const ytDlp = spawn('yt-dlp', ['--get-title', '--get-duration', url]);
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

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
    let activeProcesses: any[] = [];
    let requestComplete = false;
    
    // Cleanup function to kill all active processes
    const cleanup = () => {
      activeProcesses.forEach(process => {
        try {
          if (process && !process.killed) {
            process.kill('SIGTERM');
            // Force kill if still running after 1 second
            setTimeout(() => {
              if (!process.killed) {
                process.kill('SIGKILL');
              }
            }, 1000);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      });
      activeProcesses = [];
    };

    // Set timeout for the entire request
    const timeoutId = setTimeout(() => {
      if (!requestComplete && !res.headersSent) {
        requestComplete = true;
        cleanup();
        res.status(408).json({ 
          success: false, 
          error: "Conversion timeout. Please try again with a shorter video or different URL." 
        });
      }
    }, 30000); // 30 second timeout

    // Cleanup on request end/abort
    req.on('close', cleanup);
    req.on('aborted', cleanup);

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
        '--socket-timeout', '15',
        '--extractor-retries', '1',
        validatedData.url
      ];

      // Check if video is accessible first (with timeout)
      const infoProcess = spawn('yt-dlp', infoArgs);
      activeProcesses.push(infoProcess);
      
      let infoOutput = '';
      let infoError = '';
      let infoResolved = false;

      // Set timeout for info check
      const infoTimeout = setTimeout(() => {
        if (!infoResolved && !requestComplete) {
          infoResolved = true;
          try {
            infoProcess.kill('SIGTERM');
          } catch (e) {}
          
          if (!res.headersSent) {
            requestComplete = true;
            clearTimeout(timeoutId);
            cleanup();
            return res.status(408).json({ 
              success: false, 
              error: "Video info check timeout. The video might be too long or unavailable." 
            });
          }
        }
      }, 8000); // 8 second timeout for info check

      infoProcess.stdout.on('data', (data) => {
        if (!requestComplete) {
          infoOutput += data.toString();
        }
      });

      infoProcess.stderr.on('data', (data) => {
        if (!requestComplete) {
          infoError += data.toString();
        }
      });

      infoProcess.on('close', (infoCode) => {
        if (requestComplete) return;
        
        infoResolved = true;
        clearTimeout(infoTimeout);
        
        if (infoCode !== 0) {
          console.error('Video info error:', infoError);
          requestComplete = true;
          clearTimeout(timeoutId);
          cleanup();
          
          if (!res.headersSent) {
            return res.status(400).json({ 
              success: false, 
              error: "Unable to access this video. It might be private, age-restricted, or unavailable in your region." 
            });
          }
          return;
        }

        // If info check passed, proceed with conversion
        const downloadArgs = [
          '--extract-audio',
          '--audio-format', 'mp3',
          '--audio-quality', validatedData.quality || '128k',
          '--output', outputPath,
          '--no-playlist',
          '--no-warnings',
          '--socket-timeout', '15',
          '--extractor-retries', '1',
          '--fragment-retries', '1',
          '--no-check-certificate',
          '--format', 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best[height<=480]',
          validatedData.url
        ];

        const ytDlp = spawn('yt-dlp', downloadArgs);
        activeProcesses.push(ytDlp);
        
        let videoTitle = '';
        let error = '';
        let downloadResolved = false;

        // Set timeout for download
        const downloadTimeout = setTimeout(() => {
          if (!downloadResolved && !requestComplete) {
            downloadResolved = true;
            try {
              ytDlp.kill('SIGTERM');
            } catch (e) {}
            
            if (!res.headersSent) {
              requestComplete = true;
              clearTimeout(timeoutId);
              cleanup();
              return res.status(408).json({ 
                success: false, 
                error: "Download timeout. Please try again with a shorter video." 
              });
            }
          }
        }, 20000); // 20 second timeout for download

        ytDlp.stdout.on('data', (data) => {
          if (!requestComplete) {
            const output = data.toString();
            // Extract title from yt-dlp output
            const titleMatch = output.match(/\[download\] Destination: (.+)/);
            if (titleMatch) {
              videoTitle = path.basename(titleMatch[1], '.mp3');
            }
          }
        });

        ytDlp.stderr.on('data', (data) => {
          if (!requestComplete) {
            error += data.toString();
          }
        });

        ytDlp.on('close', (code) => {
          if (requestComplete) return;
          
          downloadResolved = true;
          clearTimeout(downloadTimeout);
          
          if (code === 0) {
            requestComplete = true;
            clearTimeout(timeoutId);
            cleanup();
            
            try {
              // Find the generated file
              const files = fs.readdirSync(tempDir).filter(f => f.startsWith(`audio_${timestamp}`));
              if (files.length > 0) {
                const filePath = path.join(tempDir, files[0]);
                
                if (!res.headersSent) {
                  // Serve the file for download
                  res.download(filePath, `${videoTitle || 'audio'}.mp3`, (err) => {
                    if (err) {
                      console.error('Download error:', err);
                    }
                    // Clean up file after download
                    setTimeout(() => {
                      try {
                        fs.unlink(filePath, () => {});
                      } catch (e) {}
                    }, 5000);
                  });
                }
              } else {
                if (!res.headersSent) {
                  res.status(500).json({ 
                    success: false, 
                    error: "Conversion completed but file not found" 
                  });
                }
              }
            } catch (e) {
              console.error('File handling error:', e);
              if (!res.headersSent) {
                res.status(500).json({ 
                  success: false, 
                  error: "Error handling converted file" 
                });
              }
            }
          } else {
            console.error('Download failed:', error);
            
            // Check for specific YouTube blocking errors
            if (error.includes('HTTP Error 403') || error.includes('nsig extraction failed') || error.includes('Sign in to confirm')) {
              requestComplete = true;
              clearTimeout(timeoutId);
              cleanup();
              
              if (!res.headersSent) {
                return res.status(429).json({ 
                  success: false, 
                  error: "YouTube is currently blocking download requests. This is a temporary issue affecting many YouTube downloaders. Please try again later or use a different video.",
                  details: "YouTube has implemented stronger anti-bot measures recently."
                });
              }
            } else {
              requestComplete = true;
              clearTimeout(timeoutId);
              cleanup();
              
              if (!res.headersSent) {
                res.status(500).json({ 
                  success: false, 
                  error: "Conversion failed. Please try again or use a different video URL." 
                });
              }
            }
          }
        });

        ytDlp.on('error', (err) => {
          if (!requestComplete) {
            console.error('Process error:', err);
            requestComplete = true;
            clearTimeout(timeoutId);
            cleanup();
            
            if (!res.headersSent) {
              res.status(500).json({ 
                success: false, 
                error: "Process error during conversion" 
              });
            }
          }
        });
      });

      infoProcess.on('error', (err) => {
        if (!requestComplete) {
          console.error('Info process error:', err);
          requestComplete = true;
          clearTimeout(timeoutId);
          cleanup();
          
          if (!res.headersSent) {
            res.status(500).json({ 
              success: false, 
              error: "Error checking video information" 
            });
          }
        }
      });

    } catch (error) {
      requestComplete = true;
      clearTimeout(timeoutId);
      cleanup();
      
      if (error instanceof z.ZodError) {
        if (!res.headersSent) {
          res.status(400).json({ 
            success: false, 
            error: "Invalid request data", 
            details: error.errors 
          });
        }
      } else {
        console.error('Conversion error:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false, 
            error: "Internal server error" 
          });
        }
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

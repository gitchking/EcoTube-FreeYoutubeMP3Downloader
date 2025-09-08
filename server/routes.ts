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
    let responseHandled = false;
    
    // Set timeout for the entire request
    const timeoutId = setTimeout(() => {
      if (!responseHandled && !res.headersSent) {
        responseHandled = true;
        res.status(408).json({ 
          success: false, 
          error: "Conversion timeout. Please try again with a shorter video or different URL." 
        });
      }
    }, 180000); // 180 second timeout (3 minutes total)

    try {
      const validatedData = convertRequestSchema.parse(req.body);
      
      // Create temporary directory for downloads
      const tempDir = path.resolve(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
        console.log('Created temp directory:', tempDir);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const outputPath = path.join(tempDir, `audio_${timestamp}.%(ext)s`);
      
      console.log('Starting conversion with:');
      console.log('- URL:', validatedData.url);
      console.log('- Quality:', validatedData.quality);
      console.log('- Output path:', outputPath);
      console.log('- Temp dir:', tempDir);
      
      // Get the FFmpeg path - use local installation in development, system in production
      let ffmpegPath;
      let ffmpegExists = false;
      
      if (process.env.NODE_ENV === 'development') {
        // Development: Use local Windows FFmpeg
        ffmpegPath = path.resolve(__dirname, '../ffmpeg/ffmpeg-master-latest-win64-gpl/bin');
        const ffmpegExePath = path.join(ffmpegPath, 'ffmpeg.exe');
        ffmpegExists = fs.existsSync(ffmpegExePath);
      } else {
        // Production: Use system FFmpeg (installed via buildpack/docker)
        ffmpegPath = '/usr/bin'; // Standard location in most Linux distributions
        ffmpegExists = true; // Assume system FFmpeg is available in production
      }
      
      console.log('FFmpeg path:', ffmpegPath);
      console.log('FFmpeg exists:', ffmpegExists);
      
      // Advanced anti-blocking yt-dlp arguments with multiple fallback strategies
      const downloadArgs = [
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', validatedData.quality || '192',
        '--output', outputPath,
        '--no-playlist',
        '--no-warnings',
        // Enhanced User-Agent rotation
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        // Multiple referrer strategies
        '--referer', 'https://www.youtube.com/',
        '--add-header', 'Accept-Language:en-US,en;q=0.9',
        '--add-header', 'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        '--add-header', 'Accept-Encoding:gzip, deflate, br',
        '--add-header', 'DNT:1',
        '--add-header', 'Connection:keep-alive',
        '--add-header', 'Upgrade-Insecure-Requests:1',
        // Enhanced timeout and retry settings
        '--socket-timeout', '30',
        '--extractor-retries', '10',
        '--fragment-retries', '10',
        '--retry-sleep', '1',
        '--no-check-certificate',
        '--prefer-free-formats',
        // Anti-blocking strategies
        '--force-ipv4',
        '--sleep-interval', '1',
        '--max-sleep-interval', '5',
        '--sleep-subtitles', '1',
        // Format selection to avoid premium formats
        '--format', 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio[height<=720]/best[height<=720]',
        '--ignore-errors',
        '--no-abort-on-error',
        '--no-call-home',
        // Additional YouTube-specific bypasses
        '--extractor-args', 'youtube:skip=dash,hls'
      ];
      
      // Add FFmpeg location only if it exists locally
      if (ffmpegExists) {
        downloadArgs.push('--ffmpeg-location', ffmpegPath);
      }
      
      downloadArgs.push(validatedData.url);

      // Start the download process with multiple fallback strategies
      let currentAttempt = 0;
      const maxAttempts = 3;
      let processComplete = false;

      const tryDownloadWithStrategy = (strategyIndex: number): void => {
        if (currentAttempt >= maxAttempts || processComplete) {
          if (!responseHandled && !res.headersSent) {
            clearTimeout(timeoutId);
            responseHandled = true;
            console.error('All download strategies failed');
            res.status(500).json({ 
              success: false, 
              error: "All download strategies failed. YouTube may be temporarily blocking requests. Please try again later.",
              details: "This is a temporary issue affecting many YouTube downloaders."
            });
          }
          return;
        }

        currentAttempt++;
        console.log(`Attempting strategy ${currentAttempt}/${maxAttempts} (index: ${strategyIndex})`);
        
        // Strategy-specific modifications
        let currentArgs = [...downloadArgs];
        
        if (strategyIndex === 1) {
          // Strategy 2: Use different format and add geo-bypass
          currentArgs = currentArgs.filter(arg => !arg.includes('bestaudio'));
          currentArgs.splice(-1, 0, '--format', 'worst[ext=mp4]/worst', '--geo-bypass');
        } else if (strategyIndex === 2) {
          // Strategy 3: Most aggressive - simulate mobile browser
          currentArgs = currentArgs.filter(arg => !arg.includes('Mozilla/5.0'));
          currentArgs.splice(-1, 0, 
            '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            '--geo-bypass',
            '--geo-bypass-country', 'US',
            '--force-ipv4'
          );
        }

        const ytDlp = spawn('yt-dlp', currentArgs);
        let videoTitle = '';
        let errorOutput = '';

        // Set timeout for download process
        const downloadTimeout = setTimeout(() => {
          if (!processComplete && !responseHandled) {
            console.log(`Strategy ${strategyIndex + 1} timeout after 60 seconds`);
            ytDlp.kill('SIGTERM');
            setTimeout(() => {
              if (!processComplete) {
                ytDlp.kill('SIGKILL');
              }
            }, 2000);
            // Try next strategy
            setTimeout(() => tryDownloadWithStrategy(strategyIndex + 1), 1000);
          }
        }, 60000); // 60 second timeout per strategy

        ytDlp.stdout.on('data', (data) => {
          const output = data.toString();
          console.log('yt-dlp stdout:', output.substring(0, 200) + (output.length > 200 ? '...' : ''));
          // Extract title from yt-dlp output
          const titleMatch = output.match(/\[download\] Destination: (.+)/) || 
                            output.match(/\[youtube\] [^:]+: (.+)/);
          if (titleMatch) {
            videoTitle = path.basename(titleMatch[1], '.mp3').replace(/\.[^.]*$/, '');
            console.log('Extracted video title:', videoTitle);
          }
        });

        ytDlp.stderr.on('data', (data) => {
          const errorMsg = data.toString();
          errorOutput += errorMsg;
          console.log('yt-dlp stderr:', errorMsg.substring(0, 200) + (errorMsg.length > 200 ? '...' : ''));
        });

        ytDlp.on('close', (code) => {
          processComplete = true;
          clearTimeout(downloadTimeout);
          
          console.log(`yt-dlp strategy ${strategyIndex + 1} completed with code:`, code);
          
          if (responseHandled || res.headersSent) {
            console.log('Response already handled, skipping');
            return; // Response already handled
          }
          
          if (code === 0) {
            // Success!
            clearTimeout(timeoutId);
            responseHandled = true;
            
            console.log('Conversion successful! Looking for generated file...');
            
            // Find the generated file
            try {
              const files = fs.readdirSync(tempDir).filter(f => f.startsWith(`audio_${timestamp}`));
              console.log('Found files:', files);
              if (files.length > 0) {
                const filePath = path.join(tempDir, files[0]);
                console.log('Serving file:', filePath);
                
                // Serve the file for download
                res.download(filePath, `${videoTitle || 'youtube-audio'}.mp3`, (err) => {
                  if (err) {
                    console.error('Download error:', err);
                  } else {
                    console.log('File download initiated successfully');
                  }
                  // Clean up file after download
                  setTimeout(() => {
                    try {
                      fs.unlinkSync(filePath);
                      console.log('Temporary file cleaned up:', filePath);
                    } catch (e) {
                      console.error('File cleanup error:', e);
                    }
                  }, 5000);
                });
              } else {
                console.error('No files found after conversion');
                clearTimeout(timeoutId);
                responseHandled = true;
                res.status(500).json({ 
                  success: false, 
                  error: "Conversion completed but file not found" 
                });
              }
            } catch (e) {
              console.error('File access error:', e);
              clearTimeout(timeoutId);
              responseHandled = true;
              res.status(500).json({ 
                success: false, 
                error: "Error accessing converted file" 
              });
            }
          } else {
            // Failure - check if we should try next strategy
            console.error(`yt-dlp attempt ${currentAttempt} failed with code:`, code);
            console.error('Error output:', errorOutput.substring(0, 500) + (errorOutput.length > 500 ? '...' : ''));
            
            // Check for specific blocking errors
            if (errorOutput.includes('HTTP Error 403') || 
                errorOutput.includes('HTTP Error 429') ||
                errorOutput.includes('nsig extraction failed') || 
                errorOutput.includes('Sign in to confirm') ||
                errorOutput.includes('This video is unavailable') ||
                errorOutput.includes('fragment') && errorOutput.includes('not found')) {
              
              // These are blocking errors - try next strategy
              setTimeout(() => tryDownloadWithStrategy(strategyIndex + 1), 2000);
            } else if (errorOutput.includes('Video unavailable') || 
                      errorOutput.includes('Private video') ||
                      errorOutput.includes('Members-only content')) {
              
              // These are permanent errors - don't retry
              clearTimeout(timeoutId);
              responseHandled = true;
              res.status(400).json({ 
                success: false, 
                error: "This video is private, members-only, or unavailable in your region.",
                details: "Please check if the video is public and accessible."
              });
            } else {
              // Other errors - try next strategy
              setTimeout(() => tryDownloadWithStrategy(strategyIndex + 1), 2000);
            }
          }
        });

        ytDlp.on('error', (error) => {
          processComplete = true;
          clearTimeout(downloadTimeout);
          console.error(`yt-dlp process error on attempt ${currentAttempt}:`, error);
          
          // Try next strategy
          setTimeout(() => tryDownloadWithStrategy(strategyIndex + 1), 2000);
        });
      }
      
      // Start with strategy 0
      tryDownloadWithStrategy(0);



    } catch (error) {
      clearTimeout(timeoutId);
      if (!responseHandled && !res.headersSent) {
        responseHandled = true;
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

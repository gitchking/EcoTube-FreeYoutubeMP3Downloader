import { motion } from "framer-motion";
import { Check, Download, RotateCcw, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConversionResultProps {
  result: {
    success: boolean;
    title?: string;
    downloadUrl?: string;
    error?: string;
    details?: string;
  };
  onReset: () => void;
}

export default function ConversionResult({ result, onReset }: ConversionResultProps) {
  const handleDownload = () => {
    if (result.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = `${result.title || 'audio'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(result.downloadUrl);
    }
  };

  const isYouTubeBlocking = result.error?.includes('YouTube is currently blocking') || 
                            result.error?.includes('HTTP Error 403') ||
                            result.error?.includes('nsig extraction failed');

  // Error State
  if (!result.success) {
    return (
      <motion.div 
        className="bg-red-50 dark:bg-red-900 border-3 border-red-300 dark:border-red-700 rounded-comic p-6 text-center max-w-2xl mx-auto border-2 border-black dark:border-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center comic-shadow border-4 ${
            isYouTubeBlocking 
              ? 'bg-orange-200 border-orange-400' 
              : 'bg-red-200 border-red-400'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {isYouTubeBlocking ? (
            <Clock className="text-orange-800 w-6 h-6" />
          ) : (
            <AlertCircle className="text-red-800 w-6 h-6" />
          )}
        </motion.div>
        
        <motion.h3 
          className={`text-xl font-bold mb-4 font-comic ${
            isYouTubeBlocking ? 'text-orange-700 dark:text-orange-300' : 'text-red-700 dark:text-red-300'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {isYouTubeBlocking ? 'YouTube Temporarily Blocking Requests' : 'Conversion Failed'}
        </motion.h3>
        
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Alert className={`${isYouTubeBlocking ? 'border-orange-300 bg-orange-50' : 'border-red-300 bg-red-50'}`}>
            <AlertDescription className="text-sm font-nunito text-left">
              <strong>Error:</strong> {result.error}
              {result.details && (
                <div className="mt-2 text-xs opacity-75">
                  {result.details}
                </div>
              )}
              {isYouTubeBlocking && (
                <div className="mt-3 text-sm">
                  <strong>What to try:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Wait a few minutes and try again</li>
                    <li>Try a different YouTube video</li>
                    <li>Check if the video is public and not restricted</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </motion.div>
        
        <motion.div 
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button 
            onClick={onReset}
            className={`font-bold py-3 px-6 rounded-comic comic-button-shadow font-comic text-white ${
              isYouTubeBlocking 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Success State
  return (
    <motion.div 
      className="bg-green-100 dark:bg-green-900 border-3 border-green-300 dark:border-green-700 rounded-comic p-6 text-center max-w-2xl mx-auto border-2 border-black dark:border-white"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-16 h-16 mx-auto mb-4 bg-green-200 dark:bg-green-700 rounded-full flex items-center justify-center comic-shadow border-4 border-green-400 dark:border-green-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Check className="text-green-800 dark:text-green-200 w-6 h-6" />
      </motion.div>
      
      <motion.h3 
        className="text-xl font-bold text-green-700 dark:text-green-300 mb-2 font-comic"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        Conversion Complete! 🎉
      </motion.h3>
      
      <motion.p 
        className="text-green-600 dark:text-green-400 font-nunito mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {result.title || "Your audio is ready!"}
      </motion.p>
      
      <motion.div 
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button 
          onClick={handleDownload}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-comic comic-button-shadow font-comic"
        >
          <Download className="mr-2 w-4 h-4" />
          Download MP3
        </Button>
        
        <Button 
          onClick={onReset}
          variant="outline"
          className="border-2 border-forest-500 text-forest-700 hover:bg-forest-50 font-bold py-3 px-6 rounded-comic font-comic"
        >
          <RotateCcw className="mr-2 w-4 h-4" />
          Convert Another
        </Button>
      </motion.div>
    </motion.div>
  );
}

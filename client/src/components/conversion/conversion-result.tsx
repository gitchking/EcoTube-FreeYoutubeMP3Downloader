import { motion } from "framer-motion";
import { Check, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionResultProps {
  result: {
    success: boolean;
    title?: string;
    downloadUrl?: string;
    error?: string;
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

  return (
    <motion.div 
      className="bg-green-100 border-3 border-green-300 rounded-comic p-6 text-center max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center comic-shadow border-4 border-green-400"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Check className="text-green-600 w-6 h-6" />
      </motion.div>
      
      <motion.h3 
        className="text-xl font-bold text-green-700 mb-2 font-comic"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        Conversion Complete! 🎉
      </motion.h3>
      
      <motion.p 
        className="text-green-600 font-nunito mb-4"
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

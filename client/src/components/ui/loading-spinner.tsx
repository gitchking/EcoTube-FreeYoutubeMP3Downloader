import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({ 
  message = "Converting your video...", 
  submessage = "This usually takes 5-8 seconds" 
}: LoadingSpinnerProps) {
  return (
    <motion.div 
      className="bg-forest-100 rounded-comic p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 mx-auto mb-4 bg-forest-200 rounded-full flex items-center justify-center comic-shadow border-4 border-forest-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sprout className="text-forest-800 w-6 h-6" />
      </motion.div>
      <p className="text-forest-700 font-bold text-lg font-comic">{message} 🌱</p>
      <p className="text-forest-600 font-nunito">{submessage}</p>
    </motion.div>
  );
}

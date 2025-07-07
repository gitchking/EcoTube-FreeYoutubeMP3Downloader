import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-100 dark:bg-black border-t-4 border-forest-300 dark:border-white py-4 border-2 border-black dark:border-white dotted-pattern">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <motion.div 
            className="flex items-center justify-center md:justify-start space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-forest-200 dark:bg-gray-800 rounded-comic flex items-center justify-center border-2 border-forest-400 dark:border-white comic-shadow border-2 border-black dark:border-white">
              <Leaf className="text-forest-800 dark:text-white w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-comic text-forest-800 dark:text-white">EcoTube</h3>
              <p className="text-forest-600 dark:text-gray-300 font-nunito text-sm">Premium Convertor</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center text-sm font-nunito"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-forest-600 dark:text-gray-300">&copy; 2024 EcoTube 🌿</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center md:items-end space-y-2 text-sm font-nunito"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex space-x-4">
              <a href="/privacy" className="text-forest-700 dark:text-white hover:text-comic-orange dark:hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-forest-700 dark:text-white hover:text-comic-orange dark:hover:text-orange-400 transition-colors">Terms of Service</a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

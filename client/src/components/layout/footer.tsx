import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-100 border-t-4 border-forest-300 py-4 border-2 border-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col space-y-4">
          <motion.div 
            className="flex items-center justify-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-forest-200 rounded-comic flex items-center justify-center border-2 border-forest-400 comic-shadow border-2 border-black">
              <Leaf className="text-forest-800 w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-comic text-forest-800">EcoTube</h3>
              <p className="text-forest-600 font-nunito text-sm">Premium Convertor</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center space-y-2 text-sm font-nunito"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-forest-600 text-center">&copy; 2024 EcoTube 🌿</p>
            <div className="flex space-x-4">
              <a href="/privacy" className="text-forest-700 hover:text-comic-orange transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-forest-700 hover:text-comic-orange transition-colors">Terms of Service</a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

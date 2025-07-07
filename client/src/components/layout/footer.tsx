import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-700 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3 mb-4 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-white rounded-comic flex items-center justify-center">
              <Leaf className="text-forest-700" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-comic">EcoTube</h3>
              <p className="text-forest-300 font-nunito text-sm">Sustainable Converting</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex space-x-6 text-sm font-nunito"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a href="#" className="hover:text-comic-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-comic-orange transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-comic-orange transition-colors">Carbon Neutral</a>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-forest-500 mt-6 pt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-forest-300 font-nunito">&copy; 2024 EcoTube. Powered by renewable energy 🌱</p>
        </motion.div>
      </div>
    </footer>
  );
}


import { motion } from "framer-motion";

interface HorizontalAdsProps {
  className?: string;
}

export default function HorizontalAds({ className = "" }: HorizontalAdsProps) {
  return (
    <motion.div 
      className={`lg:hidden w-full max-w-4xl mx-auto px-4 py-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Mobile Ad Container */}
      <div className="bg-white border-2 border-black rounded-comic comic-shadow p-4">
        {/* Ad Label */}
        <div className="text-center mb-3">
          <span className="text-xs font-bold text-forest-600 bg-forest-100 px-2 py-1 rounded-full border border-forest-300">
            Advertisement
          </span>
        </div>
        
        {/* Horizontal Ad Space */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
          <div className="text-gray-500 text-sm mb-2">Mobile Ad Space 320x100</div>
          <div className="text-xs text-gray-400 mb-3">Paste your mobile ad code here</div>
          {/* Replace this div with your actual mobile ad code */}
          <div id="mobile-ad-banner" className="w-full h-full">
            {/* Your Google AdSense mobile ad code goes here */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

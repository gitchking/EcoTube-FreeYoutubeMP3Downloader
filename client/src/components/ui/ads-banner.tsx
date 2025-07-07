
import { motion } from "framer-motion";

interface AdsBannerProps {
  position: "left" | "right";
  className?: string;
}

export default function AdsBanner({ position, className = "" }: AdsBannerProps) {
  return (
    <motion.div 
      className={`hidden lg:block fixed ${position === "left" ? "left-4" : "right-4"} top-1/2 transform -translate-y-1/2 w-40 z-10 ${className}`}
      initial={{ opacity: 0, x: position === "left" ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {/* Ad Container */}
      <div className="bg-white border-2 border-black rounded-comic comic-shadow p-4 space-y-4">
        {/* Ad Label */}
        <div className="text-center">
          <span className="text-xs font-bold text-forest-600 bg-forest-100 px-2 py-1 rounded-full border border-forest-300">
            Advertisement
          </span>
        </div>
        
        {/* Ad Space 1 - Banner */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[200px] flex flex-col justify-center">
          <div className="text-gray-500 text-sm mb-2">Ad Space 160x200</div>
          <div className="text-xs text-gray-400 mb-3">Paste your ad code here</div>
          {/* Replace this div with your actual ad code */}
          <div id={`ad-banner-${position}-1`} className="w-full h-full">
            {/* Your Google AdSense or other ad code goes here */}
          </div>
        </div>

        {/* Ad Space 2 - Square */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[160px] flex flex-col justify-center">
          <div className="text-gray-500 text-sm mb-2">Ad Space 160x160</div>
          <div className="text-xs text-gray-400 mb-3">Paste your ad code here</div>
          {/* Replace this div with your actual ad code */}
          <div id={`ad-square-${position}-1`} className="w-full h-full">
            {/* Your Google AdSense or other ad code goes here */}
          </div>
        </div>

        {/* Ad Space 3 - Skyscraper */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[300px] flex flex-col justify-center">
          <div className="text-gray-500 text-sm mb-2">Ad Space 160x300</div>
          <div className="text-xs text-gray-400 mb-3">Paste your ad code here</div>
          {/* Replace this div with your actual ad code */}
          <div id={`ad-skyscraper-${position}-1`} className="w-full h-full">
            {/* Your Google AdSense or other ad code goes here */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

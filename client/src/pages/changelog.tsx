import { motion } from "framer-motion";
import { Star, Rocket, Bug, Plus, Zap, Smartphone, Leaf, Palette, Shield, Cog, Wrench, TrendingUp, Globe } from "lucide-react";

export default function Changelog() {
  const versions = [
    {
      version: "2.1.0",
      date: "January 15, 2024",
      icon: Star,
      color: "bg-forest-500",
      badge: "Latest",
      badgeColor: "bg-green-100 text-green-700",
      changes: [
        { icon: Plus, text: "Added 320kbps premium quality option", color: "text-green-500" },
        { icon: Zap, text: "40% faster conversion speeds", color: "text-comic-orange" },
        { icon: Smartphone, text: "Improved mobile interface", color: "text-ocean-500" },
        { icon: Leaf, text: "Reduced server energy consumption by 25%", color: "text-forest-500" }
      ]
    },
    {
      version: "2.0.0",
      date: "December 1, 2023",
      icon: Rocket,
      color: "bg-ocean-500",
      changes: [
        { icon: Palette, text: "Complete UI redesign with eco-comic theme", color: "text-comic-orange" },
        { icon: Shield, text: "Enhanced security and privacy protection", color: "text-green-500" },
        { icon: Cog, text: "Backend optimization for better performance", color: "text-forest-500" }
      ]
    },
    {
      version: "1.5.2",
      date: "November 10, 2023",
      icon: Bug,
      color: "bg-comic-orange",
      changes: [
        { icon: Wrench, text: "Fixed conversion errors for long videos", color: "text-forest-500" },
        { icon: TrendingUp, text: "Improved conversion success rate to 99.8%", color: "text-ocean-500" },
        { icon: Globe, text: "Added support for more YouTube URL formats", color: "text-green-500" }
      ]
    }
  ];

  return (
    <section className="py-12 bg-forest-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-forest-700 mb-4 font-comic">Changelog</h2>
          <p className="text-xl text-forest-600 font-nunito">Latest updates and improvements</p>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {versions.map((version, index) => (
            <motion.div
              key={version.version}
              className="bg-white rounded-comic p-6 comic-shadow"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "12px 12px 0px rgba(74, 124, 89, 0.4)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <motion.div 
                    className={`w-12 h-12 ${version.color} rounded-full flex items-center justify-center mr-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <version.icon className="text-white" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-forest-700 font-comic">Version {version.version}</h3>
                    <p className="text-forest-500 font-nunito">Released: {version.date}</p>
                  </div>
                </div>
                {version.badge && (
                  <motion.span 
                    className={`${version.badgeColor} px-3 py-1 rounded-full text-sm font-bold`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    {version.badge}
                  </motion.span>
                )}
              </div>
              
              <motion.ul 
                className="text-forest-600 font-nunito space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {version.changes.map((change, changeIndex) => (
                  <motion.li 
                    key={changeIndex}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 + changeIndex * 0.05 }}
                  >
                    <change.icon className={`${change.color} mr-2`} size={16} />
                    {change.text}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

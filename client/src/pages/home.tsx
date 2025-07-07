import { motion } from "framer-motion";
import { Music, Rocket, Shield, Leaf } from "lucide-react";
import ConversionForm from "@/components/conversion/conversion-form";
import DebugIconTest from "@/components/debug-icon-test";

export default function Home() {
  const features = [
    {
      icon: Rocket,
      title: "Lightning Fast",
      description: "Convert videos in seconds with our optimized processing",
      color: "bg-ocean-500"
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your data is never stored. Convert and download instantly",
      color: "bg-green-500"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Powered by green energy and optimized for efficiency",
      color: "bg-comic-orange"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-cream to-forest-100">
      <div className="max-w-4xl mx-auto px-4">
        <DebugIconTest />
        {/* Hero Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-32 h-32 mx-auto mb-6 bg-forest-500 rounded-full flex items-center justify-center comic-shadow"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Music className="text-white" size={48} />
          </motion.div>
          
          <motion.h2 
            className="text-5xl font-bold text-forest-700 mb-4 font-comic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            YouTube to MP3
          </motion.h2>
          
          <motion.p 
            className="text-xl text-forest-600 font-nunito max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Convert your favorite YouTube videos to high-quality MP3 files with our eco-friendly, lightning-fast converter! 🌿⚡
          </motion.p>
        </motion.div>

        {/* Conversion Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ConversionForm />
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-comic p-6 comic-shadow text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "12px 12px 0px rgba(74, 124, 89, 0.4)"
              }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 ${feature.color} rounded-full flex items-center justify-center`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-forest-700 mb-2 font-comic">{feature.title}</h3>
              <p className="text-forest-600 font-nunito">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Gavel, Clock, Music, Lock, Zap, Globe } from "lucide-react";

export default function FAQs() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      icon: Gavel,
      question: "Is it legal to convert YouTube videos to MP3?",
      answer: "Yes, for personal use and content you own or have permission to convert. Always respect copyright laws and YouTube's terms of service.",
      color: "bg-forest-500"
    },
    {
      icon: Clock,
      question: "How long does the conversion take?",
      answer: "Most conversions complete within 30-60 seconds, depending on video length and selected quality. Our eco-optimized servers ensure fast processing!",
      color: "bg-ocean-500"
    },
    {
      icon: Music,
      question: "What audio quality options are available?",
      answer: "We offer 5 quality levels: 64kbps (small files), 128kbps (good quality), 192kbps (high quality), 256kbps (very high), and 320kbps (premium quality).",
      color: "bg-comic-orange"
    },
    {
      icon: Lock,
      question: "Do you store my converted files?",
      answer: "No! We prioritize your privacy. Files are converted in real-time and automatically deleted after download. We never store your personal data or files.",
      color: "bg-green-500"
    },
    {
      icon: Zap,
      question: "What makes EcoTube different?",
      answer: "We're powered by renewable energy, use optimized algorithms for fast conversion, and prioritize user privacy with no data storage. Plus, our comic-style interface makes converting fun!",
      color: "bg-purple-500"
    },
    {
      icon: Globe,
      question: "Are there any usage limits?",
      answer: "Currently, our service is free with no hard limits. We ask users to be reasonable and considerate. Heavy usage may be temporarily rate-limited to ensure fair access for everyone.",
      color: "bg-blue-500"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-forest-700 mb-4 font-comic">Frequently Asked Questions</h2>
          <p className="text-xl text-forest-600 font-nunito">Everything you need to know about EcoTube</p>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-forest-50 rounded-comic overflow-hidden comic-shadow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <motion.button 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-forest-100 transition-colors"
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 ${faq.color} rounded-full flex items-center justify-center mr-4`}>
                    <faq.icon className="text-white" size={16} />
                  </div>
                  <span className="font-bold text-forest-700 font-comic">{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="text-forest-500" size={20} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-forest-600 font-nunito pl-12">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

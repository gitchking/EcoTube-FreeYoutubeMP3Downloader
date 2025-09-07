import { motion } from "framer-motion";
import { Shield, Eye, Lock, Trash2, Server, Cookie } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect minimal information necessary for our service. This includes YouTube URLs you submit for conversion, basic usage analytics, and technical data like IP addresses for security purposes. We do not require account creation or personal information.",
      iconColor: "text-blue-800",
      bgColor: "bg-blue-200"
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: "Your data is used solely for providing the YouTube to MP3 conversion service. We process URLs temporarily to extract audio, monitor service performance, and prevent abuse. We never store your converted files or personal content.",
      iconColor: "text-green-800",
      bgColor: "bg-green-200"
    },
    {
      icon: Trash2,
      title: "Data Retention",
      content: "Converted audio files are automatically deleted from our servers within 1 hour of creation. Temporary processing data is removed immediately after conversion. Usage logs are retained for 30 days for security and performance monitoring only.",
      iconColor: "text-red-800",
      bgColor: "bg-red-200"
    },
    {
      icon: Server,
      title: "Data Security",
      content: "We implement industry-standard security measures including encrypted connections (HTTPS), secure server infrastructure, and regular security audits. Our eco-friendly servers are hosted in secure data centers with renewable energy.",
      iconColor: "text-purple-800",
      bgColor: "bg-purple-200"
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      content: "We use essential cookies for basic functionality and anonymous analytics to improve our service. We do not use advertising cookies or third-party trackers. You can disable cookies in your browser settings.",
      iconColor: "text-orange-800",
      bgColor: "bg-orange-200"
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have the right to request information about your data, request deletion of any stored data, and opt-out of analytics. Contact us at privacy@ecotube.com for any privacy-related questions or requests.",
      iconColor: "text-forest-800",
      bgColor: "bg-forest-200"
    }
  ];

  return (
    <section className="py-12 bg-forest-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center comic-shadow border-4 border-purple-400">
            <Shield className="text-purple-800 w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold text-forest-700 dark:text-white mb-4 font-comic">Privacy Policy</h2>
          <p className="text-xl text-forest-600 dark:text-gray-300 font-nunito">Your privacy is our priority. Here's how we protect your data.</p>
          <p className="text-sm text-forest-500 dark:text-gray-400 font-nunito mt-2">Last updated: January 2024</p>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-black rounded-comic p-6 comic-shadow border-2 border-black dark:border-white"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.01,
                boxShadow: "12px 12px 0px rgba(74, 124, 89, 0.4)"
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${section.bgColor} rounded-full flex items-center justify-center comic-shadow flex-shrink-0`}>
                  <section.icon className={`${section.iconColor} w-6 h-6`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-forest-700 dark:text-white mb-3 font-comic">{section.title}</h3>
                  <p className="text-forest-600 dark:text-gray-300 font-nunito leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-green-100 dark:bg-green-900 border-3 border-green-300 dark:border-green-700 rounded-comic p-6 border-2 border-black dark:border-white">
            <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2 font-comic">Privacy Commitment</h3>
            <p className="text-green-600 dark:text-green-400 font-nunito">
              We are committed to protecting your privacy and maintaining transparency in our data practices.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
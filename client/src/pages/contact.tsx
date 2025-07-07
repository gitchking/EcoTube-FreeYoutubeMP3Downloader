import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { User, Mail, MessageCircle, Send, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsSubmitted(true);
        toast({
          title: "Message Sent! 🌟",
          description: "Thanks for reaching out! We'll get back to you within 24 hours.",
        });
      } else {
        toast({
          title: "Failed to Send",
          description: data.error || "An error occurred while sending your message.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "All Fields Required",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate({ name, email, message });
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-12 bg-white dark:bg-black">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div 
            className="bg-green-100 dark:bg-green-900 border-3 border-green-300 dark:border-green-700 rounded-comic p-8 text-center border-2 border-black dark:border-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 bg-green-200 rounded-full flex items-center justify-center comic-shadow border-4 border-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Check className="text-green-800 w-10 h-10" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold text-green-700 dark:text-green-300 mb-4 font-comic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Message Sent! 🌟
            </motion.h2>
            
            <motion.p 
              className="text-green-600 dark:text-green-400 font-nunito mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Thanks for reaching out! We'll get back to you within 24 hours.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button 
                onClick={handleReset}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-comic comic-button-shadow font-comic border-2 border-green-800"
              >
                Send Another Message
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-forest-700 dark:text-gray-200 mb-4 font-comic">Get in Touch</h2>
          <p className="text-xl text-forest-600 dark:text-gray-400 font-nunito">Have questions or feedback? We'd love to hear from you!</p>
        </motion.div>

        <motion.div 
          className="bg-forest-50 dark:bg-black rounded-comic p-8 comic-shadow border-2 border-black dark:border-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Label className="flex items-center text-lg font-bold text-forest-700 dark:text-gray-200 mb-3 font-comic">
                <span className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mr-3">
                  <User className="text-orange-800 w-4 h-4" />
                </span>
                Your Name
              </Label>
              <Input 
                type="text" 
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 border-3 border-forest-300 rounded-comic focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100 font-nunito text-lg transition-all duration-200"
                required
              />
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Label className="flex items-center text-lg font-bold text-forest-700 dark:text-gray-200 mb-3 font-comic">
                <span className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                  <Mail className="text-blue-800 w-4 h-4" />
                </span>
                Email Address
              </Label>
              <Input 
                type="email" 
                placeholder="your.email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border-3 border-forest-300 rounded-comic focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100 font-nunito text-lg transition-all duration-200"
                required
              />
            </motion.div>

            {/* Message Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Label className="flex items-center text-lg font-bold text-forest-700 dark:text-gray-200 mb-3 font-comic">
                <span className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-3">
                  <MessageCircle className="text-green-800 w-4 h-4" />
                </span>
                Your Message
              </Label>
              <Textarea 
                rows={6} 
                placeholder="Tell us what's on your mind..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-4 border-3 border-forest-300 rounded-comic focus:border-forest-500 focus:outline-none focus:ring-4 focus:ring-forest-100 font-nunito text-lg transition-all duration-200 resize-none"
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-comic comic-button-shadow transition-all duration-200 text-lg font-comic border-2 border-green-800 dark:border-blue-800"
                disabled={contactMutation.isPending}
              >
                <span className="flex items-center justify-center">
                  {contactMutation.isPending ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="w-8 h-8 bg-forest-200 rounded-full flex items-center justify-center mr-3">
                        <Send className="text-forest-800 w-4 h-4" />
                      </span>
                      Send Message
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

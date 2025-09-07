import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeSwitch } from "@/components/theme/theme-switch";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/faqs", label: "FAQs" },
    { path: "/changelog", label: "Changelog" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white dark:bg-black shadow-lg border-b-4 border-forest-300 dark:border-white border-2 border-black dark:border-white dotted-pattern">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-forest-200 dark:bg-black rounded-full flex items-center justify-center comic-shadow border-2 border-forest-300 dark:border-white border-2 border-black dark:border-white">
                <Leaf className="text-forest-800 dark:text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-forest-700 dark:text-white font-comic">EcoTube</h1>
                <p className="text-xs text-forest-500 dark:text-gray-300 font-nunito">Premium Convertor</p>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className={`nav-link font-semibold transition-colors duration-200 px-3 py-2 rounded-lg ${
                    isActive(item.path)
                      ? "text-white dark:text-black bg-purple-600 dark:bg-purple-400 comic-shadow border-2 border-black"
                      : "text-forest-700 dark:text-white hover:text-white hover:bg-purple-500 hover:comic-shadow hover:border-2 hover:border-black"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
            <ThemeSwitch />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeSwitch />
            <button 
              className="w-10 h-10 bg-forest-500 dark:bg-black rounded-lg flex items-center justify-center border-2 border-black dark:border-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="text-white w-5 h-5" />
              ) : (
                <Menu className="text-white w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    className={`block px-4 py-2 rounded-lg transition-colors font-semibold ${
                      isActive(item.path)
                        ? "text-white dark:text-black bg-purple-600 dark:bg-purple-400 comic-shadow border-2 border-black"
                        : "text-forest-700 dark:text-white hover:text-white hover:bg-purple-500 hover:comic-shadow hover:border-2 hover:border-black"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

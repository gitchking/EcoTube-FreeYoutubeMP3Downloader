import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

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
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-forest-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-forest-200 rounded-comic flex items-center justify-center comic-shadow border-2 border-forest-300">
                <Leaf className="text-forest-800 w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-forest-700 font-comic">EcoTube</h1>
                <p className="text-xs text-forest-500 font-nunito">Clean • Green • Convert</p>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className={`nav-link font-semibold transition-colors duration-200 px-3 py-2 rounded-lg ${
                    isActive(item.path)
                      ? "text-forest-700 border-b-2 border-forest-500 bg-forest-50 comic-shadow"
                      : "text-forest-700 hover:text-comic-orange hover:bg-forest-50 hover:comic-shadow"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden w-10 h-10 bg-forest-500 rounded-lg flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-white w-5 h-5" />
            ) : (
              <Menu className="text-white w-5 h-5" />
            )}
          </button>
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
                  <div
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "text-forest-700 bg-forest-100 font-semibold"
                        : "text-forest-700 hover:bg-forest-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

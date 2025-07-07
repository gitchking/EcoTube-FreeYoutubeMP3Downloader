import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      className="absolute bottom-20 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-12 h-12 rounded-full shadow-lg border-2 border-forest-300 dark:border-forest-600 bg-white dark:bg-gray-800 hover:bg-forest-50 dark:hover:bg-gray-700 transition-all duration-200"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-forest-700 dark:text-forest-300" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500" />
        )}
      </Button>
    </motion.div>
  );
}
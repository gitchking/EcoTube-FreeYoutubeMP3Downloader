import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 rounded-comic border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-yellow-100 dark:hover:bg-gray-900 comic-shadow transition-all duration-200"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
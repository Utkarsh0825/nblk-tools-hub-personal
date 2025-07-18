"use client"

import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from "next/image"

interface ErrorFallbackProps {
  onRetry: () => void
}

export default function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-24 h-6">
            <Image
              src={theme === "dark" ? "/nblk-logo-white.png" : "/nblk-logo-black.png"}
              alt="NBLK Logo"
              fill
              className="object-contain"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">We'll be right back</p>

        <Button
          onClick={onRetry}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-[#006400] dark:hover:bg-[#006400] hover:text-white px-8 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 hover:shadow-lg transform-gpu"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </motion.div>
  )
}

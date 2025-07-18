"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
// Removed: import Image from "next/image"

interface LandingPageProps {
  onExploreTools: () => void
}

export default function LandingPage({ onExploreTools }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen px-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0}}
          animate={{ opacity: 1}}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
        >
          <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white">
            Small Business Tools by NBLK
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="text-l text-white mb-8"
        >
          Try a quick business self-check. No signup needed - just pick a topic and go​
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        >
          <Button
            onClick={onExploreTools}
            size="sm"
            className="text-sm px-8 py-6 rounded-xl group bg-white text-black hover:bg-gray-300"
          >
            Explore Tools
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

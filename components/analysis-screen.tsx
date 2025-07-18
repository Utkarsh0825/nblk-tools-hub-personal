"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const tips = [
  "analyzing responses",
  "deploying AI models",
  "generating reports",
  "getting things ready",
]

export default function AnalysisScreen() {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="mb-6 text-3xl font-bold text-white">
            Small Business Tools by NBLK
          </h1>
      <motion.p
        key={tips[tipIndex]}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className="text-m text-gray-400"
      >
        {tips[tipIndex]}
      </motion.p>
    </div>
  )
}

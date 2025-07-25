"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface SuccessScreenProps {
  onBecomePartner: () => void
  onRetakeDiagnostic: () => void
  onViewPreviousResult: () => void
  onLogoClick: () => void
  onResendReport?: () => void
}

export default function SuccessScreen({
  onBecomePartner,
  onRetakeDiagnostic,
  onViewPreviousResult,
  onLogoClick,
  onResendReport,
}: SuccessScreenProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showResendSuccess, setShowResendSuccess] = useState(false)
  const cooldownRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownRef.current = setTimeout(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    } else if (cooldownRef.current) {
      clearTimeout(cooldownRef.current)
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
    }
  }, [resendCooldown])

  const handleResend = async () => {
    if (resendCooldown > 0) return
    if (onResendReport) {
      await onResendReport()
      setShowResendSuccess(true)
      setResendCooldown(60)
      setTimeout(() => setShowResendSuccess(false), 2500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-black py-12 px-4"
    >
      <div className="max-w-md mx-auto">
        {/* Success Message */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 200, duration: 0.3 }}
          className="text-center mb-12"
        >
          <CheckCircle className="mx-auto mb-6" size={70} strokeWidth={2.5} color="#fff" fill="none" />
          <h1 className="text-2xl font-medium mb-1 text-white">Report Sent Successfully!</h1>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="space-y-4 mb-4"
        >
          <Button
            onClick={onViewPreviousResult}
            variant="outline"
            className="w-full py-6 text-sm border-2 border-white/40 text-white rounded-lg font-medium bg-transparent transition-all duration-300 shadow-none"
          >
            Back to Results
          </Button>
        </motion.div>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          <Card className="bg-neutral-900 border border-white/20 rounded-xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-base font-medium mb-4 text-white">How was your experience?</h3>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors duration-200 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-current"
                          : "text-white/20"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-gray-300"
                >
                  Thank you for your feedback!
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Resend Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-center mt-20"
        >
          <p className="text-sm text-gray-400 mb-1">Didn't receive the email?</p>
          <span
            onClick={resendCooldown === 0 ? handleResend : undefined}
            className={`text-white underline text-sm cursor-pointer hover:no-underline hover:text-gray-300 transition-colors duration-300 ${resendCooldown > 0 ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
            role="button"
            tabIndex={0}
            aria-disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 ? `Resend Report (${resendCooldown}s)` : "Resend Report"}
          </span>
        </motion.div>
        {/* Success Popup */}
        {showResendSuccess && (
          <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            Report resent successfully!
          </div>
        )}
      </div>
    </motion.div>
  )
}

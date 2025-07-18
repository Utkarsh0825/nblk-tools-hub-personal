"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Moon, Sun, Building, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "next-themes"
import Image from "next/image"

interface ServicePartnerProps {
  onBack: () => void
  onLogoClick: () => void
}

export default function ServicePartner({ onBack, onLogoClick }: ServicePartnerProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    email: "",
    isInterested: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Service partner form submitted:", formData)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-white dark:bg-black py-8 px-4 flex items-center justify-center"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-[#006400] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We'll be in touch soon about partnership opportunities.
          </p>
          <Button onClick={onBack} className="bg-[#006400] hover:bg-[#004d00] text-white">
            Back to Results
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen bg-white dark:bg-black py-8 px-4"
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <motion.button
              onClick={onLogoClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-24 h-6 cursor-pointer"
            >
              <Image
                src={theme === "dark" ? "/nblk-logo-white.png" : "/nblk-logo-black.png"}
                alt="NBLK Logo"
                fill
                className="object-contain transition-all duration-300"
              />
            </motion.button>
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Become a Service Partner</h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Join our network and get recommended to other businesses using our tool
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-sm font-medium">
              Business Name
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="businessName"
                type="text"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="pl-10 py-3 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#006400] transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium">
              Industry
            </Label>
            <Select onValueChange={(value) => setFormData({ ...formData, industry: value })}>
              <SelectTrigger className="py-3 text-lg border-2 rounded-xl">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 py-3 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#006400] transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <Checkbox
              id="interested"
              checked={formData.isInterested}
              onCheckedChange={(checked) => setFormData({ ...formData, isInterested: checked as boolean })}
              className="mt-1"
            />
            <Label htmlFor="interested" className="text-sm leading-relaxed cursor-pointer">
              I'm interested in becoming a B2B service partner and being included in recommendations for other
              businesses
            </Label>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={!formData.businessName || !formData.industry || !formData.email || isSubmitting}
              className="w-full py-4 text-lg bg-black dark:bg-white text-white dark:text-black hover:bg-[#006400] dark:hover:bg-[#006400] hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 hover:shadow-lg transform-gpu"
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  )
}

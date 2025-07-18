"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, Globe, MapPin, Moon, Sun, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import Image from "next/image"

interface ContactUsProps {
  onLogoClick: () => void
}

export default function ContactUs({ onLogoClick }: ContactUsProps) {
  const { theme, setTheme } = useTheme()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "1-212-598-3030",
      href: "tel:+12125983030",
      color: "text-[#006400]",
    },
    {
      icon: Mail,
      label: "Email",
      value: "uky.utkarsh0825@gmail.com",
      href: "mailto:uky.utkarsh0825@gmail.com",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Globe,
      label: "Website",
      value: "www.n-blk.com",
      href: "https://www.n-blk.com",
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Contact form submitted:", formData)
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
            <Send className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-4">Message Sent!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for reaching out. We'll get back to you soon.
          </p>
          <Button onClick={onLogoClick} className="bg-[#006400] hover:bg-[#004d00] text-white">
            Back to Home
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We're here to help. Reach out to our team anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

            {contactInfo.map((contact, index) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block"
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-[#006400]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800 transition-transform duration-300`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <contact.icon className={`h-6 w-6 ${contact.color}`} />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{contact.label}</p>
                        <p className="text-lg font-medium group-hover:text-[#006400] transition-colors">
                          {contact.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                      <div className="text-lg font-medium">
                        <p>NBLK Consulting</p>
                        <p>442 5th Avenue, #2304</p>
                        <p className="text-gray-600 dark:text-gray-400">New York, NY 10018</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border-2">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-2 rounded-xl focus:ring-2 focus:ring-[#006400] transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-2 rounded-xl focus:ring-2 focus:ring-[#006400] transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-sm font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="border-2 rounded-xl focus:ring-2 focus:ring-[#006400] transition-all duration-300 min-h-[120px]"
                      required
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={!formData.name || !formData.email || !formData.message || isSubmitting}
                      className="w-full py-3 text-lg bg-black dark:bg-white text-white dark:text-black hover:bg-[#006400] dark:hover:bg-[#006400] hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 hover:shadow-lg transform-gpu"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

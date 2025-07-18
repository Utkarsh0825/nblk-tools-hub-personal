"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MoreVertical, Mail, Phone, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface EmailCaptureProps {
  onSubmit: (name: string, email: string) => void
  onBack: () => void
  onLogoClick: () => void
}

export default function EmailCapture({ onSubmit, onBack }: EmailCaptureProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setIsSubmitting(true)
    
    // Store user data for resend functionality
    const userData = { name: name.trim(), email: email.trim() };
    localStorage.setItem('userData', JSON.stringify(userData));
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing
    onSubmit(name.trim(), email.trim())
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto min-h-screen px-4 md:px-8 text-white bg-black flex flex-col"
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black px-4 py-4 flex items-center justify-between border-b border-white/10">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Open menu"
          >
            <MoreVertical className="h-5 w-5 text-white" />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-44 rounded-xl bg-white text-black shadow-xl z-50 overflow-hidden"
              >
                <Button
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition rounded-none justify-start"
                  variant="ghost"
                  onClick={() => {
                    setContactDialogOpen(true)
                    setDropdownOpen(false)
                  }}
                >
                  Contact Us
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Contact Us Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="bg-white text-black rounded-2xl shadow-2xl border-0 p-0 max-w-md mx-auto">
          <div className="flex">
            <div className="flex-1 p-8 pl-10 flex flex-col gap-4">
              <DialogHeader className="mb-2">
                <DialogTitle className="text-xl font-bold">Contact Us</DialogTitle>
                <DialogDescription className="text-l text-gray-500">
                  We are here to help you succeed. Reach out to our team for support, questions or feedback.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-1">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-green-600" />
                  <a href="mailto:info@nblkconsulting.com" className="hover:text-green-700 text-sm">info@nblkconsulting.com</a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-green-600" />
                  <a href="tel:+1234567890" className="hover:text-green-700 text-sm">+1 (234) 567-890</a>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center justify-start max-w-md mx-auto">
        <h1 className="text-2xl font-medium text-center mb-3 mt-8 pt-0">Get Detailed Report</h1>
        <p className="text-center text-sm text-gray-400 mb-10 max-w-md">
          Enter your name & email to receive a detailed diagnostic report with insights and action plans
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <Input
            type="text"
            placeholder="Preferred Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-6 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-6 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
            required
          />
          <Button
            type="submit"
            disabled={!name.trim() || !email.trim() || isSubmitting}
            className="w-full py-6 text-sm bg-white text-black rounded-lg mt-2 transition-all duration-300 hover:bg-gray-300 shadow disabled:opacity-50"
          >
            
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
      <footer className="w-full max-w-md mx-auto pb-8">
        <p className="text-center text-sm text-gray-400 mt-8">
          Your information is secure and won't be shared
        </p>
      </footer>
    </motion.div>
  )
}

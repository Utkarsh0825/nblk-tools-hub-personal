"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MoreVertical, Mail, Phone, ChevronLeft, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface EmailCaptureProps {
  onSubmit?: (name: string, email: string) => void
  onBack?: () => void
  onLogoClick?: () => void
}

export default function EmailCapture({ onSubmit, onBack }: EmailCaptureProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [modalType, setModalType] = useState<null | "basic" | "full">(null)
  // Basic form state
  const [basicName, setBasicName] = useState("")
  const [basicEmail, setBasicEmail] = useState("")
  const [basicSector, setBasicSector] = useState("")
  const [isSubmittingBasic, setIsSubmittingBasic] = useState(false)
  // Full form state
  const [fullName, setFullName] = useState("")
  const [fullCompany, setFullCompany] = useState("")
  const [fullIndustry, setFullIndustry] = useState("")
  const [fullZip, setFullZip] = useState("")
  const [fullEmail, setFullEmail] = useState("")
  const [isSubmittingFull, setIsSubmittingFull] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
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

  // Basic report submit (existing logic)
  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!basicName.trim() || !basicEmail.trim() || !basicSector.trim()) return
    setIsSubmittingBasic(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing
    if (onSubmit) onSubmit(basicName.trim(), basicEmail.trim())
    setIsSubmittingBasic(false)
    setModalType(null)
    setShowSuccessModal(true)
  }

  // Full diagnostic submit (placeholder for Microsoft spreadsheet logic)
  const handleFullSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !fullCompany.trim() || !fullIndustry.trim() || !fullZip.trim() || !fullEmail.trim()) return
    setIsSubmittingFull(true)
    // TODO: Replace with actual Microsoft spreadsheet API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmittingFull(false)
    setModalType(null)
    setShowSuccessModal(true)
    // Optionally show a success message
  }

  // Resend logic (duplicate from parent, since no prop is passed)
  const handleResend = async () => {
    if (resendCooldown > 0) return
    // Use the same logic as handleBasicSubmit, but only for the last submitted data
    // You may want to store the last submitted name/email in state if needed
    if (!basicName.trim() || !basicEmail.trim()) return // fallback: use basic form data
    setResendCooldown(60)
    setShowResendSuccess(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate resend
    setTimeout(() => setShowResendSuccess(false), 2500)
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
                  <a href="mailto:admin@nblkconsulting.com" className="hover:text-green-700 text-sm">admin@nblkconsulting.com</a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-green-600" />
                  <a href="tel:+12125983030" className="hover:text-green-700 text-sm">+1 (212) 598-3030</a>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center justify-start max-w-lg mx-auto gap-6 mt-6">
        {/* Header Box */}
        <div className="w-full rounded-lg border border-white/10 hover:border-white/20 p-6 bg-white/5 flex flex-col gap-4">
          <h1 className="text-xl font-medium text-center">Get your basic diagnostic report below</h1>
          <Button
            className="w-full py-6 text-sm bg-white text-black rounded-lg transition-all duration-300 hover:bg-gray-300 shadow"
            onClick={() => setModalType("basic")}
          >
            Get Basic Report Without Signing Up
          </Button>
        </div>
        {/* Button Section Box */}
        <div className="w-full rounded-lg border border-white/10 p-6 hover:border-white/20 bg-white/5 shadow-lg flex flex-col gap-4">
          
          <div className="text-xl font-medium text-center">Want the full version with tailored insights?</div>
          <Button
            className="w-full py-6 text-sm bg-white text-black rounded-lg transition-all duration-300 hover:bg-gray-300 shadow"
            onClick={() => setModalType("full")}
          >
            Unlock Full Diagnostic & Tailored Insights
          </Button>
          
        </div>
        <div className="text-xs text-gray-400 text-center mt-2">
            By signing up, you'll get access to the full detailed report once all modules are complete, the ability to track your progress and receive final staff recommendations
          </div>
      </div>
      {/* Footer: Early version notice */}
      <div className="w-full flex justify-center mt-6 mb-7">
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs text-gray-200 shadow-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          <span>We're currently testing interest in this early version</span>
        </div>
      </div>

      {/* Basic Report Modal */}
      <Dialog open={modalType === "basic"} onOpenChange={() => setModalType(null)}>
        <DialogContent className="bg-black text-white rounded-2xl shadow-2xl border border-white/20 p-0 max-w-lg mx-auto">
          <div className="flex flex-col p-8 gap-4">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-semibold text-white">Get Basic Report</DialogTitle>
              <DialogDescription className="text-sm text-gray-300">
                Enter your details to receive your basic diagnostic report
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBasicSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Preferred Name"
                value={basicName}
                onChange={(e) => setBasicName(e.target.value)}
                className="bg-neutral-900 border border-white/10 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-100"
            required
          />
          <Input
            type="email"
            placeholder="Email"
                value={basicEmail}
                onChange={(e) => setBasicEmail(e.target.value)}
                className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
                required
              />
              <Input
                type="text"
                placeholder="Field of work or business sector"
                value={basicSector}
                onChange={(e) => setBasicSector(e.target.value)}
                className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
            required
          />
          <Button
            type="submit"
                disabled={!basicName.trim() || !basicEmail.trim() || !basicSector.trim() || isSubmittingBasic}
                className="w-full py-4 text-sm bg-white text-black rounded-lg mt-2 transition-all duration-300 hover:bg-gray-300 shadow disabled:opacity-50"
              >
                {isSubmittingBasic ? "Sending..." : "Send"}
              </Button>
            </form>
            <div className="text-xs text-gray-400 text-center mt-4">
              Your information is secure and won't be shared
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Diagnostic Modal */}
      <Dialog open={modalType === "full"} onOpenChange={() => setModalType(null)}>
        <DialogContent className="bg-black text-white rounded-2xl shadow-2xl border border-white/20 p-0 max-w-lg mx-auto">
          <div className="flex flex-col p-8 gap-4">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-semibold text-white">Unlock Full Diagnostic & Tailored Insights</DialogTitle>
              <DialogDescription className="text-l text-gray-300">
                Fill in your details to unlock the full report and tailored recommendations
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFullSubmit} className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Preferred Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
                required
              />
              <Input
                type="text"
                placeholder="Name of Company"
                value={fullCompany}
                onChange={(e) => setFullCompany(e.target.value)}
                className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
                required
              />
              <Input
                type="text"
                placeholder="Industry"
                value={fullIndustry}
                onChange={(e) => setFullIndustry(e.target.value)}
                className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
                required
              />
              <Input
                type="text"
                placeholder="Zip Code"
                value={fullZip}
                onChange={(e) => setFullZip(e.target.value)}
                className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
                required
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={fullEmail}
                onChange={(e) => setFullEmail(e.target.value)}
                className="bg-neutral-900 border border-white/20 text-white placeholder-white/60 rounded-lg px-4 py-4 text-base focus:ring-1 focus:ring-[#006400] focus:outline-none transition-all duration-300"
                required
              />
              <Button
                type="submit"
                disabled={!fullName.trim() || !fullCompany.trim() || !fullIndustry.trim() || !fullZip.trim() || !fullEmail.trim() || isSubmittingFull}
                className="w-full py-4 text-sm bg-white text-black rounded-lg mt-2 transition-all duration-300 hover:bg-gray-300 shadow disabled:opacity-50"
              >
                {isSubmittingFull ? "Submitting..." : "Submit"}
          </Button>
        </form>
            <div className="text-xs text-gray-400 text-center mt-4">
              Your information is secure and won't be shared
            </div>
      </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-black text-white rounded-2xl shadow-2xl border border-white/20 p-0 max-w-lg mx-auto">
          <div className="flex flex-col p-8 items-center">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 200, duration: 0.3 }}
              className="text-center mb-5"
            >
              <CheckCircle className="mx-auto mb-6" size={60} strokeWidth={2.5} color="#fff" fill="none" />
              <h1 className="text-xl font-medium text-white">Report Sent Successfully!</h1>
            </motion.div>
          
              
            {/* Resend Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="text-center mt-2"
            >
              <p className="text-sm text-gray-400 mb-1">Didn't receive the email?</p>
              <span
                onClick={resendCooldown === 0 ? handleResend : undefined}
                className={`text-white/70 underline text-sm cursor-pointer hover:no-underline hover:text-gray-300 transition-colors duration-300 ${resendCooldown > 0 ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
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
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

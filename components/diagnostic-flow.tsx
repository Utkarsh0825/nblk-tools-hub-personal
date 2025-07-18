"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, MoreVertical, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { questionSets } from "@/lib/questions"
import { saveQuestionnaireResponseSimple, generateSessionId } from "@/lib/simple-supabase-api"
import type { DiagnosticAnswer } from "@/app/page"

interface DiagnosticFlowProps {
  toolName: string
  onComplete: (answers: DiagnosticAnswer[]) => void
  onBack: () => void
  onLogoClick: () => void
}

export default function DiagnosticFlow({ toolName, onComplete, onBack, onLogoClick }: DiagnosticFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")

  const questions = questionSets[toolName] || []
  const currentQuestion = questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / questions.length) * 100

  // Generate session ID when component mounts
  useEffect(() => {
    const newSessionId = generateSessionId()
    setSessionId(newSessionId)
    console.log(`Started new session: ${newSessionId} for tool: ${toolName}`)
  }, [toolName])

  const handleAnswer = async (answer: "Yes" | "No") => {
    const newAnswer: DiagnosticAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer,
    }

    setIsSaving(true)
    
    try {
      // Save to database with questionnaire token
      await saveQuestionnaireResponseSimple({
        sessionId,
        toolName,
        questionIndex: currentQuestionIndex,
        questionText: currentQuestion.text,
        answer
      })

      console.log(`Saved answer for question ${currentQuestionIndex + 1}: ${answer}`)

      // Update local state
      const newAnswers = [...answers, newAnswer]
      setAnswers(newAnswers)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        console.log(`Completed questionnaire for ${toolName}`)
        onComplete(newAnswers)
      }
    } catch (error) {
      console.error('Error saving answer:', error)
      // Show user-friendly error message
      alert('There was an error saving your answer. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setAnswers(answers.slice(0, -1))
    }
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black px-4 py-4 flex items-center justify-between border-b border-white/10">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-sm font-medium text-center flex-1">
          {toolName.replace("Diagnostic", "")}
        </h1>
        {/* Modern Dropdown Menu */}
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

      {/* Progress Info */}
      <div className="px-10 mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="flex justify-between h-2 mt-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Question Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col items-center mt-10 px-4"
        >
          <div className="text-center mb-8 px-4">
            <h2 className="text-xl font-semibold leading-snug">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="w-full px-6 max-w-md space-y-4">
            <Button
              variant="outline"
              className="w-full py-6 rounded-lg transition-all bg-neutral-900 border border-white/20 hover:border-white/20 hover:shadow-lg"
              onClick={() => handleAnswer("Yes")}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Yes"}
            </Button>
            <Button
              variant="outline"
              className="w-full py-6 rounded-lg transition-all bg-neutral-900 border border-white/20 hover:border-white/20 hover:shadow-lg"
              onClick={() => handleAnswer("No")}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "No"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

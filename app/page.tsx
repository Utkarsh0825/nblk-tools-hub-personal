"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import LandingPage from "@/components/landing-page"
import ToolsHub from "@/components/tools-hub"
import DiagnosticFlow from "@/components/diagnostic-flow"
import AnalysisScreen from "@/components/analysis-screen"
import PartialReport from "@/components/partial-report"
import EmailCapture from "@/components/email-capture"
import SuccessScreen from "@/components/success-screen"
import ServicePartner from "@/components/service-partner"
import ContactUs from "@/components/contact-us"
import ErrorFallback from "@/components/error-fallback"

export type ViewType =
  | "landing"
  | "tools"
  | "diagnostic"
  | "analysis"
  | "partial-report"
  | "email-capture"
  | "success"
  | "service-partner"
  | "contact"
  | "error"
  | "questionnaire"
  | "results"
  | "admin"

export interface DiagnosticAnswer {
  questionId: string
  question: string
  answer: "Yes" | "No"
}

export interface UserData {
  name: string
  email: string
}

export default function NBLKToolsHub() {
  const [currentView, setCurrentView] = useState<ViewType>("landing")
  const [selectedTool, setSelectedTool] = useState<string>("")
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([])
  const [userData, setUserData] = useState<UserData>({ name: "", email: "" })
  const [score, setScore] = useState<number>(0)
  const [mounted, setMounted] = useState(false)
  const [completedTools, setCompletedTools] = useState<string[]>([])
  const [generatedInsights, setGeneratedInsights] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogoClick = () => {
    setCurrentView("landing")
    setAnswers([])
    setScore(0)
    setSelectedTool("")
    setUserData({ name: "", email: "" })
  }

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName)
    setAnswers([])
    setCurrentView("diagnostic")
  }

  const handleDiagnosticComplete = (diagnosticAnswers: DiagnosticAnswer[]) => {
    setAnswers(diagnosticAnswers)
    const yesCount = diagnosticAnswers.filter((a) => a.answer === "Yes").length
    setScore(yesCount * 10)
    setCurrentView("analysis")

    // Simulate analysis time
    setTimeout(() => {
      setCurrentView("partial-report")
      // Add tool to completedTools if not already present
      setCompletedTools((prev) => {
        if (!prev.includes(selectedTool)) {
          return [...prev, selectedTool]
        }
        return prev
      })
    }, 4000)
  }

  const handleEmailSubmit = async (name: string, email: string) => {
    setUserData({ name, email })

    try {
      await generateAndSendReport(name, email, selectedTool, answers, score)
      // Mark milestone step 3 as complete for this session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('toolsHubMilestoneStep3Complete', 'true');
      }
      // setCurrentView("success") // REMOVE THIS LINE
      // Instead, stay on email-capture and let the modal show
    } catch (error) {
      console.error("Failed to send report:", error)
      // setCurrentView("success") // REMOVE THIS LINE
      // Instead, stay on email-capture and let the modal show
    }
  }

  const generateAndSendReport = async (
    name: string,
    email: string,
    toolName: string,
    answers: DiagnosticAnswer[],
    score: number,
  ) => {
    try {
      // Generate comprehensive report
      const reportResponse = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName, score, answers, name }),
      })

      const reportData = await reportResponse.json()

      if (reportData.success) {
        // Send email with report
        await fetch("/api/send-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            name,
            toolName,
            reportContent: reportData.content,
            score,
          }),
        })
      }
    } catch (error) {
      console.error("Failed to generate/send report:", error)
    }
  }

  const handleRetakeDiagnostic = () => {
    setAnswers([])
    setScore(0)
    setCurrentView("tools")
  }

  const handleResendReport = async () => {
    try {
      await generateAndSendReport(userData.name, userData.email, selectedTool, answers, score)
    } catch (error) {
      console.error("Failed to resend report:", error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <AnimatePresence mode="wait">
        {currentView === "landing" && <LandingPage key="landing" onExploreTools={() => setCurrentView("tools")} />}

        {currentView === "tools" && (
          <ToolsHub key="tools" onToolSelect={handleToolSelect} onLogoClick={handleLogoClick} completedTools={completedTools} />
        )}

        {currentView === "diagnostic" && (
          <DiagnosticFlow
            key="diagnostic"
            toolName={selectedTool}
            onComplete={handleDiagnosticComplete}
            onBack={() => setCurrentView("tools")}
            onLogoClick={handleLogoClick}
          />
        )}

        {currentView === "analysis" && <AnalysisScreen key="analysis" />}

        {currentView === "partial-report" && (
          <PartialReport
            key="partial-report"
            toolName={selectedTool}
            score={score}
            answers={answers}
            onGetFullReport={() => setCurrentView("email-capture")}
            onRetakeDiagnostic={handleRetakeDiagnostic}
            onLogoClick={handleLogoClick}
            businessName={userData.name || "Your Business"}
          />
        )}

        {currentView === "email-capture" && (
          <EmailCapture
            key="email-capture"
            onSubmit={handleEmailSubmit}
            onBack={() => setCurrentView("partial-report")}
            onLogoClick={handleLogoClick}
          />
        )}

        {currentView === "success" && (
          <SuccessScreen
            key="success"
            onBecomePartner={() => setCurrentView("service-partner")}
            onRetakeDiagnostic={handleRetakeDiagnostic}
            onViewPreviousResult={() => setCurrentView("partial-report")}
            onLogoClick={handleLogoClick}
            onResendReport={handleResendReport}
          />
        )}

        {currentView === "service-partner" && (
          <ServicePartner
            key="service-partner"
            onBack={() => setCurrentView("success")}
            onLogoClick={handleLogoClick}
          />
        )}

        {currentView === "contact" && <ContactUs key="contact" onLogoClick={handleLogoClick} />}

        {currentView === "error" && <ErrorFallback key="error" onRetry={() => setCurrentView("landing")} />}
      </AnimatePresence>
    </div>
  )
}

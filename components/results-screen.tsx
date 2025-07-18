"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { DiagnosticAnswer } from "@/app/page"

interface ResultsScreenProps {
  score: number
  answers: DiagnosticAnswer[]
  toolName: string
  onGetDetailedReport: () => void
  onRetakeDiagnostic: () => void
}

export default function ResultsScreen({
  score,
  answers,
  toolName,
  onGetDetailedReport,
  onRetakeDiagnostic,
}: ResultsScreenProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Your business shows strong performance with room for strategic improvements"
    if (score >= 60) return "Your business shows good performance with several areas for improvement"
    return "Your business has significant opportunities for improvement"
  }

  // Generate key insights from "No" answers
  const noAnswers = answers.filter((a) => a.answer === "No")
  const insights = noAnswers.slice(0, 3).map((answer, index) => {
    const icons = [CheckCircle, AlertTriangle, Zap]
    const colors = ["text-green-500", "text-yellow-500", "text-blue-500"]
    const Icon = icons[index]

    return {
      icon: Icon,
      color: colors[index],
      title: getInsightTitle(answer.question, index),
      description: getInsightDescription(answer.question, index),
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-24 pb-8 px-4 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Score Card */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-center">
          <h2 className="text-lg font-semibold mb-4">Overall Score</h2>

          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                className={getScoreColor(score)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{getScoreMessage(score)}</p>
        </Card>

        {/* Key Insights */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className={`p-4 bg-white dark:bg-gray-800 border-l-4 ${
                  index === 0 ? "border-l-blue-500" : "border-l-gray-300 dark:border-l-gray-600"
                } rounded-lg`}
              >
                <div className="flex items-start gap-3">
                  <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Partial Results Notice */}
        <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-sm">Partial Results Shown</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            This is a preview of your diagnostic results. Get the complete report by clicking below.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onRetakeDiagnostic}
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 py-3 rounded-xl"
          >
            Retake Diagnostic
          </Button>

          <Button
            onClick={onGetDetailedReport}
            className="w-full bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 rounded-xl"
            variant="outline"
          >
            Get Detailed Report
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function getInsightTitle(question: string, index: number): string {
  const titles = [
    "Revenue has increased by 23% compared to last quarter, showing strong market performance.",
    "Customer retention rate needs attention. Currently at 68%, industry average is 75%.",
    "Cash flow management requires immediate attention to ensure operational stability.",
  ]
  return titles[index] || "Business insight identified"
}

function getInsightDescription(question: string, index: number): string {
  const descriptions = [
    "Your revenue growth indicates strong market positioning and effective sales strategies.",
    "Focus on customer satisfaction and retention programs to improve long-term value.",
    "Implement better cash flow forecasting and payment collection processes.",
  ]
  return descriptions[index] || "This area requires attention based on your responses."
}

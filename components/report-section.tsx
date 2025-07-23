"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Mail, FileText, CheckCircle, Send, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ReportSectionProps {
  toolName: string
  answers: Array<{ question: string; answer: "Yes" | "No" }>
  questionCount: number
  onBackToTools: () => void
}

export default function ReportSection({ toolName, answers, questionCount, onBackToTools }: ReportSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const noAnswers = answers.filter((a) => a.answer === "No")
  const yesAnswers = answers.filter((a) => a.answer === "Yes")
  const improvementAreas = noAnswers.length

  const generatePartialReport = () => {
    const currentDate = new Date().toLocaleDateString()
    const content = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #006400; padding-bottom: 30px;">
          <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 32px; font-weight: bold;">NBLK Tools Hub</h1>
          <h2 style="color: #006400; font-size: 24px; margin-bottom: 10px;">Diagnostic Summary Report</h2>
          <p style="color: #6b7280; font-size: 16px;">Generated on ${currentDate}</p>
        </div>
        
        <div style="margin-bottom: 40px; background-color: #f9fafb; padding: 30px; border-radius: 12px; border-left: 4px solid #006400;">
          <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Assessment Overview</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="font-size: 32px; font-weight: bold; color: #006400; margin-bottom: 5px;">${questionCount}</div>
              <div style="font-size: 14px; color: #6b7280;">Total Questions</div>
            </div>
            <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="font-size: 32px; font-weight: bold; color: #dc2626; margin-bottom: 5px;">${improvementAreas}</div>
              <div style="font-size: 14px; color: #6b7280;">Areas for Improvement</div>
            </div>
            <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="font-size: 32px; font-weight: bold; color: #059669; margin-bottom: 5px;">${yesAnswers.length}</div>
              <div style="font-size: 14px; color: #6b7280;">Strengths Identified</div>
            </div>
          </div>
          <p><strong>Diagnostic Tool:</strong> ${toolName}</p>
        </div>
        
        ${
          yesAnswers.length > 0
            ? `
          <div style="margin-bottom: 40px;">
            <h3 style="color: #059669; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px;">✅ Your Business Strengths</h3>
            <ul style="list-style: none; padding: 0;">
              ${yesAnswers
                .map(
                  (item) => `
                <li style="margin-bottom: 12px; padding: 15px; background-color: #f0fdf4; border-left: 4px solid #059669; border-radius: 6px;">
                  <strong style="color: #059669;">✓</strong> ${item.question}
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        ${
          noAnswers.length > 0
            ? `
          <div style="margin-bottom: 40px;">
            <h3 style="color: #dc2626; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px;">⚠️ Areas Requiring Attention</h3>
            <ul style="list-style: none; padding: 0;">
              ${noAnswers
                .map(
                  (item) => `
                <li style="margin-bottom: 12px; padding: 15px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px;">
                  <strong style="color: #dc2626;">!</strong> ${item.question}
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <div style="background-color: #eff6ff; padding: 30px; border-radius: 12px; margin-bottom: 40px; border: 1px solid #dbeafe;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">📋 Next Steps</h3>
          <p style="margin: 0; font-style: italic; color: #374151; font-size: 16px;">
            This summary provides an overview of your current business state. For detailed analysis, specific recommendations, 
            and a comprehensive action plan, request your full diagnostic report with personalized insights from our business experts.
          </p>
        </div>
        
        <div style="text-align: center; border-top: 3px solid #006400; padding-top: 30px; color: #6b7280; font-size: 14px;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #1f2937; font-size: 18px;">NBLK Consulting</strong>
          </div>
          <p style="margin: 5px 0;">442 5th Avenue, #2304, New York, NY 10018</p>
          <p style="margin: 5px 0;">Email: admin@nblkconsulting.com | Phone: (212) 598-3030</p>
          <p style="margin: 15px 0 0 0; font-style: italic;">Empowering Business Clarity Through Data-Driven Insights</p>
        </div>
      </div>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>NBLK Diagnostic Summary - ${toolName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { margin: 0; padding: 20px; font-family: 'Inter', Arial, sans-serif; }
              @media print {
                body { margin: 0; }
                @page { margin: 1in; }
              }
            </style>
          </head>
          <body>
            ${content}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const generateFullReport = async () => {
    setIsGenerating(true)

    try {
      const prompt = `You are a senior business consultant at NBLK Consulting. Generate a comprehensive diagnostic report for "${toolName}" based on the following client responses:

CLIENT INFORMATION:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || "Not provided"}
- Assessment: ${toolName}

RESPONSES ANALYSIS:
${answers.map((item, index) => `${index + 1}. ${item.question} - ${item.answer}`).join("\n")}

REPORT STRUCTURE REQUIRED:
1. EXECUTIVE SUMMARY (3-4 sentences highlighting key findings)

2. STRENGTHS ANALYSIS (Based on "Yes" responses)
   - List and explain each strength
   - How these strengths can be leveraged

3. AREAS FOR IMPROVEMENT (Based on "No" responses)
   - Detailed analysis of each gap
   - Impact on business operations
   - Root cause analysis where applicable

4. STRATEGIC RECOMMENDATIONS
   - Prioritized action items (High/Medium/Low priority)
   - Specific implementation steps
   - Timeline suggestions
   - Resource requirements

5. SUCCESS METRICS & KPIs
   - How to measure improvement
   - Benchmarks to track progress

6. NEXT STEPS
   - Immediate actions (30 days)
   - Medium-term goals (90 days)
   - Long-term objectives (6-12 months)

Please provide detailed, actionable insights that demonstrate the value of professional business consulting. Use professional business language appropriate for C-level executives and business owners.`

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2500,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      const report = data.choices[0].message.content

      setReportGenerated(true)
      setIsModalOpen(false)

      // Generate and download full report PDF
      generateFullReportPDF(report)
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Error generating report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFullReportPDF = (report: string) => {
    const currentDate = new Date().toLocaleDateString()
    const content = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #006400; padding-bottom: 30px;">
          <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 32px; font-weight: bold;">NBLK Tools Hub</h1>
          <h2 style="color: #006400; font-size: 24px; margin-bottom: 10px;">Comprehensive Diagnostic Report</h2>
          <p style="color: #6b7280; font-size: 16px;">Generated on ${currentDate}</p>
        </div>
        
        <div style="margin-bottom: 40px; background-color: #f9fafb; padding: 30px; border-radius: 12px; border-left: 4px solid #006400;">
          <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Client Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ""}
          <p><strong>Assessment:</strong> ${toolName}</p>
          <p><strong>Date:</strong> ${currentDate}</p>
        </div>
        
        <div style="margin-bottom: 40px; white-space: pre-line; line-height: 1.8; font-size: 16px;">
          ${report.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
        </div>
        
        <div style="text-align: center; border-top: 3px solid #006400; padding-top: 30px; color: #6b7280; font-size: 14px;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #1f2937; font-size: 18px;">NBLK Consulting</strong>
          </div>
          <p style="margin: 5px 0;">442 5th Avenue, #2304, New York, NY 10018</p>
          <p style="margin: 5px 0;">Email: admin@nblkconsulting.com</p>
          <p style="margin: 15px 0 0 0; font-style: italic;">Empowering Business Clarity Through Data-Driven Insights</p>
        </div>
      </div>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>NBLK Comprehensive Report - ${toolName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { margin: 0; padding: 20px; font-family: 'Inter', Arial, sans-serif; }
              @media print {
                body { margin: 0; }
                @page { margin: 1in; }
              }
            </style>
          </head>
          <body>
            ${content}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen py-8 px-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={onBackToTools} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">Diagnostic Results</h1>
        </div>

        {reportGenerated && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Your comprehensive report has been generated and is on its way to your inbox!
            </AlertDescription>
          </Alert>
        )}

        {/* Results Summary */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              Your Diagnostic Summary
            </CardTitle>
            <CardDescription className="text-lg">{toolName} - Instant Analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border">
                <div className="text-3xl font-bold text-green-600 mb-2">{questionCount}</div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300">Questions Answered</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-xl border">
                <div className="text-3xl font-bold text-red-600 mb-2">{improvementAreas}</div>
                <div className="text-sm font-medium text-red-700 dark:text-red-300">Areas for Improvement</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border">
                <div className="text-3xl font-bold text-blue-600 mb-2">{yesAnswers.length}</div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Strengths Identified</div>
              </div>
            </div>

            {yesAnswers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Your Business Strengths
                </h4>
                <div className="space-y-2">
                  {yesAnswers.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item.question}</span>
                    </div>
                  ))}
                  {yesAnswers.length > 3 && (
                    <p className="text-sm text-muted-foreground pl-7">
                      +{yesAnswers.length - 3} more strengths identified in your full report
                    </p>
                  )}
                </div>
              </div>
            )}

            {noAnswers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-orange-600 flex items-center gap-2">
                  <X className="h-5 w-5" />
                  Priority Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {noAnswers.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item.question}</span>
                    </div>
                  ))}
                  {noAnswers.length > 3 && (
                    <p className="text-sm text-muted-foreground pl-7">
                      +{noAnswers.length - 3} more areas analyzed in your full report
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button onClick={generatePartialReport} variant="outline" className="flex-1" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Summary (PDF)
              </Button>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Get Full Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Get Your Comprehensive Report</DialogTitle>
                    <DialogDescription>
                      Enter your details to receive a detailed analysis with specific recommendations and action plans.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <Button
                      onClick={generateFullReport}
                      disabled={!formData.name || !formData.email || isGenerating}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isGenerating ? (
                        "Generating Report..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Generate Full Report
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg border-l-4 border-blue-500">
              <strong>What's included in your full report:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Executive summary with key findings</li>
                <li>Detailed analysis of strengths and improvement areas</li>
                <li>Prioritized action plan with implementation timeline</li>
                <li>Success metrics and KPIs to track progress</li>
                <li>Industry best practices and recommendations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Company Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p className="font-semibold text-lg mb-2">NBLK Consulting</p>
          <p>442 5th Avenue, #2304, New York, NY 10018</p>
          <p>Email: admin@nblkconsulting.com</p>
          <p className="mt-2 italic">Empowering Business Clarity Through Data-Driven Insights</p>
        </div>
      </div>
    </motion.div>
  )
}

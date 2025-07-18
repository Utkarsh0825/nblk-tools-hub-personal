"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Database, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Mail, Phone } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface ToolsHubProps {
  onToolSelect: (toolName: string) => void
  onLogoClick: () => void
  completedTools?: string[]
}

const tools = [
  {
    id: "data-hygiene",
    name: "Data Hygiene & Business Clarity Diagnostic",
    description: "Evaluate if your data systems are aligned, accessible, and clean across teams",
    icon: Database,
  },
  {
    id: "marketing-effectiveness",
    name: "Marketing Effectiveness Diagnostic",
    description: "Discover if your marketing efforts are reaching the right people at the right time",
    icon: TrendingUp,
  },
  {
    id: "cash-flow",
    name: "Cash Flow & Financial Clarity Diagnostic",
    description: "Understand and optimize your business cash flow and spending",
    icon: DollarSign,
  },
]

export default function ToolsHub({ onToolSelect, onLogoClick, completedTools = [] }: ToolsHubProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index)
  }

  useEffect(() => {
    if (expandedIndex === null) return;
    const handleClick = (event: MouseEvent) => {
      if (
        cardsContainerRef.current &&
        !cardsContainerRef.current.contains(event.target as Node)
      ) {
        setExpandedIndex(null)
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [expandedIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col bg-black text-white"
    >
      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-black backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-top justify-between">
          <span className="text-l font-base text-gray-400 ">
            <button
              onClick={onLogoClick}
              className="focus:outline-none group bg-transparent border-0 p-0 m-0 flex flex-col items-center"
              aria-label="Back to landing page"
              type="button"
            >
              <Image
                src="/nblk-logo-ai.png"
                alt="NBLK Consulting"
                width={115}
                height={115}
                className="mt-3 mb-3 transition-transform group-hover:scale-105"
              />
            </button>
            Select a diagnostic tool
          </span>
          {/* Modern Dropdown Menu */}
          
        </div>
      </header>

      {/* Contact Us Dialog */}
  

      {/* Page Content */}
      <main className="flex-1 px-6 py-2 max-w-5xl mx-auto w-full">
        {/* Expandable Cards */}
        <div className="space-y-3" ref={cardsContainerRef}>
          {tools.map((tool, index) => {
            const isOpen = expandedIndex === index
            return (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
          className="cursor-pointer"
        >
          <Card
            onClick={() => toggleExpand(index)}
            className="transition-all bg-neutral-900 border border-white/10 hover:border-white/20"
          >
                  <CardHeader className="flex flex-row items-center gap-5">
                    <div className="p-0">
                      {tool.icon && (
                        <tool.icon className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <CardTitle className="text-white text-base tracking-normal">{tool.name}</CardTitle>
                  </CardHeader>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <CardContent className="pt-0 pb-4 px-11">
                  <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-gray-300 mb-4">{tool.description}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToolSelect(tool.name)
                    }}
                    className="text-sm w-full bg-white text-black hover:bg-gray-300"
                    size="lg"
                  >
                    Start
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                        </motion.div>
                </CardContent>
                    )}
                  </AnimatePresence>
              </Card>
            </motion.div>
            )
          })}
        </div>
        {/* Progress Tracker */}
        {completedTools.length > 0 && (
          <div className="w-full flex justify-center mt-8 mb-2">
            <div className="text-xs text-gray-400 bg-neutral-900/80 px-4 py-2 rounded-full shadow-sm border border-white/10">
              {completedTools.length} of 3 completed
            </div>
          </div>
        )}
      </main>

        {/* Footer */}
      <footer className="sticky left-0 right-0 bottom-0 py-6 bg-black backdrop-blur-md border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">Log-In or Sign-Up Not Required To Use Tool</p>
      </div>
      </footer>
    </motion.div>
  )
}

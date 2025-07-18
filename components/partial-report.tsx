"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X as CloseIcon, CheckCircle, XCircle, EyeOff, MoreVertical, Mail, Phone, AlertTriangle, TrendingUp, Lock, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { DiagnosticAnswer } from "@/app/page"

interface PartialReportProps {
  toolName: string
  score: number
  answers: DiagnosticAnswer[]
  onGetFullReport: () => void
  onRetakeDiagnostic: () => void
  onLogoClick: () => void
  businessName: string // Added prop for business name
}

export default function PartialReport({
  toolName,
  score,
  answers,
  onGetFullReport,
  onRetakeDiagnostic,
  onLogoClick,
  businessName, // Added prop
}: PartialReportProps) {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [lockedIdx, setLockedIdx] = useState<number | null>(null);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  // Show walkthrough on first visit only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('toolsHubWalkthroughSeen');
      if (!seen) {
        setWalkthroughOpen(true);
        localStorage.setItem('toolsHubWalkthroughSeen', 'true');
      }
    }
  }, []);
  const levels = [
    {
      label: 'Level 1: Getting Started',
      description: 'You’ve taken the first step! At this level, your business is just beginning to organize things.'
    },
    {
      label: 'Level 2: Builder',
      description: 'Now you’re building a stronger system. You’ve started using tools to keep your work in place.'
    },
    {
      label: 'Level 3: Operator',
      description: 'You’ve got things running smoothly! Work is faster and more clear.'
    },
    {
      label: 'Level 4: Pro Optimizer',
      description: 'You’re a pro now! Everything is organized, fast, and smart. You make better decisions because your data is clean.'
    },
  ];

  const getScoreMessage = (score: number) => {
    if (score === 100) return "Excellent! Your business is performing well, but we can help you go even further"
    if (score === 0) return "No worries: this is the first step to getting clear. Let's fix this together"
    if (score >= 80) return "Your business shows strong performance with room for strategic improvements"
    if (score >= 60) return "Your business shows good performance with several areas for improvement"
    return "Your business has significant opportunities for improvement and growth"
  }

  const generateInsights = (answers: DiagnosticAnswer[], toolName: string) => {
    const noAnswers = answers.filter((a) => a.answer === "No")
    const insights = []

    if (toolName.includes("Data Hygiene")) {
      if (noAnswers.some((a) => a.question.includes("centralized") || a.question.includes("one place"))) {
        insights.push({
          icon: AlertTriangle,
          color: "text-orange-600",
          title: "CRM System Missing",
          description: "Leading to fragmented data access and inefficient customer management.",
        })
      }
      if (noAnswers.some((a) => a.question.includes("communicate") || a.question.includes("talk to each other"))) {
        insights.push({
          icon: TrendingUp,
          color: "text-blue-600",
          title: "System Integration Gap",
          description: "Your business tools need better integration to streamline operations.",
        })
      }
      if (noAnswers.some((a) => a.question.includes("reports") || a.question.includes("mistakes"))) {
        insights.push({
          icon: CheckCircle,
          color: "text-[#006400]",
          title: "Data Quality Issues",
          description: "Manual processes are creating errors in your business reports.",
        })
      }
    } else if (toolName.includes("Marketing")) {
      if (noAnswers.some((a) => a.question.includes("ads") || a.question.includes("emails"))) {
        insights.push({
          icon: AlertTriangle,
          color: "text-orange-600",
          title: "Marketing Attribution Missing",
          description: "You can't track which marketing efforts drive actual results.",
        })
      }
      if (noAnswers.some((a) => a.question.includes("target") || a.question.includes("customers"))) {
        insights.push({
          icon: TrendingUp,
          color: "text-blue-600",
          title: "Audience Targeting Needs Work",
          description: "Better customer segmentation could improve your marketing ROI.",
        })
      }
      if (noAnswers.some((a) => a.question.includes("feedback") || a.question.includes("reviews"))) {
        insights.push({
          icon: CheckCircle,
          color: "text-[#006400]",
          title: "Customer Feedback Gap",
          description: "Missing systematic feedback collection from your customers.",
        })
      }
    } else if (toolName.includes("Cash Flow")) {
      if (noAnswers.some((a) => a.question.includes("forecast") || a.question.includes("3 months"))) {
        insights.push({
          icon: AlertTriangle,
          color: "text-orange-600",
          title: "Cash Flow Forecasting Missing",
          description: "You're making financial decisions without visibility into future cash needs.",
        })
      }
      if (noAnswers.some((a) => a.question.includes("overdue") || a.question.includes("follow up"))) {
        insights.push({
          icon: TrendingUp,
          color: "text-blue-600",
          title: "Payment Collection Process Needed",
          description: "Automated follow-up could significantly improve cash flow timing.",
        })
      }
      if (noAnswers.some((a) => a.question.includes("buffer") || a.question.includes("emergencies"))) {
        insights.push({
          icon: CheckCircle,
          color: "text-[#006400]",
          title: "Emergency Fund Missing",
          description: "Your business lacks financial reserves for unexpected situations.",
        })
      }
    }

    // Ensure exactly 3 insights
    while (insights.length < 3 && noAnswers.length > 0) {
      insights.push({
        icon: AlertTriangle,
        color: "text-orange-600",
        title: "Business Process Gap",
        description: noAnswers[insights.length]?.question || "Additional improvement opportunity identified.",
      })
    }

    return insights.slice(0, 3)
  }

  const insights = generateInsights(answers, toolName)

  // Calculate the average score from the leaderboard
  

  // Generate and persist random scores for other businesses for the session
  function getRandomScore(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  let sessionScores: number[] | null = null;
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('toolsHubLeaderboardScores');
    if (stored) {
      try {
        sessionScores = JSON.parse(stored);
      } catch {}
    }
    if (!sessionScores || sessionScores.length !== 2) {
      sessionScores = [getRandomScore(20, 55), getRandomScore(40, 60)];
      sessionStorage.setItem('toolsHubLeaderboardScores', JSON.stringify(sessionScores));
    }
  } else {
    sessionScores = [getRandomScore(20, 55), getRandomScore(40, 60)];
  }
  const otherBusinesses = [
    { name: "Other Business", score: sessionScores[0] },
    { name: "Other Business", score: sessionScores[1] },
    { name: businessName, score: score }, // Current business
  ];
  // Remove duplicate if businessName matches a mock
  let allBusinesses = otherBusinesses.filter(
    (entry, idx, arr) =>
      arr.findIndex(e => e.name === entry.name && e.score === entry.score) === idx
  );
  // Sort descending by score
  allBusinesses.sort((a, b) => b.score - a.score);
  // Take top 3 for leaderboard
  const leaderboard = allBusinesses.slice(0, 3);
  const average = Math.round(
    leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length
  );
  // Achievement badge logic based on new score ranges
  let achievementBadge = {
    icon: EyeOff,
    color: 'bg-gray-600',
    label: 'Level 1: Getting Started',
    description: 'Every journey begins with a step.'
  }
  if (score >= 0 && score <= 30) {
    achievementBadge = {
      icon: EyeOff,
      color: 'bg-gray-600',
      label: 'Level 1: Getting Started',
      description: 'Every journey begins with a step.'
    }
  } else if (score >= 31 && score <= 70) {
    achievementBadge = {
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      label: 'Level 2: Builder',
      description: 'You’re building a strong foundation!'
    }
  } else if (score >= 71 && score <= 90) {
    achievementBadge = {
      icon: TrendingUp,
      color: 'bg-blue-600',
      label: 'Level 3: Operator',
      description: 'You’re running a solid operation!'
    }
  } else if (score >= 91 && score <= 100) {
    achievementBadge = {
      icon: CheckCircle,
      color: 'bg-green-600',
      label: 'Level 4: Pro Optimizer',
      description: 'You’re among the best—keep optimizing!'
    }
  }

  // Calculate points to next level
  let pointsToNext = null;
  let nextLevelLabel = '';
  if (score >= 0 && score <= 30) {
    pointsToNext = 31 - score;
    nextLevelLabel = 'Level 2: Builder';
  } else if (score >= 31 && score <= 70) {
    pointsToNext = 71 - score;
    nextLevelLabel = 'Level 3: Operator';
  } else if (score >= 71 && score <= 90) {
    pointsToNext = 91 - score;
    nextLevelLabel = 'Level 4: Pro Optimizer';
  } else if (score >= 91) {
    pointsToNext = null;
  }

  // Determine progress bar color based on score
  let progressBarColor = 'bg-green-500'
  if (score <= 45) {
    progressBarColor = 'bg-red-500'
  } else if (score <= 79) {
    progressBarColor = 'bg-yellow-400'
  } else {
    progressBarColor = 'bg-green-500'
  }

  // Calculate performance text based on average score
  let performanceText = '';
  if (score > average) {
    const percent = Math.round(((score - average) / average) * 100);
    performanceText = `You are performing better than ${percent}% of similar businesses.`;
  } else if (score < average) {
    const percent = Math.round(((average - score) / average) * 100);
    performanceText = `You are performing worse than ${percent}% of similar businesses.`;
  } else {
    performanceText = `You are performing on par with similar businesses.`;
  }

  // Milestone tracker logic
  // Use the same recommendations as backend
  function getMilestoneRecommendations(toolName: string) {
    if (toolName.includes("Data Hygiene")) {
      return [
        "Implement a centralized Customer Relationship Management (CRM) system",
        "Establish automated data synchronization between key business systems",
        "Create standardized data entry procedures and training protocols",
        "Set up automated reporting dashboards for real-time business metrics",
      ];
    } else if (toolName.includes("Marketing")) {
      return [
        "Implement marketing attribution tracking using Google Analytics 4",
        "Develop detailed buyer personas based on your best customers",
        "Set up automated customer feedback collection systems",
        "Create consistent brand messaging across all marketing channels",
      ];
    } else if (toolName.includes("Cash Flow")) {
      return [
        "Create rolling 13-week cash flow forecasts updated weekly",
        "Implement automated invoicing and payment reminder systems",
        "Establish business emergency fund equal to 3-6 months operating expenses",
        "Set up weekly financial dashboards with key metrics",
      ];
    }
    return [
      "Implement systematic processes to address identified operational gaps",
      "Establish regular review cycles to monitor progress",
      "Consider automation tools to reduce manual work",
      "Set up clear metrics and KPIs to track improvement",
    ];
  }

  const milestoneRecs = getMilestoneRecommendations(toolName);
  // Pointer position logic
  let pointerIdx = 0;
  if (score >= 0 && score <= 30) pointerIdx = 0;
  else if (score >= 31 && score <= 60) pointerIdx = 1;
  else if (score >= 61 && score <= 85) pointerIdx = 2;
  else if (score >= 86) pointerIdx = 3;

  // Milestone step descriptions
  const milestoneSteps = [
    {
      label: 'Take Diagnostic',
      completed: true,
      description: 'You completed the module diagnostic to assess your current business status'
    },
    {
      label: 'Free Insights',
      completed: true,
      description: 'This is a preview of your results. See where you stand!'
    },
    {
      label: 'Enter Email',
      completed: false,
      description: 'Want a detailed breakdown for this module? Enter your email & we’ll send it right over'
    },
    {
      label: 'Sign-up',
      completed: false,
      description: 'Sign up to unlock all features: multi-page report, tailored recommendations and staffing match tool'
    },
  ];

  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 md:px-8 text-white bg-black"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black px-4 py-4 flex items-center border-b border-white/10">
          <button onClick={onRetakeDiagnostic} className="p-2">
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-sm font-medium text-center flex-1">
          {toolName.replace("Diagnostic", "")}
        </h1>
          {/* Modern Dropdown Menu */}
          
        </header>

        {/* Contact Us Dialog */}
        
        {/* Score Card */}
        <div className="rounded-lg border border-white/10 p-6 bg-gradient-to-br from-neutral-900/80 to-black/80 shadow-lg flex flex-col items-center gap-6">
          {/* Modern Score Progress Bar */}
          <div className="w-full max-w-md flex flex-col items-center relative">
            {/* Floating Score Badge - now tracks progress */}
            <div className="absolute -top-10 z-30 transition-all duration-500"
              style={{
                left: `calc(${score}% - 10px)`, // 48px is half the badge width (96px)
                minWidth: '96px',
                maxWidth: '120px',
                pointerEvents: 'none',
                // Clamp so it doesn't overflow
                transform:
                  score <= 5
                    ? 'translateX(0)' // left edge
                    : score >= 95
                    ? 'translateX(-100%)' // right edge
                    : 'translateX(-50%)', // center
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Gamified Glow */}
                <div
                  className={`absolute inset-0 blur-xl opacity-60 rounded-full animate-pulse ${progressBarColor.replace('bg-', 'bg-')}`}
                  style={{ zIndex: -1 }}
                />
                <div className={`${progressBarColor} text-black font-bold text-3xl rounded-full px-8 py-3 shadow-2xl border-4 border-white/20 flex flex-col items-center relative`}>
                  {score}
                </div>
                {/* Pointer/triangle */}
                <div
                  className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-white/30"
                  // style={{ borderTopColor: progressBarColor.replace('bg-', '').replace('-500', '-500').replace('-400', '-400') }}
                />
              </div>
            </div>
            {/* Progress Bar with Average Marker */}
            <div className="w-full mt-11 relative">
              <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden relative">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${progressBarColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              
            </div>
            {/* SECOND PROGRESS BAR: Average Only */}
            {/* Lighter color, smaller size, floating badge at average */}
            {(() => {
              // Average bar color logic 
              let avgBarColor = 'bg-green-500';
              if (average <= 45) {
                avgBarColor = 'bg-red-500';
              } else if (average <= 79) {
                avgBarColor = 'bg-yellow-400';
              } else {
                avgBarColor = 'bg-green-500';
              }
              // Bar height and badge size
              return (
                <>
                  <div className="w-full relative mt-9">
                    {/* Floating Average Badge */}
                    <div
                      className="absolute -top-11 z-20 transition-all duration-500"
                      style={{
                        left: `calc(${average}% )`,
                        minWidth: '48px',
                        maxWidth: '64px',
                        pointerEvents: 'none',
                        transform:
                          average <= 5
                            ? 'translateX(0)'
                            : average >= 95
                            ? 'translateX(-100%)'
                            : 'translateX(-50%)',
                      }}
                    >
                      <div className="relative flex flex-col items-center">
                        <div className={`${avgBarColor} text-black font-bold text-base rounded-full px-4 py-1 shadow border-2 border-white/30 flex flex-col items-center relative`}>
                          {average}
                        </div>
                        {/* Pointer/triangle */}
                        <div
                          className={`w-0 h-0 border-l-4 border-r-4 border-t-4 border-white/40 border-l-transparent border-r-transparent`}
                          
                        />
                      </div>
                    </div>
                    {/* Average Progress Bar */}
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${avgBarColor}`}
                        style={{ width: `${average}%` }}
                      />
                    </div>
                  </div>
                  {/* Legend for the two bars */}
                  <div className="flex gap-6 items-center justify-center mt-8 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${progressBarColor} border border-white/20`} />
                      <span className="text-xs text-gray-300">Your Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${avgBarColor} border border-white/20`} />
                      <span className="text-xs text-gray-300">Average Score</span>
                    </div>
                  </div>
                </>
              );
            })()}
            {/* Score Range Text */}
            {/* <div className="text-sm text-white/80 mt-2">{score}/100</div> */}
            {/* Average Text */}
            
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-lg font-medium text-center">{getScoreMessage(score)}</p>
            <div className="text-sm text-gray-400 ">{performanceText}</div>
          </div>
         {/* Achievement Badge */}
         <div className="w-full flex flex-col items-center justify-center mt-2 relative">
            {/* Walkthrough modal overlay */}
           <Dialog open={walkthroughOpen} onOpenChange={setWalkthroughOpen}>
             <DialogContent className="max-w-xl bg-black border border-white/20">
               <div className="flex flex-col items-left gap-4">
                 {/* Header with close button */}
                 <div className="flex items-left justify-between w-full mb-1">
                   <div className="text-lg font-semibold text-white">Level Guide</div>
                   <button
                     aria-label="Close walkthrough"
                     className="text-white hover:bg-white/10 rounded-full p-1.5 ml-2"
                     onClick={() => setWalkthroughOpen(false)}
                   >
                     <CloseIcon className="w-5 h-5" />
                   </button>
                 </div>
                 
                 {/* Badge row for walkthrough (no animation) */}
                 <div className="w-full flex items-center justify-center gap-2 mb-4">
                   {levels.map((level, idx) => {
                     const isActive = walkthroughStep === idx;
                     return (
                       <div
                         key={level.label}
                         className={`flex flex-col items-center ${isActive ? 'z-20' : 'opacity-40'} mx-2`}
                       >
                         <div className={`rounded-full border border-white/30 shadow-sm ${isActive ? 'bg-neutral-900/80 text-white font-semibold px-6 py-2.5 text-base' : 'bg-gray-800 text-white font-normal px-3 py-1.5 text-xs'}`}
                         >
                           {level.label.replace(/Level \d+: /, '')}
                         </div>
                       </div>
                     )
                   })}
                 </div>
                 {/* Level info card */}
                 <div className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                   <div className="font-semibold text-white mb-2">{levels[walkthroughStep].label}</div>
                   <div className="text-gray-300 text-sm p-2">{levels[walkthroughStep].description}</div>
                 </div>
                 {/* Navigation controls with arrow icons */}
                 <div className="flex gap-3 justify-center mt-2">
                   <button
                     className="p-2 rounded-full bg-white/10 text-white border border-white/20 disabled:opacity-30 flex items-center justify-center"
                     onClick={() => setWalkthroughStep(walkthroughStep - 1)}
                     disabled={walkthroughStep === 0}
                     aria-label="Previous"
                   >
                     <ChevronLeft className="w-5 h-5" />
                   </button>
                   <button
                     className="p-2 rounded-full bg-white/10 text-white border border-white/20 disabled:opacity-30 flex items-center justify-center"
                     onClick={() => setWalkthroughStep(walkthroughStep + 1)}
                     disabled={walkthroughStep === levels.length - 1}
                     aria-label="Next"
                   >
                     <ChevronRight className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </DialogContent>
           </Dialog>
            <div className="w-full max-w-xl flex items-center justify-center" style={{ height: '60px' }}>
              {levels.map((level, idx) => {
                const isCurrent = achievementBadge.label === level.label;
                return (
                  <div
                    key={level.label}
                    className={`flex flex-col items-center ${isCurrent ? 'mx-2 z-20' : 'mx-1 opacity-50 scale-95'}`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full border border-white/30 shadow-sm ${isCurrent ? 'bg-neutral-900/80 text-white text-sm px-10 py-4 font-semibold' : 'bg-gray-800 text-white text-xs px-6 py-2 font-normal'} cursor-pointer`}
                      onClick={() => {
                        setWalkthroughStep(idx);
                        setWalkthroughOpen(true);
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Show info for ${level.label}`}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setWalkthroughStep(idx);
                          setWalkthroughOpen(true);
                        }
                      }}
                    >
                      {level.label}
                    </div>
                    {/* Tooltip on hover for current badge remains */}
                    {isCurrent && pointsToNext !== null && nextLevelLabel && (
                      <div className="relative">
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-4 py-2 rounded-lg bg-black/70 text-xs text-gray-200 shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                          You are {pointsToNext} point{pointsToNext === 1 ? '' : 's'} away from becoming a {nextLevelLabel.replace('Level 2: ', '').replace('Level 3: ', '').replace('Level 4: ', '').toLowerCase()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
         </div>
        </div>

        {/* Leaderboard Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-0">Leaderboard</h2>
          <div className="rounded-lg border border-white/10 p-5 bg-white/5 shadow-lg mt-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-base text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="py-2 px-3 font-medium">Rank</th>
                    <th className="py-2 px-3 font-medium">Business</th>
                    <th className="py-2 px-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => {
                    const isCurrent = entry.name === businessName && entry.score === score
                    return (
                      <tr
                        key={entry.name + entry.score}
                        className={
                          isCurrent
                            ? `font-bold border-b border-white/10 ${progressBarColor} bg-opacity-10`
                            : "border-b border-white/10"
                        }
                      >
                        <td className="py-2 px-3">{idx + 1}</td>
                        <td className="py-2 px-3 flex items-center gap-2">
                          {isCurrent && (
                            <span className={`inline-block text-black text-sm font-semibold rounded px-2 py-0.5 mr-2 ${progressBarColor}`}>You</span>
                          )}
                          <span className={isCurrent ? '' : 'blur-[2px] select-none'}>{entry.name}</span>
                        </td>
                        <td className="py-2 px-3">{entry.score}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              
            </div>
          </div>
        </div>
        {/* End Leaderboard Section */}

        {/* Key Insights */}
        <div className="space-y-4">
          <h2 className="text-lg pt-4 font-semibold">Initial Insights & Challenges</h2>
          
          {insights.map((insight, index) => (
            <div key={index} className="rounded-lg border border-white/10 hover:border-white/20 p-6 bg-white/5 flex gap-5 items-start">
              <insight.icon className="text-white mt-1 shrink-0 stroke-2" />
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-1 text-white/90">{insight.title}</h4>
                <p className="text-white/60 text-sm">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Milestone Tracker Section */}
        <div className="mt-1 z-0">
          <h2 className="text-lg font-semibold pt-4 mb-4 text-left">Track Milestones</h2>
          <div className="rounded-lg border border-white/10 p-10 bg-white/5 shadow-lg flex flex-col items-center w-full mx-auto z-0">
            {/* Only keep the alternative circle step tracker for milestones */}
            <div className="w-full max-w-3xl mx-auto items-center">
              <div className="flex items-left w-full">
                {milestoneSteps.map((step, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  const isExpanded = expandedStep === idx;
                  return (
                    <div key={step.label} className="flex-1 flex flex-col">
                      <div className="flex items-center w-full">
                        {/* Circle */}
                        <div className={`flex items-center justify-center rounded-full border-2 ${step.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'} w-9 h-9 font-semibold text-base`}>
                          {step.completed ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        {/* Line to next step */}
                        {!isLast && (
                          idx === 1 ? (
                            // Special case: line after step 2 is half green, half gray
                            <div className="flex-1 flex h-1 min-w-[32px] mx-2 rounded-full overflow-hidden">
                              <div className="w-1/3 h-full bg-green-500 rounded-l-full" />
                              <div className="w-2/3 h-full bg-gray-300 rounded-r-full" />
                            </div>
                          ) : (
                            <div className={`flex-1 h-1 mx-2 rounded-full ${step.completed && arr[idx+1].completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          )
                        )}
                      </div>
                      {/* Label with dropdown chevron */}
                      <button
                        className={`mt-3 text-sm w-max flex items-center gap-2 focus:outline-none ${step.completed ? 'text-white font-semibold' : 'text-gray-400 font-normal'}`}
                        onClick={() => setExpandedStep(isExpanded ? null : idx)}
                        aria-expanded={isExpanded}
                        aria-controls={`milestone-desc-${idx}`}
                      >
                        {step.label}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {/* Description dropdown */}
                      <div
                        id={`milestone-desc-${idx}`}
                        className={`transition-all duration-200 text-sm pr-5 text-gray-300 ${isExpanded ? 'max-h-32 opacity-100 mt-1' : 'max-h-0 opacity-0 overflow-hidden'}`}
                        style={{ minWidth: '220px' }}
                      >
                        {step.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* End Milestone Tracker Section */}

        {/* Partial Results Warning */}
        {/* <div className="flex gap-3 items-start border-l-4 border-yellow-400 rounded-lg p-5 bg-yellow-900/20 text-yellow-100">
          <EyeOff className="h-5 w-5 mt-2 text-yellow-200"/>
          <div className="text-sm leading-snug">
            <p className="font-semibold text-yellow-200 py-1 px-1">Partial Results Shown</p>
            <p className="text-white-100/90 px-1">
              This is a preview of your diagnostic results. Get a detailed report by clicking below.
            </p>
          </div>
        </div> */}

        {/* Footer */}
        <footer className="sticky left-0 right-0 bottom-0 py-2 bg-black backdrop-blur-md border-t border-white/10">
          <div className="max-w-5xl mx-auto px-1 py-5 flex gap-2 items-center justify-between">
            <Button
              onClick={onRetakeDiagnostic}
              className="flex-1 bg-black text-white border border-white hover:bg-black-100 rounded-lg"
            >
              Retake Diagnostic
            </Button>
            <Button
              onClick={onGetFullReport}
              className="flex-1 bg-white text-black hover:bg-gray-300 rounded-lg"
            >
              Get Detailed Report
            </Button>
          </div>
        </footer>
      </div>
    </motion.div>
  )
}

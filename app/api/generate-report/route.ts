import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { toolName, score, answers, name } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found - using intelligent fallback")
      const fallbackInsights = generateStructuredFallback(answers, toolName);
      const fallbackContent = generateIntelligentReport(toolName, score, answers, name);
      return NextResponse.json({
        success: true,
        insights: fallbackInsights,
        content: fallbackContent,
        source: "intelligent_fallback",
      })
    }

    const prompt = `You are a diagnostic business analyst. Analyze the following YES/NO questions and answers from the user for the ${toolName} tool. Based on these, create 3 sharp insights. Then, write a detailed, professional, 1-page diagnostic report for a small business using data visuals and tables where needed. Focus on clarity and action steps.

Client: ${name}
Tool: ${toolName}
Score: ${score}/100

Questions and Answers:
${answers.map((a: any, i: number) => `${i + 1}. ${a.question} - ${a.answer}`).join("\n")}

Create a comprehensive business diagnostic report with:
1. Executive Summary
2. Key Insights (exactly 3)
3. Strategic Recommendations (5-7 actionable items)
4. Implementation Timeline
5. Success Metrics

Limit output to 600-800 words for a 1-page equivalent.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional business consultant specializing in small business diagnostics and strategic planning.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status}`)
      const fallbackInsights = generateStructuredFallback(answers, toolName);
      const fallbackContent = generateIntelligentReport(toolName, score, answers, name);
      return NextResponse.json({
        success: true,
        insights: fallbackInsights,
        content: fallbackContent,
        source: "fallback_after_error",
      })
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      content: data.choices[0].message.content,
      source: "openai",
    })
  } catch (error) {
    console.error("Error generating report:", error)
    const { toolName, score, answers, name } = await request.json().catch(() => ({
      toolName: "Business Diagnostic",
      score: 0,
      answers: [],
      name: "Valued Client",
    }))

    const fallbackInsights = generateStructuredFallback(answers, toolName);
    const fallbackContent = generateIntelligentReport(toolName, score, answers, name);
    return NextResponse.json({
      success: true,
      insights: fallbackInsights,
      content: fallbackContent,
      source: "error_fallback",
    })
  }
}

function generateIntelligentReport(toolName: string, score: number, answers: any[], name: string) {
  const noAnswers = answers?.filter((a) => a.answer === "No") || []
  const yesAnswers = answers?.filter((a) => a.answer === "Yes") || []
  const currentDate = new Date().toLocaleDateString()

  const executiveSummary = generateExecutiveSummary(toolName, score, noAnswers.length, yesAnswers.length)
  const keyInsights = generateKeyInsights(toolName, noAnswers)
  const recommendations = generateRecommendations(toolName, noAnswers)
  const timeline = generateTimeline()
  const metrics = generateMetrics(toolName)

  return `
**NBLK BUSINESS DIAGNOSTIC REPORT**
**Small Business Solutions by NBLK**

**Client:** ${name}
**Assessment:** ${toolName}
**Date:** ${currentDate}
**Score:** ${score}/100

---

**EXECUTIVE SUMMARY**

${executiveSummary}

---

**KEY INSIGHTS**

${keyInsights.map((insight, i) => `${i + 1}. **${insight.title}**\n   ${insight.description}`).join("\n\n")}

---

**STRATEGIC RECOMMENDATIONS**

${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

---

**IMPLEMENTATION TIMELINE**

**Immediate (0-30 days):**
${timeline.immediate.map((item) => `• ${item}`).join("\n")}

**Short-term (30-90 days):**
${timeline.shortTerm.map((item) => `• ${item}`).join("\n")}

**Long-term (90+ days):**
${timeline.longTerm.map((item) => `• ${item}`).join("\n")}

---

**SUCCESS METRICS**

${metrics.map((metric) => `• ${metric}`).join("\n")}

---

**NEXT STEPS**

1. Review this report with your leadership team within 48 hours
2. Prioritize the top 3 recommendations based on impact and resources
3. Schedule follow-up consultation to discuss implementation strategy

**Contact Information:**
NBLK Consulting
442 5th Avenue, #2304, New York, NY 10018
Email: awashington@nblkconsulting.com
Phone: (212) 598-3030

*Small Business Solutions by NBLK - Empowering Business Clarity Through Data-Driven Insights*
`
}

function generateExecutiveSummary(toolName: string, score: number, issues: number, strengths: number) {
  const tool = toolName.split(" ")[0]

  if (score >= 80) {
    return `Your ${tool} systems demonstrate strong performance with a score of ${score}/100. While you have ${strengths} areas of strength, there are ${issues} strategic opportunities that could elevate your business to the next level. Your foundation is solid, making this an ideal time to optimize and scale operations.`
  } else if (score >= 60) {
    return `Your ${tool} assessment reveals a score of ${score}/100, indicating good foundational practices with significant room for improvement. You have ${strengths} areas working well, but ${issues} critical gaps are limiting your business potential. Addressing these areas could dramatically improve operational efficiency.`
  } else {
    return `Your ${tool} diagnostic shows a score of ${score}/100, highlighting substantial opportunities for improvement. While you have ${strengths} positive elements to build upon, ${issues} critical areas require immediate attention. This assessment provides a clear roadmap for transforming your business operations.`
  }
}

function generateKeyInsights(toolName: string, noAnswers: any[]) {
  const insights = []

  if (toolName.includes("Data Hygiene")) {
    insights.push(
      {
        title: "Data Fragmentation Risk",
        description:
          "Multiple disconnected systems are creating data silos, leading to inefficiencies and decision-making delays.",
      },
      {
        title: "Manual Process Overhead",
        description:
          "Excessive manual data entry is consuming valuable time and introducing errors into business processes.",
      },
      {
        title: "Integration Opportunities",
        description:
          "Your business tools lack proper integration, missing opportunities for automation and efficiency gains.",
      },
    )
  } else if (toolName.includes("Marketing")) {
    insights.push(
      {
        title: "Attribution Gap",
        description:
          "You're missing critical insights about which marketing channels and campaigns drive actual business results.",
      },
      {
        title: "Audience Targeting Inefficiency",
        description: "Broad targeting is diluting your marketing impact and reducing return on advertising spend.",
      },
      {
        title: "Customer Feedback Loop Missing",
        description:
          "Limited customer feedback collection is preventing optimization of offerings and customer experience.",
      },
    )
  } else if (toolName.includes("Cash Flow")) {
    insights.push(
      {
        title: "Cash Flow Visibility Gap",
        description:
          "Lack of forward-looking cash flow forecasting is creating uncertainty in business planning and decision-making.",
      },
      {
        title: "Collections Process Weakness",
        description:
          "Inefficient payment collection processes are extending cash conversion cycles and impacting working capital.",
      },
      {
        title: "Financial Resilience Risk",
        description:
          "Insufficient emergency reserves leave your business vulnerable to unexpected disruptions or opportunities.",
      },
    )
  }

  return insights.slice(0, 3)
}

function generateRecommendations(toolName: string, noAnswers: any[]) {
  if (toolName.includes("Data Hygiene")) {
    return [
      "Implement a centralized Customer Relationship Management (CRM) system",
      "Establish automated data synchronization between key business systems",
      "Create standardized data entry procedures and training protocols",
      "Set up automated reporting dashboards for real-time business metrics",
      "Implement data backup and security protocols",
      "Schedule monthly data audits to maintain accuracy",
    ]
  } else if (toolName.includes("Marketing")) {
    return [
      "Implement marketing attribution tracking using Google Analytics 4",
      "Develop detailed buyer personas based on your best customers",
      "Set up automated customer feedback collection systems",
      "Create consistent brand messaging across all marketing channels",
      "Establish A/B testing protocols for campaigns and website elements",
      "Implement marketing automation to nurture leads",
    ]
  } else if (toolName.includes("Cash Flow")) {
    return [
      "Create rolling 13-week cash flow forecasts updated weekly",
      "Implement automated invoicing and payment reminder systems",
      "Establish business emergency fund equal to 3-6 months operating expenses",
      "Set up weekly financial dashboards with key metrics",
      "Negotiate better payment terms with suppliers and customers",
      "Consider invoice factoring or business lines of credit for flexibility",
    ]
  }

  return [
    "Implement systematic processes to address identified operational gaps",
    "Establish regular review cycles to monitor progress",
    "Consider automation tools to reduce manual work",
    "Set up clear metrics and KPIs to track improvement",
    "Schedule quarterly business health assessments",
  ]
}

function generateTimeline() {
  return {
    immediate: [
      "Review diagnostic report with leadership team",
      "Prioritize top 3 recommendations by impact and resources",
      "Assign team members as owners for each initiative",
    ],
    shortTerm: [
      "Create detailed implementation plans for priority areas",
      "Begin implementing quick wins for immediate results",
      "Set up weekly progress check-ins",
    ],
    longTerm: [
      "Establish quarterly business diagnostic reviews",
      "Scale successful improvements across other business areas",
      "Consider engaging professional consultants for complex implementations",
    ],
  }
}

function generateMetrics(toolName: string) {
  if (toolName.includes("Data Hygiene")) {
    return [
      "Data accuracy rate (target: 95%+)",
      "Time spent on manual data entry (reduce by 50%)",
      "Report generation time (reduce by 60%)",
      "System integration completion rate",
    ]
  } else if (toolName.includes("Marketing")) {
    return [
      "Marketing ROI improvement (target: 25% increase)",
      "Lead conversion rate optimization",
      "Customer acquisition cost reduction",
      "Campaign attribution accuracy (target: 90%+)",
    ]
  } else if (toolName.includes("Cash Flow")) {
    return [
      "Cash flow forecast accuracy (target: 95%+)",
      "Days sales outstanding reduction",
      "Emergency fund target achievement",
      "Payment collection efficiency improvement",
    ]
  }

  return [
    "Overall operational efficiency improvement",
    "Process automation implementation rate",
    "Team productivity metrics",
    "Customer satisfaction scores",
  ]
}

function generateStructuredFallback(answers: any[], toolName: string) {
  const noAnswers = answers.filter((a: any) => a.answer === "No");
  const yesAnswers = answers.filter((a: any) => a.answer === "Yes");

  const challenges = noAnswers.slice(0, 2).map((a: any, index: number) => {
    const question = a.question.toLowerCase();
    let actionStep = "";
    
    if (question.includes("centralized") || question.includes("one place")) {
      actionStep = "Pick one tool (like a spreadsheet or simple app) and start keeping all your info in one place. That is a good start!";
    } else if (question.includes("communicate") || question.includes("talk")) {
      actionStep = "Set up a weekly 15-minute meeting to share updates. This will help everyone stay on the same page.";
    } else if (question.includes("reports") || question.includes("mistakes")) {
      actionStep = "Start using simple checklists for important tasks. This will help reduce errors and make your work more reliable.";
    } else if (question.includes("ads") || question.includes("emails")) {
      actionStep = "Start tracking which marketing efforts bring in the most customers. This will help you spend your money wisely.";
    } else if (question.includes("target") || question.includes("customers")) {
      actionStep = "Write down who your best customers are and what they like. This will help you find more customers like them.";
    } else if (question.includes("feedback") || question.includes("reviews")) {
      actionStep = "Ask one customer each week for their honest opinion. This will help you improve your business.";
    } else if (question.includes("forecast") || question.includes("3 months")) {
      actionStep = "Start tracking your monthly income and expenses. This will help you plan for the future.";
    } else if (question.includes("overdue") || question.includes("follow up")) {
      actionStep = "Set up automatic reminders for when customers owe you money. This will help you get paid faster.";
    } else if (question.includes("buffer") || question.includes("emergencies")) {
      actionStep = "Start saving a small amount each month for unexpected expenses. Even $50 a month adds up quickly.";
    } else {
      actionStep = "Take one small step this week to improve this area. Every improvement counts!";
    }

    return {
      type: "Challenge",
      description: `Your response to "${a.question}" suggests an area that needs improvement. ${actionStep}`,
    };
  });

  const strengths = yesAnswers.length > 0
    ? [{
        type: "Strength",
        description: `Your ${toolName} responses show a positive foundation. You have ${yesAnswers.length} areas working well, which is a great start! Keep building on these strengths.`,
      }]
    : [];

  return [...strengths, ...challenges];
}

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { toolName, score, answers, name } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found - using intelligent fallback")
      const fallbackInsights = generateDynamicInsights(answers, toolName, score);
      const fallbackContent = generateIntelligentReport(toolName, score, answers, name);
      return NextResponse.json({
        success: true,
        insights: fallbackInsights,
        content: fallbackContent,
        source: "intelligent_fallback",
      })
    }

    const yesAnswers = answers.filter((a: any) => a.answer === "Yes");
    const noAnswers = answers.filter((a: any) => a.answer === "No");
    const yesCount = yesAnswers.length;
    const noCount = noAnswers.length;

    let prompt = `You are a friendly business advisor helping small business owners improve their operations. Use a simple, supportive tone at a 6th-grade reading level.

The client just completed a diagnostic tool called: "${toolName}".
Here are their answers:
${answers.map((a: any, i: number) => `${i + 1}. ${a.question} - ${a.answer}`).join("\n")}

Generate exactly 1 Insight and 2 Challenges based on their specific answers. 

**Rules:**
1. **Insight**: Summarize the good things they're doing (from YES answers) in 1-2 lines maximum. Don't repeat questions, just give a gist of what they're doing well.
2. **Challenge 1**: From their NO answers, identify one specific area for improvement with a simple action step.
3. **Challenge 2**: From their NO answers, identify another specific area for improvement with a simple action step.

**Special Cases:**
- If ALL answers are YES: Praise their strong foundation but create FOMO for the detailed report. Say they can grow even more.
- If ALL answers are NO: Don't show any good part. Motivate them to take the first step toward success.
- If mostly YES (7+ YES): Focus on the few NO answers for challenges, expand them into 2 separate challenges.
- If mostly NO (7+ NO): Focus on the few YES answers for insight, create 2 specific challenges from NO answers.

Format your response exactly like this:
1. Insight: [One line summary of what they're doing well]
2. Challenge: [Specific issue + simple action step]
3. Challenge: [Another specific issue + simple action step]

Example:
1. Insight: Your business has good customer relationships and clear processes in place.
2. Challenge: Your data is scattered across different systems. Pick one tool and start keeping everything in one place.
3. Challenge: Your team communication could be better. Set up a weekly 15-minute meeting to share updates.

Avoid emojis, icons, or vague statements. Use direct, friendly tone.`.trim();

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

function generateDynamicInsights(answers: any[], toolName: string, score: number) {
  const noAnswers = answers.filter((a: any) => a.answer === "No");
  const yesAnswers = answers.filter((a: any) => a.answer === "Yes");
  const yesCount = yesAnswers.length;
  const noCount = noAnswers.length;

  // All YES answers - create FOMO
  if (yesCount === 10) {
    return [
      {
        type: "Insight",
        description: "Your business shows excellent practices across all areas. You have a strong foundation that many businesses strive for.",
      },
      {
        type: "Challenge",
        description: "Even with your strong performance, there's always room to grow. Get your detailed report to discover advanced strategies that could take your business to the next level.",
      },
      {
        type: "Challenge",
        description: "Consider how you can scale your current success. The detailed report will show you exactly where to focus for maximum impact.",
      },
    ];
  }

  // All NO answers - motivate without showing good parts
  if (noCount === 10) {
    return [
      {
        type: "Insight",
        description: "Taking this diagnostic is your first step toward business success. You're ready to build a stronger foundation.",
      },
      {
        type: "Challenge",
        description: "Your business needs a systematic approach to operations. Start with one area and build from there.",
      },
      {
        type: "Challenge",
        description: "Get your detailed report to see exactly which steps to take first. Every successful business started exactly where you are now.",
      },
    ];
  }

  // Mostly YES (7+ YES)
  if (yesCount >= 7) {
    const insight = generateInsightFromYes(yesAnswers, toolName);
    const challenges = generateChallengesFromNo(noAnswers, 2);
    return [
      { type: "Insight", description: insight },
      ...challenges,
    ];
  }

  // Mostly NO (7+ NO)
  if (noCount >= 7) {
    const insight = yesCount > 0 ? generateInsightFromYes(yesAnswers, toolName) : "You're taking the right first step by assessing your business needs.";
    const challenges = generateChallengesFromNo(noAnswers, 2);
    return [
      { type: "Insight", description: insight },
      ...challenges,
    ];
  }

  // Balanced (4-6 YES, 4-6 NO)
  const insight = generateInsightFromYes(yesAnswers, toolName);
  const challenges = generateChallengesFromNo(noAnswers, 2);
  return [
    { type: "Insight", description: insight },
    ...challenges,
  ];
}

function generateInsightFromYes(yesAnswers: any[], toolName: string): string {
  if (yesAnswers.length === 0) return "You're taking the right first step by assessing your business needs.";
  
  const areas = yesAnswers.map(a => a.question.toLowerCase());
  
  if (toolName.includes("Data Hygiene")) {
    if (areas.some(q => q.includes("customer") || q.includes("info"))) {
      return "You have good systems for managing customer information and business data.";
    }
    if (areas.some(q => q.includes("track") || q.includes("system"))) {
      return "Your business has organized tracking systems in place.";
    }
    return "You have some good data management practices that you can build upon.";
  }
  
  if (toolName.includes("Marketing")) {
    if (areas.some(q => q.includes("customer") || q.includes("feedback"))) {
      return "You understand your customers and gather feedback effectively.";
    }
    if (areas.some(q => q.includes("ads") || q.includes("marketing"))) {
      return "You have good marketing practices and customer engagement strategies.";
    }
    return "You have some effective marketing approaches that are working well.";
  }
  
  if (toolName.includes("Cash Flow")) {
    if (areas.some(q => q.includes("profit") || q.includes("money"))) {
      return "You have a good understanding of your business finances and profitability.";
    }
    if (areas.some(q => q.includes("track") || q.includes("system"))) {
      return "You have systems in place to track your business finances.";
    }
    return "You have some good financial practices that provide a solid foundation.";
  }
  
  return "You have several areas where your business is performing well.";
}

function generateChallengesFromNo(noAnswers: any[], count: number): any[] {
  const challenges = [];
  
  for (let i = 0; i < Math.min(count, noAnswers.length); i++) {
    const answer = noAnswers[i];
    const question = answer.question.toLowerCase();
    let actionStep = "";
    
    if (question.includes("centralized") || question.includes("one place")) {
      actionStep = "Pick one tool and start keeping all your info in one place.";
    } else if (question.includes("communicate") || question.includes("talk")) {
      actionStep = "Set up regular team meetings to share updates.";
    } else if (question.includes("reports") || question.includes("mistakes")) {
      actionStep = "Start using simple checklists for important tasks.";
    } else if (question.includes("ads") || question.includes("emails")) {
      actionStep = "Start tracking which marketing efforts bring in customers.";
    } else if (question.includes("target") || question.includes("customers")) {
      actionStep = "Write down who your best customers are and what they like.";
    } else if (question.includes("feedback") || question.includes("reviews")) {
      actionStep = "Ask customers for their honest opinion regularly.";
    } else if (question.includes("profit") || question.includes("money")) {
      actionStep = "Start tracking your income and expenses more closely.";
    } else if (question.includes("cost") || question.includes("expense")) {
      actionStep = "Calculate your costs and set clear pricing.";
    } else if (question.includes("goal") || question.includes("sales")) {
      actionStep = "Set clear monthly goals for your business.";
    } else {
      actionStep = "Take one small step this week to improve this area.";
    }
    
    challenges.push({
      type: "Challenge",
      description: `${answer.question.replace("Do you", "You need to").replace("Have you", "You need to").replace("Is it", "You need to").replace("Are your", "You need to").replace("Can you", "You need to")} ${actionStep}`,
    });
  }
  
  return challenges;
}

function generateStructuredFallback(answers: any[], toolName: string) {
  return generateDynamicInsights(answers, toolName, 0);
}

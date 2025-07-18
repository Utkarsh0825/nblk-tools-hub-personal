import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, name, toolName, reportContent, score } = await request.json()

    if (!process.env.SENDGRID_API_KEY) {
      console.log("SendGrid API key not found - simulating email send")
      return NextResponse.json({
        success: true,
        message: "Email simulated (no API key configured)",
      })
    }

    const emailData = {
      personalizations: [
        {
          to: [{ email: to, name }],
          subject: `Your NBLK Business Diagnostic Report - ${toolName}`,
        },
      ],
        from: {
    email: "uky.utkarsh0825@gmail.com",  // ✅ verified sender
    name: "NBLK",
  },
  reply_to: {
    email: "uky.utkarsh0825@gmail.com",  // ✅ also set reply_to properly
    name: "NBLK",
  },
      content: [
        {
          type: "text/html",
          value: generateProfessionalEmailHTML(name, toolName, reportContent, score),
        },
      ],
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`SendGrid API error: ${response.status} - ${errorText}`)
      return NextResponse.json({
        success: true,
        message: `Email delivery attempted: ${response.status}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({
      success: true,
      message: "Email processing completed",
    })
  }
}

function generateProfessionalEmailHTML(name: string, toolName: string, reportContent: any, score: number) {
  const currentDate = new Date().toLocaleDateString()
  console.log("Email generation data:", { name, toolName, reportContent, score });
  
  // Handle different content formats
  let content = "";
  if (typeof reportContent === "string") {
    content = reportContent;
  } else if (Array.isArray(reportContent)) {
    // If it's an array of insights, generate structured content
    content = generateStructuredEmailContent(name, toolName, score, reportContent);
  } else if (reportContent && reportContent.content) {
    content = reportContent.content;
  } else {
    content = generateDefaultEmailContent(name, toolName, score);
  }


  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your NBLK Diagnostic Report</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #000 0%, #006400 100%);
                color: white;
                text-align: center; 
                padding: 40px 20px;
            }
            .logo { 
                font-size: 36px; 
                font-weight: bold; 
                margin-bottom: 10px; 
                letter-spacing: 2px;
            }
            .score-section { 
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 40px; 
                text-align: center; 
                border-bottom: 3px solid #006400;
            }
            .score { 
                font-size: 64px; 
                font-weight: bold; 
                color: #006400; 
                margin-bottom: 10px; 
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .performance-level {
                font-size: 24px;
                font-weight: 600;
                color: #495057;
                margin-bottom: 10px;
            }
            .content { 
                padding: 40px;
                white-space: pre-line;
                font-size: 16px;
            }
            .footer { 
                background: #006400;
                color: white;
                text-align: center; 
                padding: 30px; 
                font-size: 14px; 
            }
            .footer-logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 15px;
                letter-spacing: 1px;
            }
            strong {
                color: #006400;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">nblk</div>
                <h2 style="margin: 0; font-weight: 300;">Business Diagnostic Report</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Small Business Solutions by NBLK</p>
            </div>
            
            <div class="score-section">
                <div class="score">${score}<span style="font-size: 32px; color: #666;">/100</span></div>
                <div class="performance-level">${getPerformanceLevel(score)} Performance</div>
                <p style="margin: 15px 0 0 0; color: #666; font-size: 16px;">Prepared for ${name}</p>
            </div>
            
            <div class="content">
                ${content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}
            </div>
            
            <div class="footer">
                <div class="footer-logo">NBLK CONSULTING</div>
                <p style="margin: 10px 0;">442 5th Avenue, #2304, New York, NY 10018</p>
                <p style="margin: 10px 0;">Email: awashington@nblkconsulting.com | Phone: (212) 598-3030</p>
                <p style="margin: 20px 0 0 0; font-style: italic; opacity: 0.8;">Small Business Solutions by NBLK</p>
            </div>
        </div>
    </body>
    </html>
  `
}

function getPerformanceLevel(score: number) {
  if (score >= 90) return "Exceptional"
  if (score >= 80) return "Excellent"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  if (score >= 40) return "Below Average"
  return "Needs Attention"
}

function generateStructuredEmailContent(name: string, toolName: string, score: number, insights: any[]) {
  const currentDate = new Date().toLocaleDateString();
  
  // Separate insights by type
  const strengths = insights.filter((insight: any) => insight.type === "Strength");
  const challenges = insights.filter((insight: any) => insight.type === "Challenge");

  return `**NBLK BUSINESS DIAGNOSTIC REPORT**
**Small Business Solutions by NBLK**

**Client:** ${name}
**Assessment:** ${toolName}
**Date:** ${currentDate}
**Score:** ${score}/100

---

**EXECUTIVE SUMMARY**

Your ${toolName} diagnostic shows a score of ${score}/100, highlighting substantial opportunities for improvement. This assessment provides a clear roadmap for transforming your business operations.

---

**KEY INSIGHTS**

${strengths.length > 0 ? `**1. Strength**
${strengths[0].description}` : ''}

${challenges.map((challenge: any, index: number) => `**${index + 1 + (strengths.length > 0 ? 1 : 0)}. Challenge**
${challenge.description}`).join('\n\n')}

---

**STRATEGIC RECOMMENDATIONS**

1. Review this report with your leadership team within 48 hours
2. Prioritize the top 3 recommendations based on impact and resources
3. Schedule follow-up consultation to discuss implementation strategy

---

**IMPLEMENTATION TIMELINE**

**Immediate (0-30 days):**
• Review diagnostic report with leadership team
• Prioritize top 3 recommendations by impact and resources
• Assign team members as owners for each initiative

**Short-term (30-90 days):**
• Create detailed implementation plans for priority areas
• Begin implementing quick wins for immediate results
• Set up weekly progress check-ins

**Long-term (90+ days):**
• Establish quarterly business diagnostic reviews
• Scale successful improvements across other business areas
• Consider engaging professional consultants for complex implementations

---

**SUCCESS METRICS**

• Business process efficiency improvement (target: 25% increase)
• Operational cost reduction
• Customer satisfaction enhancement
• Team productivity optimization

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

*Small Business Solutions by NBLK - Empowering Business Clarity Through Data-Driven Insights*`;
}

function generateDefaultEmailContent(name: string, toolName: string, score: number) {
  const currentDate = new Date().toLocaleDateString();
  
  return `**NBLK BUSINESS DIAGNOSTIC REPORT**
**Small Business Solutions by NBLK**

**Client:** ${name}
**Assessment:** ${toolName}
**Date:** ${currentDate}
**Score:** ${score}/100

---

**EXECUTIVE SUMMARY**

Your ${toolName} diagnostic shows a score of ${score}/100, highlighting substantial opportunities for improvement. This assessment provides a clear roadmap for transforming your business operations.

---

**KEY INSIGHTS**

**1. Strength**
Your business shows positive foundational practices that you can build upon.

**2. Challenge**
There are specific areas where your business can improve to achieve better results.

**3. Challenge**
Focus on implementing systematic improvements to enhance overall performance.

---

**STRATEGIC RECOMMENDATIONS**

1. Review this report with your leadership team within 48 hours
2. Prioritize the top 3 recommendations based on impact and resources
3. Schedule follow-up consultation to discuss implementation strategy

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

*Small Business Solutions by NBLK - Empowering Business Clarity Through Data-Driven Insights*`;
}

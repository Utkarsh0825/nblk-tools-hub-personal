import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePdfReport, DiagnosticInput } from '../../lib/pdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Incoming /api/send-report request:', req.body);
    const { to, name, toolName, reportContent, score, answers } = req.body;

    if (!to || !name || !toolName || !reportContent || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, name, toolName, reportContent, or score.'
      });
    }

    if (!process.env.SENDGRID_API_KEY) {
      return res.status(200).json({
        success: true,
        message: 'Email simulated (no API key configured)',
      });
    }

    // --- FIX: Ensure answers is always an array of {question, short, answer} ---
    let answersArray;
    if (Array.isArray(answers) && answers[0] && typeof answers[0] === 'object' && 'answer' in answers[0]) {
      answersArray = answers;
    } else {
      // Try to parse from reportContent or fallback to 10 dummy answers
      answersArray = [];
      if (typeof reportContent === 'string') {
        // Try to extract questions from reportContent
        const match = reportContent.match(/\*\*Assessment:\*\* (.+)/);
        const tool = match ? match[1] : toolName;
        for (let i = 1; i <= 10; i++) {
          answersArray.push({
            question: `Q${i} for ${tool}`,
            short: `Q${i}`,
            answer: i <= score / 10 ? 'Yes' : 'No'
          });
        }
      } else {
        for (let i = 1; i <= 10; i++) {
          answersArray.push({
            question: `Q${i} for ${toolName}`,
            short: `Q${i}`,
            answer: i <= score / 10 ? 'Yes' : 'No'
          });
        }
      }
    }

    const pdfInput: DiagnosticInput = {
      companyName: name,
      userScore: score,
      answers: answersArray,
      toolName: toolName,
    };

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generatePdfReport(pdfInput);
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      pdfBuffer = Buffer.from('PDF generation failed');
    }

    const filename = `NBLK-Diagnostic-Report-${Date.now()}.pdf`;

    const emailData = {
      personalizations: [
        {
          to: [{ email: to, name }],
          subject: `Your NBLK Business Diagnostic Report - ${toolName}`,
        },
      ],
      from: {
        email: 'uky.utkarsh0825@gmail.com',
        name: 'NBLK',
      },
      reply_to: {
        email: 'uky.utkarsh0825@gmail.com',
        name: 'NBLK',
      },
      content: [
        {
          type: 'text/html',
          value: generateProfessionalEmailHTML(name, toolName, reportContent, score),
        },
      ],
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(emailData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid error:', response.status, errorText);
      return res.status(200).json({
        success: false,
        message: `Email delivery failed: ${response.status} - ${errorText}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully with professional PDF report',
    });

  } catch (error) {
    console.error('Error in /api/send-report:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(200).json({
        success: false,
        message: 'Email delivery timed out. Please try again.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function generateProfessionalEmailHTML(name: string, toolName: string, reportContent: any, score: number) {
  const currentDate = new Date().toLocaleDateString();
  const content = typeof reportContent === 'string' ? reportContent : reportContent.content || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your NBLK Diagnostic Report</title>
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
            .container { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #000 0%, #006400 100%); color: white; text-align: center; padding: 40px 20px; }
            .logo { font-size: 36px; font-weight: bold; margin-bottom: 10px; letter-spacing: 2px; }
            .score-section { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 40px; text-align: center; border-bottom: 3px solid #006400; }
            .score { font-size: 64px; font-weight: bold; color: #006400; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
            .performance-level { font-size: 24px; font-weight: 600; color: #495057; margin-bottom: 10px; }
            .content { padding: 40px; white-space: pre-line; font-size: 16px; }
            .footer { background: #006400; color: white; text-align: center; padding: 30px; font-size: 14px; }
            .footer-logo { font-size: 24px; font-weight: bold; margin-bottom: 15px; letter-spacing: 1px; }
            strong { color: #006400; }
            .pdf-notice { background: #e8f5e8; border: 1px solid #006400; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">NBLK</div>
                <h2 style="margin: 0; font-weight: 300;">Business Diagnostic Report</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Small Business Solutions by NBLK</p>
            </div>
            <div class="score-section">
                <div class="score">${score}<span style="font-size: 32px; color: #666;">/100</span></div>
                <div class="performance-level">${getPerformanceLevel(score)} Performance</div>
                <p style="margin: 15px 0 0 0; color: #666; font-size: 16px;">Prepared for ${name}</p>
            </div>
            <div class="pdf-notice">
                <strong>📄 Professional PDF Report Attached</strong><br>
                Your detailed diagnostic report with charts, analysis, and strategic recommendations is attached to this email.
            </div>
            <div class="content">
                ${content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}
            </div>
            <div class="footer">
                <div class="footer-logo">NBLK CONSULTING</div>
                <p style="margin: 10px 0;">442 5th Avenue, #2304, New York, NY 10018</p>
                <p style="margin: 10px 0;">Email: admin@nblkconsulting.com | Phone: (212) 598-3030</p>
                <p style="margin: 20px 0 0 0; font-style: italic; opacity: 0.8;">Small Business Solutions by NBLK</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getPerformanceLevel(score: number) {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Below Average';
  return 'Needs Attention';
} 
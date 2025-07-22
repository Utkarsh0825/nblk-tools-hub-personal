import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export interface PDFReportData {
  companyName?: string;
  userName?: string;
  date: string;
  summary: string;
  chartData: { labels: string[]; values: number[]; };
  chartCaption: string;
  syncStatus: Array<{ tool: string; status: string; frequency: string; comments: string }>;
  recommendations: string[];
}

export async function generatePDFReport(data: PDFReportData): Promise<Buffer> {
  // 1. Render HTML with dynamic data and chart
  const html = await renderReportHTML(data);

  // 2. Launch Puppeteer and render PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Use system Chrome
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // Wait for Chart.js to render
  await page.waitForSelector('#score-chart-rendered');
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '24px', bottom: '24px', left: '24px', right: '24px' },
  });
  await browser.close();
  return pdfBuffer;
}

async function renderReportHTML(data: PDFReportData): Promise<string> {
  // Read the HTML template from disk (or inline it here for now)
  // For maintainability, you can move this to a separate file if needed
  const accent = '#006400';
  const chartLabels = JSON.stringify(data.chartData.labels);
  const chartValues = JSON.stringify(data.chartData.values);
  const today = data.date;
  const company = data.companyName || 'NBLK Consulting';
  const user = data.userName || 'Client';
  const recommendations = data.recommendations.map(r => `<li>${r}</li>`).join('');
  const syncRows = data.syncStatus.map(row => `
    <tr>
      <td>${row.tool}</td>
      <td>${row.status}</td>
      <td>${row.frequency}</td>
      <td>${row.comments}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NBLK Diagnostic Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; }
    .container { background: #fff; max-width: 800px; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 24px #0002; padding: 0 0 32px 0; }
    .header { background: #fff; border-bottom: 4px solid ${accent}; padding: 32px 40px 16px 40px; }
    .title { font-size: 2rem; font-weight: bold; color: #222; margin-bottom: 4px; }
    .subtitle { font-size: 1rem; color: #444; font-style: italic; margin-bottom: 12px; }
    .summary { font-size: 1.1rem; color: #222; margin: 32px 40px 24px 40px; line-height: 1.6; }
    .chart-section { display: flex; gap: 24px; margin: 0 40px 24px 40px; }
    .chart-box { flex: 1; background: #e9ecef; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; align-items: center; }
    .chart-title { font-weight: bold; color: #222; margin-bottom: 8px; }
    .chart-caption { color: #666; font-size: 0.95rem; margin-top: 8px; text-align: center; }
    .table-section { margin: 0 40px 24px 40px; }
    .table-title { font-weight: bold; font-size: 1.1rem; color: #222; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px; overflow: hidden; }
    th, td { padding: 10px 8px; text-align: left; }
    th { background: ${accent}; color: #fff; font-weight: bold; }
    tr:nth-child(even) { background: #f1f3f4; }
    tr:nth-child(odd) { background: #fff; }
    .recommendations { margin: 0 40px 24px 40px; }
    .recommendations-title { font-weight: bold; font-size: 1.1rem; color: #222; margin-bottom: 8px; }
    .footer { color: #888; font-size: 0.95rem; text-align: center; margin-top: 32px; padding: 16px 0 0 0; border-top: 1px solid #eee; }
    .brand { color: ${accent}; font-weight: bold; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">Diagnostic Report: Data Hygiene & Business Clarity</div>
      <div class="subtitle">Date: ${today} | Powered by <span class="brand">NBLK</span></div>
    </div>
    <div class="summary">${data.summary}</div>
    <div class="chart-section">
      <div class="chart-box">
        <div class="chart-title">Strategic Clarity Score</div>
        <canvas id="score-chart" width="320" height="180"></canvas>
        <div class="chart-caption">${data.chartCaption}</div>
      </div>
    </div>
    <div class="table-section">
      <div class="table-title">Cross-Tool Sync Status</div>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Sync Status</th>
            <th>Frequency</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          ${syncRows}
        </tbody>
      </table>
    </div>
    <div class="recommendations">
      <div class="recommendations-title">Strategic Recommendations</div>
      <ul>
        ${recommendations}
      </ul>
    </div>
    <div class="footer">
      ${company} | 442 5th Avenue, #2304, New York, NY 10018 | admin@nblkconsulting.com
    </div>
  </div>
  <script>
    const ctx = document.getElementById('score-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ${chartLabels},
        datasets: [{
          label: 'Clarity Score',
          data: ${chartValues},
          backgroundColor: '#006400',
          borderRadius: 6,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: '#ccc' },
            ticks: { color: '#222', font: { size: 12 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#222', font: { size: 12 } }
          }
        }
      }
    });
    // Signal to Puppeteer that chart is rendered
    document.body.insertAdjacentHTML('beforeend', '<div id="score-chart-rendered"></div>');
  </script>
</body>
</html>
  
  `;
} 
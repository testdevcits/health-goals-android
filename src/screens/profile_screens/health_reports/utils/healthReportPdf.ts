import { NativeModules, Platform, Share } from 'react-native';
import { showAppToast } from '../../../../utils/appToast';
import type {
  DailyActivityHistoryItem,
  DailyValue,
  HealthReportTab,
} from '../useHealthReports';

type GeneratePdfFn = (options: {
  html: string;
  fileName?: string;
  directory?: string;
}) => Promise<{ filePath: string }>;

let cachedGeneratePDF: GeneratePdfFn | null | undefined;

const resolveGeneratePDF = (): GeneratePdfFn | null => {
  if (cachedGeneratePDF !== undefined) {
    return cachedGeneratePDF ?? null;
  }
  try {
    const htmlToPdfModule = require('react-native-html-to-pdf');
    cachedGeneratePDF =
      htmlToPdfModule.generatePDF ||
      htmlToPdfModule.default?.generatePDF ||
      null;
  } catch {
    cachedGeneratePDF = null;
  }
  return cachedGeneratePDF ?? null;
};

export interface ExportPdfOptions {
  from: Date;
  to: Date;
  activeTab: HealthReportTab;
  history: DailyValue[];
  dailyCoins: DailyActivityHistoryItem[];
  totalCoins: number;
}

export function buildHealthReportHtml(options: ExportPdfOptions): string {
  const { from, to, activeTab, history, totalCoins } = options;
  const total = history.reduce((sum, item) => sum + item?.value, 0);
  const avg = history.length ? Math.round(total / history.length) : 0;
  const max = history.length ? Math.max(...history.map(item => item?.value)) : 0;
  const activeDays = history.filter(item => item?.value > 0).length;
  const unit = history[0]?.unit || (activeTab === 'Steps' ? 'steps' : 'mins');

  const formattedTotal =
    activeTab === 'Sleep'
      ? `${Math.floor(total / 60)}h ${Math.round(total % 60)}m`
      : `${total.toLocaleString()} ${unit}`;

  const formattedAvg =
    activeTab === 'Sleep'
      ? `${Math.floor(avg / 60)}h ${Math.round(avg % 60)}m`
      : `${avg.toLocaleString()} ${unit}`;

  const formattedMax =
    activeTab === 'Sleep'
      ? `${Math.floor(max / 60)}h ${Math.round(max % 60)}m`
      : `${max.toLocaleString()} ${unit}`;

  const rows = history
    .map(item => {
      let dayName = '';
      try {
        const d = new Date(`${item?.date}T12:00:00Z`);
        dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      } catch {
        dayName = '';
      }
      const valStr =
        activeTab === 'Sleep'
          ? `${Math.floor(item?.value / 60)}h ${Math.round(item?.value % 60)}m`
          : `${item?.value.toLocaleString()} ${unit}`;

      const status =
        activeTab === 'Steps'
          ? item?.value >= 10000
            ? '<span class="badge success">Goal Met</span>'
            : item?.value > 0
              ? '<span class="badge active">Active</span>'
              : '<span class="badge rest">Rest</span>'
          : item?.value > 0
            ? '<span class="badge success">Recorded</span>'
            : '<span class="badge rest">No Data</span>';

      return `
        <tr>
          <td><strong>${item?.date}</strong> <span style="color:#6B7280; font-size:12px;">(${dayName})</span></td>
          <td style="text-align: right; font-weight: 600;">${valStr}</td>
          <td style="text-align: center;">${status}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Vitality Health Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1F2937;
          margin: 0;
          padding: 24px;
          background-color: #FFFFFF;
        }
        .header {
          border-bottom: 2px solid #00D09E;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .brand {
          font-size: 28px;
          font-weight: 800;
          color: #00D09E;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }
        .subtitle {
          font-size: 14px;
          color: #4B5563;
          margin: 0;
        }
        .report-meta {
          margin-top: 12px;
          display: flex;
          justifyContent: space-between;
          font-size: 13px;
          color: #6B7280;
        }
        .cards {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .card {
          flex: 1;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 14px;
          text-align: center;
        }
        .card-val {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }
        .card-lbl {
          font-size: 12px;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th {
          background-color: #F3F4F6;
          color: #374151;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 10px 14px;
          text-align: left;
          border-bottom: 1px solid #E5E7EB;
        }
        td {
          padding: 10px 14px;
          border-bottom: 1px solid #F3F4F6;
          font-size: 13px;
        }
        tr:nth-child(even) {
          background-color: #FAFAFA;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge.success {
          background: #DEF7EC;
          color: #03543F;
        }
        .badge.active {
          background: #E1EFFE;
          color: #1E429F;
        }
        .badge.rest {
          background: #F3F4F6;
          color: #6B7280;
        }
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #E5E7EB;
          font-size: 11px;
          color: #9CA3AF;
          text-align: center;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="brand">VITALITY</h1>
        <p class="subtitle">Personal Health & Activity Performance Summary</p>
        <div class="report-meta">
          <span><strong>Metric:</strong> ${activeTab}</span>
          <span><strong>Period:</strong> ${from.toLocaleDateString()} &ndash; ${to.toLocaleDateString()}</span>
          <span><strong>Generated:</strong> ${new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div class="cards">
        <div class="card">
          <div class="card-val">${formattedTotal}</div>
          <div class="card-lbl">Total ${activeTab}</div>
        </div>
        <div class="card">
          <div class="card-val">${formattedAvg}</div>
          <div class="card-lbl">Daily Average</div>
        </div>
        <div class="card">
          <div class="card-val">${formattedMax}</div>
          <div class="card-lbl">Best Day</div>
        </div>
        <div class="card">
          <div class="card-val">${activeDays} / ${history.length}</div>
          <div class="card-lbl">Days Active</div>
        </div>
        <div class="card">
          <div class="card-val">${totalCoins}</div>
          <div class="card-lbl">Coins Earned</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th style="text-align: right;">${activeTab} Recorded</th>
            <th style="text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="footer">
        Generated automatically by Vitality Health App.<br/>
        This document is intended for personal health tracking and informational purposes only. It does not replace medical advice, diagnosis, or clinical evaluation.
      </div>
    </body>
    </html>
  `;
}

export async function exportHealthReportPdf(
  options: ExportPdfOptions,
): Promise<string | null> {
  const { from, to, activeTab, history, totalCoins } = options;
  const total = history.reduce((sum, item) => sum + item?.value, 0);
  const avg = history.length ? Math.round(total / history.length) : 0;
  const max = history.length ? Math.max(...history.map(item => item?.value)) : 0;
  const activeDays = history.filter(item => item?.value > 0).length;
  const unit = history[0]?.unit || (activeTab === 'Steps' ? 'steps' : 'mins');

  const formattedTotal =
    activeTab === 'Sleep'
      ? `${Math.floor(total / 60)}h ${Math.round(total % 60)}m`
      : `${total.toLocaleString()} ${unit}`;

  const formattedAvg =
    activeTab === 'Sleep'
      ? `${Math.floor(avg / 60)}h ${Math.round(avg % 60)}m`
      : `${avg.toLocaleString()} ${unit}`;

  const formattedMax =
    activeTab === 'Sleep'
      ? `${Math.floor(max / 60)}h ${Math.round(max % 60)}m`
      : `${max.toLocaleString()} ${unit}`;

  showAppToast('info', 'Generating PDF', 'Preparing your health report…');

  const dateFromKey = from.toISOString().slice(0, 10);
  const dateToKey = to.toISOString().slice(0, 10);
  const fileName = `Vitality_${activeTab}_Report_${dateFromKey}_${dateToKey}`;
  const reportTitle = `Vitality ${activeTab} Health Report`;
  const periodText = `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;

  const rows = history.map(item => {
    let dayName = '';
    try {
      const d = new Date(`${item?.date}T12:00:00Z`);
      dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      dayName = '';
    }
    const valStr =
      activeTab === 'Sleep'
        ? `${Math.floor(item?.value / 60)}h ${Math.round(item?.value % 60)}m`
        : `${item?.value.toLocaleString()} ${unit}`;

    const isGoal = activeTab === 'Steps' ? item?.value >= 10000 : item?.value > 0;

    return {
      date: item?.date,
      day: dayName,
      value: valStr,
      status: isGoal
        ? activeTab === 'Steps'
          ? 'Goal Met'
          : 'Recorded'
        : 'Rest',
    };
  });

  const healthAppConfig = NativeModules.HealthAppConfig;

  // 1. Preferred Native PDF generator on Android (saves to Downloads and launches ACTION_VIEW with FileProvider)
  if (
    Platform.OS === 'android' &&
    healthAppConfig &&
    typeof healthAppConfig.generateAndSavePdf === 'function'
  ) {
    try {
      const result = await healthAppConfig.generateAndSavePdf({
        title: reportTitle,
        fileName,
        metric: activeTab,
        period: periodText,
        total: formattedTotal,
        avg: formattedAvg,
        max: formattedMax,
        activeDays: `${activeDays} / ${history.length}`,
        coins: totalCoins.toString(),
        rows,
      });

      showAppToast(
        'success',
        'Report Saved & Opened',
        `Downloaded to ${result?.downloadPath || 'Downloads/Vitality'}`,
      );
      return result?.filePath || null;
    } catch {
      // Fall through to next available PDF generator
    }
  }

  const generator = resolveGeneratePDF();

  if (generator) {
    try {
      const html = buildHealthReportHtml(options);
      const pdf = await generator({
        html,
        fileName,
      });

      if (pdf?.filePath) {
        showAppToast(
          'success',
          'PDF Generated Successfully',
          'Opening health report…',
        );

        // Open with FileProvider via native module to ensure Android permission grant
        if (healthAppConfig && typeof healthAppConfig.viewPdf === 'function') {
          healthAppConfig.viewPdf(pdf.filePath, reportTitle);
          return pdf.filePath;
        }

        if (
          healthAppConfig &&
          typeof healthAppConfig.sharePdfFile === 'function'
        ) {
          healthAppConfig.sharePdfFile(pdf.filePath, reportTitle);
          return pdf.filePath;
        }

        try {
          await Share.share({
            title: reportTitle,
            message: `Vitality ${activeTab} Health Report (${from.toLocaleDateString()} – ${to.toLocaleDateString()}):\nTotal: ${total.toLocaleString()} ${unit} | Daily Avg: ${avg.toLocaleString()} ${unit} | Coins: ${totalCoins}`,
            url:
              Platform.OS === 'ios' ? pdf.filePath : `file://${pdf.filePath}`,
          });
        } catch {
          // Dismissed
        }

        return pdf.filePath;
      }
    } catch {
      // Fall through to native canvas PDF below
    }
  }

  // Fallback: Built-in native Android PdfDocument with FileProvider (works on all Android devices)
  if (healthAppConfig && typeof healthAppConfig.sharePdf === 'function') {
    const summaryText = [
      `Metric: ${activeTab}`,
      `Period: ${from.toLocaleDateString()} – ${to.toLocaleDateString()}`,
      `Total Recorded: ${total.toLocaleString()} ${unit}`,
      `Daily Average: ${avg.toLocaleString()} ${unit}`,
      `Active Days: ${history.filter(h => h.value > 0).length} of ${history.length
      }`,
      `Activity Coins: ${totalCoins}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'DAILY BREAKDOWN:',
      ...history.map(
        item => `${item?.date}: ${item?.value.toLocaleString()} ${unit}`,
      ),
    ].join('\n');

    healthAppConfig.sharePdf(reportTitle, summaryText);
    showAppToast(
      'success',
      'PDF Created',
      'Opening PDF report via FileProvider.',
    );
    return null;
  }

  // Fallback to text share
  try {
    await Share.share({
      title: reportTitle,
      message: [
        `Vitality Health Report: ${activeTab}`,
        `Period: ${from.toLocaleDateString()} – ${to.toLocaleDateString()}`,
        `Total: ${total.toLocaleString()} ${unit}`,
        `Daily Avg: ${avg.toLocaleString()} ${unit}`,
        `Coins Earned: ${totalCoins}`,
        `Days Recorded: ${history.filter(h => h.value > 0).length} of ${history.length
        }`,
      ].join('\n'),
    });
  } catch {
    // Ignored
  }

  return null;
}

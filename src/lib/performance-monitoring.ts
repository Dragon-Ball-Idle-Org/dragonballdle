import { Resend } from 'resend';

export interface PerformanceAlert {
  type: 'critical' | 'warning' | 'info';
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
  timestamp: Date;
  url: string;
  userAgent: string;
}

export interface DailyReport {
  date: string;
  metrics: {
    lcp: { avg: number; min: number; max: number; samples: number };
    fid: { avg: number; min: number; max: number; samples: number };
    cls: { avg: number; min: number; max: number; samples: number };
    fcp: { avg: number; min: number; max: number; samples: number };
    ttfb: { avg: number; min: number; max: number; samples: number };
  };
  alerts: PerformanceAlert[];
  gradeDistribution: {
    good: number;
    'needs-improvement': number;
    poor: number;
  };
  totalSessions: number;
}

export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private alerts: PerformanceAlert[] = [];
  private dailyMetrics: Map<string, PerformanceMetrics[]> = new Map();
  private thresholds = {
    lcp: { warning: 2500, critical: 4000 },
    fid: { warning: 100, critical: 300 },
    cls: { warning: 0.1, critical: 0.25 },
    fcp: { warning: 1800, critical: 3000 },
    ttfb: { warning: 600, critical: 1000 }
  };

  static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  recordMetrics(metrics: Partial<PerformanceMetrics>, url: string, userAgent: string) {
    const today = new Date().toISOString().split('T')[0];

    if (!this.dailyMetrics.has(today)) {
      this.dailyMetrics.set(today, []);
    }

    const fullMetrics = {
      lcp: metrics.lcp || 0,
      fid: metrics.fid || 0,
      cls: metrics.cls || 0,
      fcp: metrics.fcp || 0,
      ttfb: metrics.ttfb || 0
    };

    this.dailyMetrics.get(today)!.push(fullMetrics);

    // Check for alerts
    this.checkThresholds(fullMetrics, url, userAgent);
  }

  private checkThresholds(metrics: PerformanceMetrics, url: string, userAgent: string) {
    Object.entries(metrics).forEach(([metric, value]) => {
      const metricKey = metric as keyof PerformanceMetrics;
      const threshold = this.thresholds[metricKey];

      if (value > threshold.critical) {
        this.createAlert('critical', metricKey, value, threshold.critical, url, userAgent);
      } else if (value > threshold.warning) {
        this.createAlert('warning', metricKey, value, threshold.warning, url, userAgent);
      }
    });
  }

  private createAlert(
    type: 'critical' | 'warning' | 'info',
    metric: keyof PerformanceMetrics,
    value: number,
    threshold: number,
    url: string,
    userAgent: string
  ) {
    const alert: PerformanceAlert = {
      type,
      metric,
      value,
      threshold,
      timestamp: new Date(),
      url,
      userAgent: this.sanitizeUserAgent(userAgent)
    };

    this.alerts.push(alert);

    // Send immediate alert for critical issues
    if (type === 'critical') {
      this.sendDiscordAlert(alert);
    }
  }

  private sanitizeUserAgent(userAgent: string): string {
    return userAgent.length > 100 ? userAgent.substring(0, 100) + '...' : userAgent;
  }

  async sendDiscordAlert(alert: PerformanceAlert) {
    const webhookUrl = process.env.DISCORD_PERFORMANCE_WEBHOOK_URL;
    if (!webhookUrl) return;

    const emoji = alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️';
    const color = alert.type === 'critical' ? 0xFF0000 : alert.type === 'warning' ? 0xFFFF00 : 0x00FF00;

    const embed = {
      title: `${emoji} Performance Alert - ${alert.metric.toUpperCase()}`,
      description: `Performance threshold exceeded for ${alert.metric.toUpperCase()}`,
      color,
      fields: [
        { name: 'Metric', value: alert.metric.toUpperCase(), inline: true },
        { name: 'Value', value: `${alert.value.toFixed(2)}ms`, inline: true },
        { name: 'Threshold', value: `${alert.threshold}ms`, inline: true },
        { name: 'URL', value: alert.url, inline: false },
        { name: 'Timestamp', value: alert.timestamp.toISOString(), inline: true }
      ],
      timestamp: alert.timestamp.toISOString()
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });
    } catch (error) {
      console.error('Failed to send Discord alert:', error);
    }
  }

  generateDailyReport(): DailyReport {
    const today = new Date().toISOString().split('T')[0];
    const metrics = this.dailyMetrics.get(today) || [];

    if (metrics.length === 0) {
      return this.createEmptyReport(today);
    }

    const report: DailyReport = {
      date: today,
      metrics: this.calculateMetricsStats(metrics),
      alerts: this.alerts.filter(alert =>
        alert.timestamp.toISOString().split('T')[0] === today
      ),
      gradeDistribution: this.calculateGradeDistribution(metrics),
      totalSessions: metrics.length
    };

    return report;
  }

  private calculateMetricsStats(metrics: PerformanceMetrics[]) {
    const calculateStats = (values: number[]) => ({
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      samples: values.length
    });

    return {
      lcp: calculateStats(metrics.map(m => m.lcp)),
      fid: calculateStats(metrics.map(m => m.fid)),
      cls: calculateStats(metrics.map(m => m.cls)),
      fcp: calculateStats(metrics.map(m => m.fcp)),
      ttfb: calculateStats(metrics.map(m => m.ttfb))
    };
  }

  private calculateGradeDistribution(metrics: PerformanceMetrics[]) {
    const distribution = { good: 0, 'needs-improvement': 0, poor: 0 };

    metrics.forEach(metric => {
      const grade = this.calculateGrade(metric);
      distribution[grade]++;
    });

    return distribution;
  }

  private calculateGrade(metrics: PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' {
    let score = 0;
    let total = 0;

    Object.entries(metrics).forEach(([metric, value]) => {
      const metricKey = metric as keyof PerformanceMetrics;
      const threshold = this.thresholds[metricKey];
      total++;

      if (value <= threshold.warning) score++;
      else if (value <= threshold.critical) score += 0.5;
    });

    const percentage = score / total;
    if (percentage >= 0.8) return 'good';
    if (percentage >= 0.5) return 'needs-improvement';
    return 'poor';
  }

  private createEmptyReport(date: string): DailyReport {
    return {
      date,
      metrics: {
        lcp: { avg: 0, min: 0, max: 0, samples: 0 },
        fid: { avg: 0, min: 0, max: 0, samples: 0 },
        cls: { avg: 0, min: 0, max: 0, samples: 0 },
        fcp: { avg: 0, min: 0, max: 0, samples: 0 },
        ttfb: { avg: 0, min: 0, max: 0, samples: 0 }
      },
      alerts: [],
      gradeDistribution: { good: 0, 'needs-improvement': 0, poor: 0 },
      totalSessions: 0
    };
  }

  async sendDailyEmailReport(report: DailyReport) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.PERFORMANCE_REPORT_EMAIL;

    if (!resendApiKey || !recipient) {
      console.warn('Missing RESEND_API_KEY or PERFORMANCE_REPORT_EMAIL');
      return;
    }

    const resend = new Resend(resendApiKey);
    const subject = `📊 DragonBallDle Performance Report - ${report.date}`;
    const html = this.generateEmailHTML(report);

    try {
      await resend.emails.send({
        from: 'DragonBallDle Performance <noreply@dragonballdle.com>',
        to: [recipient],
        subject,
        html
      });
    } catch (error) {
      console.error('Failed to send email report:', error);
    }
  }

  private generateEmailHTML(report: DailyReport): string {
    const totalGrade = report.totalSessions > 0
      ? (report.gradeDistribution.good / report.totalSessions * 100).toFixed(1)
      : '0';

    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1>📊 DragonBallDle Performance Report</h1>
          <h2>${report.date}</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📈 Overall Performance</h3>
            <p><strong>Total Sessions:</strong> ${report.totalSessions}</p>
            <p><strong>Good Performance:</strong> ${totalGrade}%</p>
            <p><strong>Critical Alerts:</strong> ${report.alerts.filter(a => a.type === 'critical').length}</p>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>⚠️ Recent Alerts</h3>
            ${report.alerts.slice(0, 5).map(alert => `
              <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid ${alert.type === 'critical' ? '#dc3545' : '#ffc107'}">
                <strong>${alert.metric.toUpperCase()}</strong>: ${alert.value.toFixed(2)}ms (threshold: ${alert.threshold}ms)
                <br><small>${alert.url} - ${alert.timestamp.toLocaleTimeString()}</small>
              </div>
            `).join('')}
            ${report.alerts.length > 5 ? `<p><em>... and ${report.alerts.length - 5} more alerts</em></p>` : ''}
          </div>

          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 Core Web Vitals</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Metric</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Average</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Min</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Max</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Samples</th>
              </tr>
              ${Object.entries(report.metrics).map(([metric, stats]) => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${metric.toUpperCase()}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${stats.avg.toFixed(2)}ms</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${stats.min.toFixed(2)}ms</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${stats.max.toFixed(2)}ms</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${stats.samples}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>Generated automatically by DragonBallDle Performance Monitoring</p>
          </div>
        </body>
      </html>
    `;
  }

  // Schedule daily reports
  scheduleDailyReports() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM

    const msUntilTomorrow = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.sendDailyReport();
      // Schedule next day
      setInterval(() => this.sendDailyReport(), 24 * 60 * 60 * 1000);
    }, msUntilTomorrow);
  }

  private async sendDailyReport() {
    const report = this.generateDailyReport();
    await this.sendDailyEmailReport(report);

    // Also send summary to Discord
    await this.sendDiscordDailySummary(report);
  }

  public async sendDiscordDailySummary(report: DailyReport) {
    const webhookUrl = process.env.DISCORD_PERFORMANCE_WEBHOOK_URL;
    if (!webhookUrl || report.totalSessions === 0) return;

    const totalGrade = report.totalSessions > 0
      ? (report.gradeDistribution.good / report.totalSessions * 100).toFixed(1)
      : '0';

    const embed = {
      title: '📊 Daily Performance Summary',
      description: `Performance report for ${report.date}`,
      color: 0x00FF00,
      fields: [
        { name: 'Total Sessions', value: report.totalSessions.toString(), inline: true },
        { name: 'Good Performance', value: `${totalGrade}%`, inline: true },
        { name: 'Critical Alerts', value: report.alerts.filter(a => a.type === 'critical').length.toString(), inline: true },
        { name: 'Avg LCP', value: `${report.metrics.lcp.avg.toFixed(2)}ms`, inline: true },
        { name: 'Avg FID', value: `${report.metrics.fid.avg.toFixed(2)}ms`, inline: true },
        { name: 'Avg CLS', value: `${report.metrics.cls.avg.toFixed(3)}`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });
    } catch (error) {
      console.error('Failed to send Discord daily summary:', error);
    }
  }
}

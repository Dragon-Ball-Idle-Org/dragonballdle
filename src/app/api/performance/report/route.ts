import { NextRequest, NextResponse } from 'next/server';
import { PerformanceMonitoringService } from '@/lib/performance-monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { force = false } = body;

    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.PERFORMANCE_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const monitoringService = PerformanceMonitoringService.getInstance();
    const report = monitoringService.generateDailyReport();

    if (!force && report.totalSessions === 0) {
      return NextResponse.json({ 
        message: 'No data available for today',
        report 
      });
    }

    // Send email report
    await monitoringService.sendDailyEmailReport(report);
    
    // Send Discord summary
    await monitoringService.sendDiscordDailySummary(report);

    return NextResponse.json({ 
      message: 'Report sent successfully',
      report: {
        date: report.date,
        totalSessions: report.totalSessions,
        alerts: report.alerts.length,
        gradeDistribution: report.gradeDistribution
      }
    });

  } catch (error) {
    console.error('Error generating performance report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.PERFORMANCE_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const monitoringService = PerformanceMonitoringService.getInstance();
    const report = monitoringService.generateDailyReport();

    return NextResponse.json({ report });

  } catch (error) {
    console.error('Error fetching performance report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

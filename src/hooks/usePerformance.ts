"use client";

import { useEffect, useState } from "react";
import { PerformanceMonitor, PerformanceMetrics, optimizeImages } from "@/lib/performance";
import { PerformanceMonitoringService } from "@/lib/performance-monitoring";

export function usePerformance() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [grade, setGrade] = useState<'good' | 'needs-improvement' | 'poor'>('good');

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    const monitoringService = PerformanceMonitoringService.getInstance();

    // Update metrics periodically
    const updateMetrics = () => {
      const currentMetrics = monitor.getMetrics();
      setMetrics(currentMetrics);
      setGrade(monitor.getPerformanceGrade());

      // Record metrics for monitoring
      if (Object.keys(currentMetrics).length > 0) {
        monitoringService.recordMetrics(
          currentMetrics,
          window.location.href,
          navigator.userAgent
        );
      }
    };

    // Initial update
    setTimeout(updateMetrics, 1000);

    // Update every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    // Start daily report scheduling (only once)
    monitoringService.scheduleDailyReports();

    return () => {
      clearInterval(interval);
      monitor.disconnect();
    };
  }, []);

  return { metrics, grade };
}

export function usePerformanceOptimization() {
  useEffect(() => {
    // Optimize images when component mounts
    if (typeof window !== 'undefined') {
      optimizeImages();
    }
  }, []);
}

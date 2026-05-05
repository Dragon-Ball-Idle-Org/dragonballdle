export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initObservers();
    }
  }

  private initObservers() {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const fidEntry = entry as PerformanceEventTiming;
          if (fidEntry.processingStart) {
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
            this.metrics.cls = clsValue;
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch {
      console.warn('CLS observer not supported');
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch {
      console.warn('FCP observer not supported');
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      }
    }
    return { ...this.metrics };
  }

  getPerformanceGrade(): 'good' | 'needs-improvement' | 'poor' {
    const metrics = this.getMetrics();

    if (metrics.lcp && metrics.lcp > 4000) return 'poor';
    if (metrics.lcp && metrics.lcp > 2500) return 'needs-improvement';

    if (metrics.cls && metrics.cls > 0.25) return 'poor';
    if (metrics.cls && metrics.cls > 0.1) return 'needs-improvement';

    if (metrics.fid && metrics.fid > 300) return 'poor';
    if (metrics.fid && metrics.fid > 100) return 'needs-improvement';

    return 'good';
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const preloadCriticalResources = (resources: string[]) => {
  if (typeof window === 'undefined') return;

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;

    if (resource.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
      link.as = 'image';
    } else if (resource.match(/\.(css)$/i)) {
      link.as = 'style';
    } else if (resource.match(/\.(js)$/i)) {
      link.as = 'script';
    } else if (resource.match(/\.(woff|woff2|ttf|eot)$/i)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
  });
};

export const deferNonCriticalLoading = (callback: () => void, delay = 0) => {
  if (typeof window === 'undefined') return;

  if (document.readyState === 'complete') {
    setTimeout(callback, delay);
  } else {
    window.addEventListener('load', () => {
      setTimeout(callback, delay);
    });
  }
};

export const optimizeImages = () => {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

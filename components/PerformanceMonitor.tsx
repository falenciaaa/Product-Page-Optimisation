'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  navigationTime: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const measurePerformance = () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const ttfb = perfData.responseStart - perfData.requestStart;
      const navigationTime = perfData.loadEventEnd - perfData.fetchStart;

      let fcp = 0;
      let lcp = 0;
      let fid = 0;
      let cls = 0;

      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        fcp = fcpEntry.startTime;
      }

      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            lcp = lastEntry.renderTime || lastEntry.loadTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              fid = entry.processingStart - entry.startTime;
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          setTimeout(() => {
            setMetrics({
              ttfb: Math.round(ttfb),
              fcp: Math.round(fcp),
              lcp: Math.round(lcp),
              fid: Math.round(fid),
              cls: Math.round(cls * 1000) / 1000,
              navigationTime: Math.round(navigationTime),
            });
          }, 3000);
        } catch (e) {
          console.error('Performance Observer error:', e);
        }
      } else {
        setMetrics({
          ttfb: Math.round(ttfb),
          fcp: Math.round(fcp),
          lcp: 0,
          fid: 0,
          cls: 0,
          navigationTime: Math.round(navigationTime),
        });
      }
    };

    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  const getScore = (metric: string, value: number): { score: string; color: string; bg: string } => {
    const thresholds: { [key: string]: { good: number; needsImprovement: number } } = {
      ttfb: { good: 200, needsImprovement: 500 },
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return { score: 'N/A', color: '#6b7280', bg: '#f3f4f6' };

    if (value <= threshold.good) {
      return { score: 'Good', color: '#059669', bg: '#d1fae5' };
    } else if (value <= threshold.needsImprovement) {
      return { score: 'Needs Work', color: '#d97706', bg: '#fef3c7' };
    } else {
      return { score: 'Poor', color: '#dc2626', bg: '#fee2e2' };
    }
  };

  const getScorePercentage = (metric: string, value: number): number => {
    const thresholds: { [key: string]: { good: number } } = {
      ttfb: { good: 200 },
      fcp: { good: 1800 },
      lcp: { good: 2500 },
      fid: { good: 100 },
      cls: { good: 0.1 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 0;

    const percentage = Math.min(100, (threshold.good / value) * 100);
    return Math.max(0, percentage);
  };

  if (!metrics) return null;

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: show ? '#1a1a1a' : '#2d2d2d',
          color: '#f5f5f5',
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '13px',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'all 0.2s ease',
          letterSpacing: '0.2px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#1a1a1a';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = show ? '#1a1a1a' : '#2d2d2d';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
        }}
      >
        <span style={{ fontSize: '12px', opacity: 0.7 }}>{show ? '✕' : '◈'}</span>
        {show ? 'Close' : 'Performance'}
      </button>

      {show && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          width: '380px',
          zIndex: 9999,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s ease-out',
        }}>
          <div style={{
            background: '#000',
            padding: '20px 24px',
            color: 'white',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}>
              Performance Metrics
            </h3>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '13px',
              opacity: 0.9,
            }}>
              Core Web Vitals Analysis
            </p>
          </div>
          
          <div style={{ padding: '24px', maxHeight: '250px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'ttfb', label: 'TTFB', desc: 'Time to First Byte', value: metrics.ttfb, unit: 'ms' },
                { key: 'fcp', label: 'FCP', desc: 'First Contentful Paint', value: metrics.fcp, unit: 'ms' },
                ...(metrics.lcp > 0 ? [{ key: 'lcp', label: 'LCP', desc: 'Largest Contentful Paint', value: metrics.lcp, unit: 'ms' }] : []),
                ...(metrics.fid > 0 ? [{ key: 'fid', label: 'FID', desc: 'First Input Delay', value: metrics.fid, unit: 'ms' }] : []),
                { key: 'cls', label: 'CLS', desc: 'Cumulative Layout Shift', value: metrics.cls, unit: '' },
              ].map((metric) => {
                const score = getScore(metric.key, metric.value);
                const percentage = getScorePercentage(metric.key, metric.value);
                
                return (
                  <div key={metric.key} style={{
                    background: '#fafafa',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#111', letterSpacing: '0.5px' }}>
                          {metric.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                          {metric.desc}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#111' }}>
                          {metric.value}{metric.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111', letterSpacing: '0.5px' }}>
                      Total Load Time
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                      Complete page load
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#111' }}>
                    {(metrics.navigationTime / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
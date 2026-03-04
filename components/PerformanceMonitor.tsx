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
    let lcpValue = 0;
    let clsValue = 0;
    const observers: PerformanceObserver[] = [];

    const getNavMetrics = () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!perfData) return null;
      return {
        ttfb: Math.round(perfData.responseStart - perfData.requestStart),
        navigationTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      };
    };

    const getFcp = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
      return fcpEntry ? Math.round(fcpEntry.startTime) : 0;
    };

    const updateMetrics = () => {
      const nav = getNavMetrics();
      if (!nav) return;
      setMetrics(prev => ({
        ttfb: nav.ttfb,
        fcp: getFcp(),
        lcp: Math.round(lcpValue),
        fid: prev?.fid ?? 0,
        cls: Math.round(clsValue * 1000) / 1000,
        navigationTime: nav.navigationTime,
      }));
    };

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as any;
        lcpValue = last.renderTime || last.loadTime;
        updateMetrics();
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch (_) {}

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) clsValue += entry.value;
        }
        updateMetrics();
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch (_) {}

    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0] as any;
        const fid = Math.round(entry.processingStart - entry.startTime);
        setMetrics(prev => prev ? { ...prev, fid } : null);
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    } catch (_) {}

    const init = () => setTimeout(updateMetrics, 300);
    if (document.readyState === 'complete') {
      init();
    } else {
      window.addEventListener('load', init);
    }

    return () => {
      observers.forEach(o => o.disconnect());
    };
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
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
          </div>

          <div style={{ padding: '24px', maxHeight: '250px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'ttfb', label: 'TTFB', desc: 'Time to First Byte', value: metrics.ttfb, unit: 'ms' },
                { key: 'fcp', label: 'FCP', desc: 'First Contentful Paint', value: metrics.fcp, unit: 'ms' },
                { key: 'lcp', label: 'LCP', desc: 'Largest Contentful Paint', value: metrics.lcp, unit: 'ms' },
                { key: 'fid', label: 'FID', desc: 'First Input Delay', value: metrics.fid, unit: 'ms' },
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
                        <div style={{ fontSize: '20px', fontWeight: 700, color: metric.value === 0 ? '#999' : '#111' }}>
                          {metric.value === 0 ? 'N/A' : `${metric.value}${metric.unit}`}
                        </div>
                        {metric.value > 0 && (
                          <div style={{
                            display: 'inline-block',
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            marginTop: '4px',
                            color: score.color,
                            background: score.bg,
                          }}>
                            {score.score}
                          </div>
                        )}
                      </div>
                    </div>

                    {metric.value > 0 && (
                      <div style={{
                        height: '4px',
                        background: '#e5e7eb',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        marginTop: '12px',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: score.color,
                          borderRadius: '2px',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
                      Total Load Time
                    </div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                      Complete page load
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                    {(metrics.navigationTime / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>

              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '11px',
                color: '#856404',
              }}>
                <strong>Tip:</strong> FID updates automatically on first interaction. LCP updates as the browser finds larger elements.
              </div>
            </div>
          </div>

          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            background: '#fafafa',
            display: 'flex',
            gap: '12px',
            fontSize: '11px',
            justifyContent: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: '#059669', borderRadius: '2px' }} />
              <span style={{ color: '#666' }}>Good</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: '#d97706', borderRadius: '2px' }} />
              <span style={{ color: '#666' }}>Needs Work</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: '#dc2626', borderRadius: '2px' }} />
              <span style={{ color: '#666' }}>Poor</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// Performance metrics collection utility
const MAX_STORED_METRICS = 1000; // Maximum number of metrics to store

const getSystemMetrics = () => ({
  cpu: Math.round(Math.random() * 100),
  memory: Math.round(Math.random() * 100),
  network: {
    latency: Math.round(Math.random() * 200),
    bandwidth: Math.round(Math.random() * 100)
  }
});

export const collectMetrics = async (reportName, pageLoadTime, renderTime, visuals) => {
  try {
    const memory = performance.memory || {};
    const connection = navigator.connection || {};
    const sessionId = localStorage.getItem('sessionId') || Math.random().toString(36).substring(7);
    localStorage.setItem('sessionId', sessionId);

  const metrics = {
    timestamp: new Date().toISOString(),
    sessionId,
    reportName,
    performance: {
      pageLoadTime,
      renderTime,
      firstContentfulPaint: await getFirstContentfulPaint(),
      userCount: getCurrentUserCount(),
      domInteractive: performance.timing.domInteractive - performance.timing.navigationStart,
      resourceTiming: getResourceTiming(),
    },
    system: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      memory: {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
      },
      connection: {
        type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      },
    },
    powerbi: {
      visibleReportElements: visuals ? visuals.length : 0,
      reportInteractions: getReportInteractions(),
      dataRefreshTime: measureDataRefreshTime(),
      visualLoadTimes: await measureVisualLoadTimes(visuals),
    },
    user: {
      sessionId: localStorage.getItem('user_token') ? 'authenticated' : 'anonymous',
      sessionDuration: getSessionDuration(),
    },
  };

  // Store metrics in localStorage with a limit
  const existingMetrics = JSON.parse(localStorage.getItem('powerbi_metrics') || '[]');
  existingMetrics.push(metrics);
  
  // Keep only the last MAX_STORED_METRICS entries
  if (existingMetrics.length > MAX_STORED_METRICS) {
    existingMetrics.splice(0, existingMetrics.length - MAX_STORED_METRICS);
  }
  
  localStorage.setItem('powerbi_metrics', JSON.stringify(existingMetrics));
  
  // Update active sessions
  updateActiveSessions(sessionId);

  // Log metrics for development
  console.log('Performance Metrics:', metrics);
  
    return metrics;
  } catch (error) {
    console.error('Error collecting metrics:', error);
    return {
      timestamp: new Date().toISOString(),
      reportName,
      performance: { pageLoadTime, renderTime },
      error: error.message
    };
  }
};

// Helper functions for detailed metrics
const getFirstContentfulPaint = async () => {
  const [entry] = await performance.getEntriesByType('paint');
  return entry ? entry.startTime : null;
};

const getResourceTiming = () => {
  const resources = performance.getEntriesByType('resource');
  return resources.map(resource => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType,
  }));
};

const getVisibleElements = (reportElement) => {
  const visualElements = reportElement.querySelectorAll('.visual-container') || [];
  return visualElements.length;
};

const getReportInteractions = () => {
  const interactions = JSON.parse(sessionStorage.getItem('report_interactions') || '[]');
  return {
    totalClicks: interactions.length,
    lastInteraction: interactions[interactions.length - 1],
  };
};

const measureDataRefreshTime = () => {
  // Implement PowerBI specific data refresh timing
  return performance.now();
};

const measureVisualLoadTimes = async (visuals) => {
  if (!visuals || !Array.isArray(visuals)) return [];

  try {
    // Simulate load times and performance metrics for each visual
    return visuals.map(visual => {
      const baseLoadTime = Math.random() * 1000 + 500; // Base load time between 500-1500ms
      const renderTime = baseLoadTime * 0.7; // Render time is typically faster
      const dataSize = Math.random() * 1000 + 100; // Data size between 100-1100KB

      return {
        visualId: visual.id,
        visualType: visual.type,
        title: visual.title,
        loadTime: baseLoadTime,
        renderTime: renderTime,
        dataSize: Math.round(dataSize),
        performance: {
          cpu: Math.round(Math.random() * 100),
          memory: Math.round(Math.random() * 100),
        },
        status: baseLoadTime < 1000 ? 'optimal' : baseLoadTime < 2000 ? 'fair' : 'poor'
      };
    });
  } catch (error) {
    console.error('Error measuring visual load times:', error);
    return [];
  }
};

const getSessionDuration = () => {
  const startTime = localStorage.getItem('session_start');
  if (!startTime) {
    localStorage.setItem('session_start', Date.now().toString());
    return 0;
  }
  return Date.now() - parseInt(startTime);
};

const updateActiveSessions = (sessionId) => {
  const now = Date.now();
  const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '{}');
  
  activeSessions[sessionId] = now;
  
  // Clean up old sessions (older than 1 minute)
  Object.keys(activeSessions).forEach(sid => {
    if (now - activeSessions[sid] > 60000) {
      delete activeSessions[sid];
    }
  });
  
  localStorage.setItem('active_sessions', JSON.stringify(activeSessions));
};

const getCurrentUserCount = () => {
  const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '{}');
  return Object.keys(activeSessions).length;
};



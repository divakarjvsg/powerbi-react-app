import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const getResourceMetrics = () => [
  { subject: 'CPU', value: Math.random() * 100 },
  { subject: 'Memory', value: Math.random() * 100 },
  { subject: 'Network', value: Math.random() * 100 },
  { subject: 'Disk I/O', value: Math.random() * 100 },
  { subject: 'GPU', value: Math.random() * 100 },
];

const getErrorAnalysis = () => {
  const errorTypes = [
    { type: 'Timeout', impact: 'High' },
    { type: 'Data Load', impact: 'Medium' },
    { type: 'Rendering', impact: 'Low' },
  ];

  return errorTypes.map(error => ({
    time: new Date().toLocaleTimeString(),
    type: error.type,
    count: Math.floor(Math.random() * 10),
    impact: error.impact,
  }));
};

const downloadMetrics = (data, type) => {
  const formatData = (metrics) => {
    switch(type) {
      case 'visual':
        return metrics.map(m => m.powerbi.visualLoadTimes).flat().map(v => ({
          visualId: v.visualId,
          type: v.visualType,
          title: v.title,
          loadTime: v.loadTime,
          renderTime: v.renderTime,
          dataSize: v.dataSize,
          cpu: v.performance.cpu,
          memory: v.performance.memory,
          status: v.status
        }));
      case 'system':
        return metrics.map(m => ({
          timestamp: m.timestamp,
          pageLoadTime: m.pageLoadTime,
          renderTime: m.renderTime,
          memory: m.system.memory,
          cpu: m.system.cpu,
          networkLatency: m.system.network?.latency || 0,
          networkBandwidth: m.system.network?.bandwidth || 0
        }));
      default:
        return metrics;
    }
  };

  const formattedData = formatData(data);
  const csv = Papa.unparse(formattedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `powerbi-metrics-${type}-${new Date().toISOString()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const PerformanceDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState([]);
  const [timeRange, setTimeRange] = useState('1h'); // 1h, 6h, 24h
  const [summary, setSummary] = useState({
    avgLoadTime: 0,
    avgRenderTime: 0,
    totalUsers: 0,
    errorRate: 0,
    p95LoadTime: 0,
    activeUsers: 0,
    peakUsers: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    errorCount: 0,
  });

  const filteredMetrics = useMemo(() => {
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    }[timeRange];
    return metrics.filter(m => 
      new Date(m.timestamp) > new Date(now - timeRangeMs)
    );
  }, [metrics, timeRange]);

  useEffect(() => {
    const fetchMetrics = () => {
      try {
        const storedMetrics = JSON.parse(localStorage.getItem('powerbi_metrics') || '[]');
        setMetrics(storedMetrics);

        // Calculate summary from all metrics
        if (storedMetrics.length > 0) {
          const latestMetrics = storedMetrics[storedMetrics.length - 1];
          const allLoadTimes = storedMetrics.map(m => m.pageLoadTime);
          const allRenderTimes = storedMetrics.map(m => m.renderTime);
          
          const avgLoad = allLoadTimes.reduce((a, b) => a + b, 0) / allLoadTimes.length;
          const avgRender = allRenderTimes.reduce((a, b) => a + b, 0) / allRenderTimes.length;
          
          // Calculate P95
          const sortedLoadTimes = [...allLoadTimes].sort((a, b) => a - b);
          const p95Index = Math.floor(sortedLoadTimes.length * 0.95);
          const p95LoadTime = sortedLoadTimes[p95Index] || avgLoad;

          setSummary({
            avgLoadTime: avgLoad,
            avgRenderTime: avgRender,
            totalUsers: latestMetrics.user.totalUsers || 0,
            errorRate: latestMetrics.errors?.errorRate || 0,
            p95LoadTime: p95LoadTime,
            activeUsers: latestMetrics.user.activeUsers || 0,
            peakUsers: latestMetrics.user.peakUsers || Math.max(...storedMetrics.map(m => m.user.activeUsers || 0)),
            errorCount: latestMetrics.errors?.count || 0,
            totalRequests: latestMetrics.powerbi?.totalRequests || storedMetrics.length,
            avgResponseTime: latestMetrics.powerbi?.avgResponseTime || avgLoad,
          });
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);



  const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  
  const percentile = (arr, p) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p / 100;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  const exportOptions = [
    { label: 'Visual Metrics', value: 'visual' },
    { label: 'System Metrics', value: 'system' },
    { label: 'All Metrics', value: 'all' }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Time Range Selector */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['1h', '6h', '24h'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'contained' : 'outlined'}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Performance Summary
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">Response Times</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Average Load Time</Typography>
                        <Typography variant="h6">{summary.avgLoadTime.toFixed(2)}ms</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">P95 Load Time</Typography>
                        <Typography variant="h6">{summary.p95LoadTime.toFixed(2)}ms</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Avg Render Time</Typography>
                        <Typography variant="h6">{summary.avgRenderTime.toFixed(2)}ms</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">User Activity</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Active Users</Typography>
                        <Typography variant="h6">{summary.activeUsers}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Peak Users</Typography>
                        <Typography variant="h6">{summary.peakUsers}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Total Users</Typography>
                        <Typography variant="h6">{summary.totalUsers}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">Error Metrics</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Error Rate</Typography>
                        <Typography variant="h6" color={summary.errorRate > 0.05 ? 'error.main' : 'success.main'}>
                          {(summary.errorRate * 100).toFixed(2)}%
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Total Errors</Typography>
                        <Typography variant="h6">{summary.errorCount}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Success Rate</Typography>
                        <Typography variant="h6" color="success.main">
                          {((1 - summary.errorRate) * 100).toFixed(2)}%
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">System Health</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Total Requests</Typography>
                        <Typography variant="h6">{summary.totalRequests}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Avg Response Time</Typography>
                        <Typography variant="h6">{summary.avgResponseTime.toFixed(2)}ms</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Memory Usage</Typography>
                        <Typography variant="h6">{Math.round(Math.random() * 100)}%</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Export Data
                  </Typography>
                  <Grid container spacing={1}>
                    {exportOptions.map((option) => (
                      <Grid item xs={12} key={option.value}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => downloadMetrics(filteredMetrics, option.value)}
                        >
                          {option.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics Over Time
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable">
                <Tab label="Load Times" />
                <Tab label="User Activity" />
                <Tab label="Error Analysis" />
                <Tab label="Resource Usage" />
              </Tabs>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              {activeTab === 0 && (
                <LineChart
                  data={filteredMetrics}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value) => `${value.toFixed(2)}ms`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="performance.pageLoadTime" name="Page Load Time" stroke="#8884d8" />
                  <Line type="monotone" dataKey="performance.renderTime" name="Render Time" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="performance.firstContentfulPaint" name="FCP" stroke="#ffc658" />
                </LineChart>
              )}
              
              {activeTab === 1 && (
                <AreaChart
                  data={filteredMetrics}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="performance.userCount" name="Active Users" fill="#8884d8" stroke="#8884d8" />
                </AreaChart>
              )}
              
              {activeTab === 2 && (
                <ScatterChart
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="performance.pageLoadTime"
                    name="Load Time"
                    unit="ms"
                  />
                  <YAxis
                    type="number"
                    dataKey="performance.renderTime"
                    name="Render Time"
                    unit="ms"
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter
                    name="Performance"
                    data={filteredMetrics}
                    fill="#8884d8"
                  />
                </ScatterChart>
              )}
              
              {activeTab === 3 && (
                <RadarChart outerRadius={150} width={500} height={300} data={getResourceMetrics()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Resource Usage" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Error Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Error Analysis
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Error Type</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Impact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getErrorAnalysis().map((error, index) => (
                    <TableRow key={index}>
                      <TableCell>{error.time}</TableCell>
                      <TableCell>{error.type}</TableCell>
                      <TableCell>{error.count}</TableCell>
                      <TableCell>
                        <Box sx={{
                          color: error.impact === 'High' ? 'error.main' :
                                error.impact === 'Medium' ? 'warning.main' : 'success.main'
                        }}>
                          {error.impact}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Visual Performance Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Visual Performance Details
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Visual</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Load Time</TableCell>
                    <TableCell align="right">Render Time</TableCell>
                    <TableCell align="right">Data Size</TableCell>
                    <TableCell align="right">CPU</TableCell>
                    <TableCell align="right">Memory</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMetrics.length > 0 &&
                    filteredMetrics[filteredMetrics.length - 1].powerbi.visualLoadTimes.map((visual) => (
                      <TableRow key={visual.visualId}>
                        <TableCell>{visual.title || visual.visualId}</TableCell>
                        <TableCell>{visual.visualType}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={visual.loadTime < 1000 ? 'success.main' : visual.loadTime < 2000 ? 'warning.main' : 'error.main'}
                          >
                            {visual.loadTime.toFixed(0)}ms
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{visual.renderTime.toFixed(0)}ms</TableCell>
                        <TableCell align="right">{visual.dataSize}KB</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={visual.performance.cpu < 70 ? 'success.main' : visual.performance.cpu < 90 ? 'warning.main' : 'error.main'}
                          >
                            {visual.performance.cpu}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={visual.performance.memory < 70 ? 'success.main' : visual.performance.memory < 90 ? 'warning.main' : 'error.main'}
                          >
                            {visual.performance.memory}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              color: visual.status === 'optimal' ? 'success.main' :
                                    visual.status === 'fair' ? 'warning.main' : 'error.main',
                              fontWeight: 'medium'
                            }}
                          >
                            {visual.status.charAt(0).toUpperCase() + visual.status.slice(1)}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PerformanceDashboard;

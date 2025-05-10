import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users over 30 seconds
    { duration: '1m', target: 10 },  // Stay at 10 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users over 30 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should complete within 2s
    http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
  },
};

export default function () {
  // Test the main page load
  const mainPage = http.get('http://localhost:3000');
  check(mainPage, {
    'main page status is 200': (r) => r.status === 200,
    'main page loads under 2s': (r) => r.timings.duration < 2000,
  });

  // Test the PowerBI report iframe load
  const reportPage = http.get('http://localhost:3000/reports');
  check(reportPage, {
    'report page status is 200': (r) => r.status === 200,
    'report page loads under 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1); // Wait 1 second between iterations
}

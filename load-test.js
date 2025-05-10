import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const errorRate = new Rate('errors');
const reportLoadTime = new Trend('report_load_time');
const visualLoadTime = new Trend('visual_load_time');
const interactionTime = new Trend('interaction_time');

// Test scenarios
const scenarios = {
  smoke: {
    executor: 'constant-vus',
    vus: 1,
    duration: '1m',
  },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 20 },  // Ramp up to 20 users
      { duration: '5m', target: 50 },  // Ramp up to 50 users
      { duration: '10m', target: 50 }, // Stay at 50 users
      { duration: '3m', target: 0 },   // Ramp down
    ],
  },
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '3m', target: 100 }, // Ramp up to 100 users
      { duration: '5m', target: 100 }, // Stay at 100 users
      { duration: '2m', target: 0 },   // Ramp down
    ],
  },
  soak: {
    executor: 'constant-vus',
    vus: 30,
    duration: '2h',
  },
};

// Test configuration
export const options = {
  scenarios,
  thresholds: {
    'http_req_duration': ['p(95)<2000'],    // 95% of requests should be below 2s
    'report_load_time': ['p(95)<5000'],     // 95% of reports should load within 5s
    'visual_load_time': ['p(95)<1000'],     // 95% of visuals should load within 1s
    'interaction_time': ['p(95)<500'],      // 95% of interactions should complete within 500ms
    'errors': ['rate<0.05'],                // Error rate should be below 5%
  },
};

const BASE_URL = 'http://localhost:3000';

// Simulate different user interactions with PowerBI reports
const reportInteractions = [
  { name: 'filter', weight: 0.3 },
  { name: 'sort', weight: 0.2 },
  { name: 'drill_down', weight: 0.2 },
  { name: 'change_page', weight: 0.2 },
  { name: 'export', weight: 0.1 },
];

// Main test function
export default function () {
  group('login_flow', () => {
    const loginRes = http.get(`${BASE_URL}/`);
    check(loginRes, {
      'login page loaded': (r) => r.status === 200,
    });

    // Simulate login
    const loginData = http.post(`${BASE_URL}/api/login`, {
      email: `test.user${__VU}@example.com`,
      password: 'testpassword',
    });

    check(loginData, {
      'login successful': (r) => r.status === 200,
    });
  });

  sleep(1);

  group('report_viewing', () => {
    const reportStart = Date.now();
    const reportsRes = http.get(`${BASE_URL}/reports`, {
      headers: {
        'Authorization': `Bearer ${__ENV.TEST_TOKEN}`,
      },
    });

    check(reportsRes, {
      'report page loaded': (r) => r.status === 200,
    });

    reportLoadTime.add(Date.now() - reportStart);

    // Simulate report interactions
    for (let i = 0; i < 3; i++) {
      const interaction = randomItem(reportInteractions);
      const interactionStart = Date.now();

      // Simulate interaction with report
      const interactionRes = http.post(
        `${BASE_URL}/api/report/interaction`,
        JSON.stringify({
          type: interaction.name,
          reportId: 'sample-report',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${__ENV.TEST_TOKEN}`,
          },
        }
      );

      check(interactionRes, {
        'interaction successful': (r) => r.status === 200,
      });

      interactionTime.add(Date.now() - interactionStart);
      sleep(Math.random() * 2 + 1); // Random think time between interactions
    }
  });

  group('visual_performance', () => {
    // Measure individual visual load times
    const visuals = ['chart1', 'table1', 'matrix1'];
    visuals.forEach(visualId => {
      const visualStart = Date.now();
      const visualRes = http.get(`${BASE_URL}/api/visual/${visualId}`, {
        headers: {
          'Authorization': `Bearer ${__ENV.TEST_TOKEN}`,
        },
      });

      check(visualRes, {
        'visual loaded': (r) => r.status === 200,
      });

      visualLoadTime.add(Date.now() - visualStart);
    });
  });

  sleep(Math.random() * 3 + 2); // Random think time between iterations
}

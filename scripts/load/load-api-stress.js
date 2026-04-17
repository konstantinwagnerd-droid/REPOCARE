// k6 API-Stress: 500 RPS gegen Lese-Endpoints
import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    api_stress: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 100,
      maxVUs: 300,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    http_req_failed: ['rate<0.005'],
  },
};

const endpoints = [
  '/api/health',
  '/api/bewohner?limit=20',
  '/api/dashboard/kpis',
  '/api/uebergabe/today',
  '/api/pflegebericht?limit=10',
];

export default function () {
  const url = BASE + endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(url);
  check(res, { 'api < 500': (r) => r.status < 500 });
}

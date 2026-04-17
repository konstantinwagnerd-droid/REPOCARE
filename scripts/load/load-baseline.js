// k6 Baseline-Load-Test: 10 VUs / 1min
// Usage: k6 run scripts/load/load-baseline.js --env BASE_URL=http://localhost:3000
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<500'],       // p95 < 500ms
    http_req_failed: ['rate<0.001'],         // Error-Rate < 0.1%
  },
};

export default function () {
  const home = http.get(`${BASE}/`);
  check(home, { 'home 200/3xx': (r) => r.status < 400 });
  sleep(1);
  const login = http.get(`${BASE}/login`);
  check(login, { 'login 200': (r) => r.status === 200 });
  sleep(1);
}

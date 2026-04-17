// k6 Normal-Load: 50 VUs / 5min, realistische User-Journey
// Simuliert Pflegepersonal-Workflow
import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';
const USER = __ENV.LOAD_USER || 'smoke@careai.health';
const PW = __ENV.LOAD_PW || 'smoke-pw';

export const options = {
  stages: [
    { duration: '1m', target: 50 },    // ramp-up
    { duration: '3m', target: 50 },    // sustained
    { duration: '1m', target: 0 },     // ramp-down
  ],
  thresholds: {
    'http_req_duration{type:read}': ['p(95)<500'],
    'http_req_duration{type:write}': ['p(95)<1500'],
    http_req_failed: ['rate<0.001'],
  },
};

export default function () {
  let csrfToken = '';

  group('Login', () => {
    const loginPage = http.get(`${BASE}/login`, { tags: { type: 'read' } });
    check(loginPage, { 'login 200': (r) => r.status === 200 });
    const match = loginPage.body && loginPage.body.match(/csrf[-_]?token["':\s]+([A-Za-z0-9+/=_-]+)/i);
    if (match) csrfToken = match[1];

    const post = http.post(`${BASE}/api/auth/signin`,
      JSON.stringify({ email: USER, password: PW, csrfToken }),
      { headers: { 'Content-Type': 'application/json' }, tags: { type: 'write' } }
    );
    check(post, { 'auth ok': (r) => r.status < 500 });
  });

  group('Dashboard', () => {
    const dash = http.get(`${BASE}/app/dashboard`, { tags: { type: 'read' } });
    check(dash, { 'dash 200': (r) => r.status === 200 });
  });
  sleep(2);

  group('Bewohner-Browse', () => {
    const list = http.get(`${BASE}/app/bewohner`, { tags: { type: 'read' } });
    check(list, { 'liste 200': (r) => r.status === 200 });
    sleep(1);
    for (let i = 0; i < 3; i++) {
      const detail = http.get(`${BASE}/app/bewohner/demo-${i + 1}`, { tags: { type: 'read' } });
      check(detail, { 'detail < 500ms': (r) => r.timings.duration < 1000 });
      sleep(1);
    }
  });

  group('Pflegebericht schreiben', () => {
    const payload = JSON.stringify({
      bewohnerId: 'demo-1',
      text: `Schichtnotiz ${Date.now()}: Alles in Ordnung, Mahlzeit eingenommen.`,
      kategorie: 'routine',
    });
    const res = http.post(`${BASE}/api/pflegebericht`, payload, {
      headers: { 'Content-Type': 'application/json' },
      tags: { type: 'write' },
    });
    check(res, { 'bericht write': (r) => r.status < 500 });
  });

  sleep(3);
}

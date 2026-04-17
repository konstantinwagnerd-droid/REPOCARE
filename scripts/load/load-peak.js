// k6 Peak-Load: 200 VUs / 2min - simuliert Schichtwechsel
// Schichtwechsel: ~30 Mitarbeiter gleichzeitig Login + Dashboard + Uebergabe lesen
import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 200 },   // aggressive ramp-up (Schichtwechsel)
    { duration: '1m', target: 200 },    // sustained peak
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],     // unter Peak: bis 1% erlaubt
  },
};

export default function () {
  group('Schichtwechsel-Burst', () => {
    const dash = http.get(`${BASE}/app/dashboard`);
    check(dash, { 'dash erreichbar': (r) => r.status < 500 });

    const uebergabe = http.get(`${BASE}/app/uebergabe`);
    check(uebergabe, { 'uebergabe erreichbar': (r) => r.status < 500 });

    const bewohner = http.get(`${BASE}/app/bewohner`);
    check(bewohner, { 'liste erreichbar': (r) => r.status < 500 });
  });
  sleep(1);
}

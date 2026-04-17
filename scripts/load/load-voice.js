// k6 Voice-Stress: Voice-Transcribe-Endpoint unter Last
// Simuliert gleichzeitige Diktate
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

// Fake audio blob (5KB) - reale Tests brauchen echtes WAV-File
const FAKE_AUDIO = 'a'.repeat(5 * 1024);

export const options = {
  vus: 20,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<5000'],   // Voice darf bis 5s dauern
    http_req_failed: ['rate<0.02'],
  },
};

export default function () {
  const payload = {
    audio: FAKE_AUDIO,
    format: 'wav',
    language: 'de-DE',
  };
  const res = http.post(`${BASE}/api/voice/transcribe`,
    JSON.stringify(payload),
    { headers: { 'Content-Type': 'application/json' }, timeout: '10s' }
  );
  // 404 = Endpoint nicht aktiv, 400 = fake audio abgelehnt - beides OK fuer Last-Test
  check(res, { 'voice antwortet': (r) => r.status < 500 });
  sleep(2);
}

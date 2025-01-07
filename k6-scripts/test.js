import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export let errorCount = new Counter('errors');

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up to 50 users
    { duration: '1m30s', target: 50 }, // Stay at 50 users
    { duration: '30s', target: 0 }, // Ramp-down to 0 users
  ],
};

export default function testload() {
  const res = http.get('http://localhost:3000');

  const checkRes = check(res, {
    'is status 200': (r) => r.status === 200,
    'body size is 1234 bytes': (r) => r.body.length > 0, // ปรับตามขนาดที่คาดหวัง
  });

  if (!checkRes) {
    errorCount.add(1);
  }

  sleep(1);
}

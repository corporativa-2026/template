import { startServer } from './server.js';
import { test, expect, beforeAll } from 'vitest';

beforeAll(async () => {
  await startServer(3000);
});

test('GET / should return alive message', async () => {
  const response = await fetch('http://localhost:3000/');

  const { status, statusText, headers } = response;
  expect(status).toBe(200);
  expect(statusText).toBe('Ok');
  expect(headers.get('Content-Type')).toBe('text/plain; charset=utf8');

  const body = await response.text();
  expect(body).toBe('Alive and Kicking');
});

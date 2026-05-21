import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../src/app.js';

test('GET /api returns the health welcome payload', async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { message: 'Welcome to the API' });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

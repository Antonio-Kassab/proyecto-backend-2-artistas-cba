import test from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';

test('GET /api/health debe responder con status 200 y mensaje de servidor activo', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/health`);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.message, 'Servidor activo');
  } finally {
    server.close();
  }
});

test('GET /api/events debe responder con status 200 y un payload vacío', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/events`);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.status, 'success');
    assert.deepStrictEqual(body.payload, []);
  } finally {
    server.close();
  }
});

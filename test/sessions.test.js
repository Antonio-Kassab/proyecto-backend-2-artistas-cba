import test, { mock } from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/config.js';
import { hashPassword } from '../src/utils/hash.js';

test('POST /api/sessions/register debe registrar un usuario y devolver status 201 sin password', async () => {
  const findOneMock = mock.method(User, 'findOne', async () => null);
  const createMock = mock.method(User, 'create', async (userData) => ({
    _id: '64a1b2c3d4e5f60000000001',
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    password: userData.password,
    role: 'user'
  }));

  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Lucia',
        last_name: 'Gomez',
        email: 'Lucia@Casting.com',
        password: 'contraseña123'
      })
    });

    assert.strictEqual(response.status, 201);

    const body = await response.json();
    assert.strictEqual(body.status, 'success');
    assert.strictEqual(body.payload.first_name, 'Lucia');
    assert.strictEqual(body.payload.last_name, 'Gomez');
    assert.strictEqual(body.payload.email, 'lucia@casting.com');
    assert.strictEqual(body.payload.role, 'user');
    assert.strictEqual(body.payload.password, undefined);

    const savedArg = createMock.mock.calls[0].arguments[0];
    assert.notStrictEqual(savedArg.password, 'contraseña123');
    assert.ok(savedArg.password.startsWith('$2'));
  } finally {
    findOneMock.mock.restore();
    createMock.mock.restore();
    server.close();
  }
});

test('POST /api/sessions/register debe devolver status 400 si faltan campos obligatorios', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Lucia',
        email: 'lucia@casting.com'
      })
    });

    assert.strictEqual(response.status, 400);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'Faltan campos obligatorios');
  } finally {
    server.close();
  }
});

test('POST /api/sessions/register debe devolver status 400 si el formato de email es inválido', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Lucia',
        last_name: 'Gomez',
        email: 'email-invalido',
        password: 'Password123'
      })
    });

    assert.strictEqual(response.status, 400);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'El formato del email no es válido');
  } finally {
    server.close();
  }
});

test('POST /api/sessions/register debe devolver status 409 si el email ya está registrado', async () => {
  const findOneMock = mock.method(User, 'findOne', async () => ({
    _id: '64a1b2c3d4e5f60000000001',
    email: 'lucia@casting.com'
  }));

  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Lucia',
        last_name: 'Gomez',
        email: 'lucia@casting.com',
        password: 'contraseña123'
      })
    });

    assert.strictEqual(response.status, 409);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'El email ya está registrado');
  } finally {
    findOneMock.mock.restore();
    server.close();
  }
});

test('POST /api/sessions/login debe devolver status 200 y setear la cookie currentUser HttpOnly', async () => {
  const hashedPassword = await hashPassword('Secreta123');
  const findOneMock = mock.method(User, 'findOne', async () => ({
    _id: '64a1b2c3d4e5f60000000001',
    email: 'ana@mail.com',
    password: hashedPassword,
    role: 'user'
  }));

  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: '  Ana@Mail.com ',
        password: 'Secreta123'
      })
    });

    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.status, 'success');
    assert.strictEqual(body.message, 'Login correcto');

    const setCookie = response.headers.get('set-cookie');
    assert.ok(setCookie, 'Debe devolver la cabecera Set-Cookie');
    assert.ok(setCookie.includes('currentUser='), 'La cookie debe llamarse currentUser');
    assert.ok(setCookie.includes('HttpOnly'), 'La cookie debe incluir HttpOnly');
    assert.ok(setCookie.includes('SameSite=Lax'), 'La cookie debe incluir SameSite=Lax');
    assert.ok(setCookie.includes('Max-Age=3600'), 'La cookie debe durar 1 hora');
  } finally {
    findOneMock.mock.restore();
    server.close();
  }
});

test('POST /api/sessions/login debe devolver status 400 si faltan email o password', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ana@mail.com' })
    });

    assert.strictEqual(response.status, 400);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'Faltan campos obligatorios');
  } finally {
    server.close();
  }
});

test('POST /api/sessions/login debe devolver status 401 con mensaje genérico si el email no existe', async () => {
  const findOneMock = mock.method(User, 'findOne', async () => null);

  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'noexiste@mail.com',
        password: 'Secreta123'
      })
    });

    assert.strictEqual(response.status, 401);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'Credenciales inválidas');
  } finally {
    findOneMock.mock.restore();
    server.close();
  }
});

test('POST /api/sessions/login debe devolver status 401 con mensaje genérico si la contraseña no coincide', async () => {
  const hashedPassword = await hashPassword('Secreta123');
  const findOneMock = mock.method(User, 'findOne', async () => ({
    _id: '64a1b2c3d4e5f60000000001',
    email: 'ana@mail.com',
    password: hashedPassword,
    role: 'user'
  }));

  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ana@mail.com',
        password: 'PasswordIncorrecta'
      })
    });

    assert.strictEqual(response.status, 401);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'Credenciales inválidas');
  } finally {
    findOneMock.mock.restore();
    server.close();
  }
});

test('GET /api/sessions/current debe devolver status 401 si no se envía cookie', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/current`);

    assert.strictEqual(response.status, 401);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'No autenticado');
  } finally {
    server.close();
  }
});

test('GET /api/sessions/current debe devolver status 401 si el token es inválido o manipulado', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/current`, {
      headers: { Cookie: 'currentUser=token.falso.manipulado' }
    });

    assert.strictEqual(response.status, 401);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'No autenticado');
  } finally {
    server.close();
  }
});

test('GET /api/sessions/current debe devolver status 401 si el token está expirado', async () => {
  const expiredToken = jwt.sign(
    { id: '64a1b2c3d4e5f60000000001', email: 'ana@mail.com', role: 'user' },
    config.jwtSecret,
    { expiresIn: -1 }
  );

  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/current`, {
      headers: { Cookie: `currentUser=${expiredToken}` }
    });

    assert.strictEqual(response.status, 401);

    const body = await response.json();
    assert.strictEqual(body.status, 'error');
    assert.strictEqual(body.message, 'No autenticado');
  } finally {
    server.close();
  }
});

test('Flujo completo: login -> GET /current (200 sin password) -> POST /logout (limpia cookie)', async () => {
  const hashedPassword = await hashPassword('Secreta123');
  const findOneMock = mock.method(User, 'findOne', async () => ({
    _id: '64a1b2c3d4e5f60000000001',
    email: 'ana@mail.com',
    password: hashedPassword,
    role: 'user'
  }));

  const server = app.listen(0);
  const port = server.address().port;

  try {
    // 1. Login
    const loginRes = await fetch(`http://localhost:${port}/api/sessions/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ana@mail.com',
        password: 'Secreta123'
      })
    });
    assert.strictEqual(loginRes.status, 200);

    const cookiePair = loginRes.headers.get('set-cookie').split(';')[0];

    // 2. Consultar /current enviando la cookie recibida
    const currentRes = await fetch(`http://localhost:${port}/api/sessions/current`, {
      headers: { Cookie: cookiePair }
    });
    assert.strictEqual(currentRes.status, 200);

    const currentBody = await currentRes.json();
    assert.strictEqual(currentBody.status, 'success');
    assert.deepStrictEqual(currentBody.payload, {
      id: '64a1b2c3d4e5f60000000001',
      email: 'ana@mail.com',
      role: 'user'
    });

    // 3. Logout
    const logoutRes = await fetch(`http://localhost:${port}/api/sessions/logout`, {
      method: 'POST',
      headers: { Cookie: cookiePair }
    });
    assert.strictEqual(logoutRes.status, 200);

    const logoutBody = await logoutRes.json();
    assert.strictEqual(logoutBody.status, 'success');
    assert.strictEqual(logoutBody.message, 'Sesión cerrada');

    const logoutCookie = logoutRes.headers.get('set-cookie');
    assert.ok(logoutCookie.includes('currentUser=;'), 'Debe vaciar el valor de la cookie');
    assert.ok(logoutCookie.includes('Expires=Thu, 01 Jan 1970'), 'Debe expirar la cookie');
  } finally {
    findOneMock.mock.restore();
    server.close();
  }
});
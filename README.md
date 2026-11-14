# 🎭 Plataforma de Eventos e Inscripciones (Castings Teatrales y Audiovisuales)

API REST modular y escalable para la gestión de eventos, audiciones y castings en Córdoba Capital. Permite a los usuarios consultar convocatorias y eventos artísticos, registrarse, autenticarse mediante JWT en cookies `HttpOnly`, y consultar su sesión activa.

> Proyecto desarrollado para la cursada de **Programación Backend II - Coderhouse**.

---

## 🚀 Tecnologías Utilizadas

* **Node.js** (v20+ con soporte nativo para módulos ESM)
* **Express.js** (Framework web minimalista para routing y middlewares)
* **MongoDB & Mongoose** (Base de datos NoSQL y ODM para modelado de datos)
* **Bcrypt** (Algoritmo de hashing seguro para contraseñas)
* **JsonWebToken (JWT)** (Generación y verificación de tokens de autenticación)
* **Cookie-Parser** (Lectura y manejo de cookies `HttpOnly` en Express)
* **Dotenv** (Gestión segura de variables de entorno)
* **Node Test Runner** (`node:test` y `node:assert` nativos)

---

## ⚙️ Configuración de Variables de Entorno

1. Copiá el archivo `.env.example` en la raíz del proyecto y renombralo a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configurá las variables según tu entorno:
   * `PORT`: Puerto de escucha del servidor (por defecto `8080`).
   * `NODE_ENV`: Entorno de ejecución (`development` / `production`).
   * `MONGO_URL`: URI de conexión a la base de datos MongoDB.
   * `JWT_SECRET`: Clave secreta para la firma de tokens JWT.
   * `JWT_EXPIRES_IN`: Tiempo de expiración de los tokens JWT (por ejemplo `1h`).

---

## 📦 Instalación y Ejecución

1. **Clonar el repositorio e ingresar a la carpeta:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd proyecto-backend-2
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecución en modo desarrollo (recarga automática con Node):**
   ```bash
   npm run dev
   ```

4. **Ejecución en producción:**
   ```bash
   npm start
   ```

5. **Ejecutar tests automatizados:**
   ```bash
   npm test
   ```

---

## 🏛️ Arquitectura por Capas

El proyecto está diseñado siguiendo una arquitectura en capas desacoplada para garantizar escalabilidad, legibilidad y facilidad de testing:

```text
src/
├── app.js               # Configuración de Express, cookie-parser y montaje de rutas (sin listen)
├── server.js            # Punto de entrada operacional: conexión a MongoDB y listen del servidor
├── config/              # Centralización y validación de variables de entorno y conexión a DB
├── routes/              # Definición de endpoints HTTP y asociación con middlewares y controladores
├── controllers/         # Recepción de peticiones (req), manejo de cookies y envío de respuestas (res)
├── services/            # Capa de lógica de negocio y reglas del dominio
├── repositories/        # Abstracción de acceso a datos independiente del motor de base de datos
├── dao/                 # Data Access Object: operaciones directas de persistencia con Mongoose
├── models/              # Esquemas y modelos de datos (User, Event)
├── middlewares/         # Middlewares de control (authMiddleware con JWT, futura autorización)
└── utils/               # Funciones utilitarias transversales (hash.js con bcrypt, jwt.js con jsonwebtoken)
```

---

## 📋 Resumen de Rutas

| Método | Ruta | Descripción | Requiere Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica el estado operativo del servidor | No |
| `GET` | `/api/events` | Lista eventos y castings disponibles | No |
| `POST` | `/api/sessions/register` | Registra un nuevo usuario con contraseña hasheada | No |
| `POST` | `/api/sessions/login` | Inicia sesión y guarda JWT en cookie `currentUser` (`HttpOnly`) | No |
| `GET` | `/api/sessions/current` | Devuelve los datos mínimos del usuario autenticado (`{ id, email, role }`) | Sí (Cookie `currentUser`) |
| `POST` | `/api/sessions/logout` | Cierra la sesión eliminando la cookie `currentUser` | No |

---

## 🔌 Documentación de Endpoints

### 1. Sistema & Health Check

#### `GET /api/health`
Verifica que el servidor esté activo.

* **Respuesta exitosa (`200 OK`):**
```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

### 2. Eventos (Castings y Convocatorias)

#### `GET /api/events`
Lista de eventos y castings disponibles.

* **Respuesta exitosa (`200 OK`):**
```json
{
  "status": "success",
  "payload": []
}
```

---

### 3. Sesiones y Autenticación

#### `POST /api/sessions/register`
Registra un nuevo usuario en MongoDB con la contraseña hasheada mediante `bcrypt`. Valida campos obligatorios, formato de email, longitud mínima de contraseña (6 caracteres), normaliza el email (`trim` y `lowercase`), y evita duplicados asignando el rol `user` por defecto.

* **Request (JSON):**
```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com",
  "password": "Secreta123"
}
```

* **Respuesta exitosa (`201 Created`):**
*(El email se guarda normalizado y nunca se devuelve la contraseña)*
```json
{
  "status": "success",
  "payload": {
    "id": "6721...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

* **Errores posibles:**
  * `400 Bad Request` (Faltan campos obligatorios o formato inválido):
    ```json
    {
      "status": "error",
      "message": "Faltan campos obligatorios"
    }
    ```
  * `409 Conflict` (El email ya existe):
    ```json
    {
      "status": "error",
      "message": "El email ya está registrado"
    }
    ```

---

#### `POST /api/sessions/login`
Valida `email` y `password` comparando contra el hash almacenado mediante `comparePassword`. Si las credenciales son válidas, firma un JWT con `{ id, email, role }` y lo guarda en la cookie **`currentUser`** (`httpOnly: true`, `sameSite: 'lax'`, `maxAge: 3600000`, `secure: true` solo en producción).

* **Request (JSON):**
```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

* **Respuesta exitosa (`200 OK`):**
*(Además setea la cookie `currentUser` `HttpOnly` en la cabecera `Set-Cookie`)*
```json
{
  "status": "success",
  "message": "Login correcto"
}
```

* **Errores posibles:**
  * `400 Bad Request` (Falta email o password):
    ```json
    {
      "status": "error",
      "message": "Faltan campos obligatorios"
    }
    ```
  * `401 Unauthorized` (Email inexistente o contraseña incorrecta — mensaje genérico):
    ```json
    {
      "status": "error",
      "message": "Credenciales inválidas"
    }
    ```

---

#### `GET /api/sessions/current`
Ruta protegida por `authMiddleware`. Lee la cookie `currentUser`, verifica la firma y expiración del JWT, guarda los datos en `req.user` y devuelve la sesión actual sin exponer la contraseña.

* **Request:** Enviar cookie `currentUser` (Postman y navegadores la adjuntan automáticamente después del login).

* **Respuesta exitosa (`200 OK`):**
```json
{
  "status": "success",
  "payload": {
    "id": "6ae38ab40124d87089a05e00",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

* **Error posible (`401 Unauthorized` — sin cookie, token inválido o expirado):**
```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

#### `POST /api/sessions/logout`
Cierra la sesión actual eliminando la cookie `currentUser`.

* **Respuesta exitosa (`200 OK`):**
```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

---

## 📸 Evidencia de Pruebas

### 1. Registro exitoso en Postman (Status 201 Created)
![Registro Postman](./docs/postman-registro201.png)

### 2. Contraseña hasheada en MongoDB Atlas
![Hash en MongoDB](./docs/mongo-hash.png)

### 3. Login exitoso y cookie HttpOnly en Postman (Status 200 OK)
![Login Postman](./docs/postman-login200.png)

### 4. Ruta protegida /current con cookie válida (Status 200 OK)
![Current 200 Postman](./docs/postman-current200.png)

### 5. Ruta protegida /current sin cookie luego de logout (Status 401 Unauthorized)
![Current 401 Postman](./docs/postman-current401.png)
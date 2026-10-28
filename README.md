# 🎭 Plataforma de Actores, Actrices y Castings

API REST modular y escalable para la gestión de actores, actrices y audiciones/castings en Córdoba Capital. Permite a los usuarios consultar perfiles artísticos, así como organizar y participar en convocatorias y audiciones teatrales o audiovisuales.

> Proyecto desarrollado para la cursada de **Programación Backend II - Coderhouse**.

---

## 🚀 Tecnologías Utilizadas

* **Node.js** (v20+ con soporte nativo para módulos ESM)
* **Express.js** (Framework web minimalista para routing y middlewares)
* **MongoDB & Mongoose** (Base de datos NoSQL y ODM para modelado de datos)
* **Dotenv** (Gestión segura de variables de entorno)

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
   * `JWT_SECRET`: Clave secreta para la firma de tokens de autenticación.

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

---

## 🏛️ Arquitectura por Capas

El proyecto está diseñado siguiendo una arquitectura en capas desacoplada para garantizar escalabilidad, legibilidad y facilidad de testing:

```text
src/
├── app.js               # Configuración de Express, middlewares globales y montaje de rutas
├── server.js            # Punto de entrada operacional: conexión a MongoDB y listen del servidor
├── config/              # Centralización y validación de variables de entorno y conexión a DB
├── routes/              # Definición de endpoints HTTP y asociación con sus controladores
├── controllers/         # Recepción de peticiones (req), delegación y envío de respuestas (res)
├── services/            # Capa de lógica de negocio y reglas del dominio
├── repositories/        # Abstracción de acceso a datos independiente del motor de base de datos
├── dao/                 # Data Access Object: operaciones directas de persistencia con Mongoose
├── models/              # Esquemas y modelos de datos (User, Actor/Event)
├── middlewares/         # Middlewares de control (autenticación, autorización por rol, errores)
└── utils/               # Funciones utilitarias transversales (hashing, JWT, helpers)
```

---

## 🔌 Endpoints Disponibles

### 1. Sistema & Health Check
| Método | Endpoint | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica el estado operativo del servidor | `200 OK` |

**Ejemplo de respuesta (`200 OK`):**
```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

### 2. Actores y Castings
| Método | Endpoint | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/actors` | Lista de actores y castings registrados | `200 OK` |

**Ejemplo de respuesta (`200 OK`):**
```json
{
  "status": "success",
  "payload": []
}
```

---

### 3. Sesiones y Autenticación (Rutas Preliminares)
| Método | Endpoint | Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/sessions/register` | Endpoint preliminar de registro de usuarios | `200 OK` |
| `POST` | `/api/sessions/login` | Endpoint preliminar de inicio de sesión | `200 OK` |

**Ejemplo de respuesta (`POST /api/sessions/register`):**
```json
{
  "status": "success",
  "message": "Endpoint preliminar de registro (Sessions)"
}
```

**Ejemplo de respuesta (`POST /api/sessions/login`):**
```json
{
  "status": "success",
  "message": "Endpoint preliminar de login (Sessions)"
}
```
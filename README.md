# Plataforma de Actores y Actrices

## Descripción y Temática
API REST diseñada para la gestión de actores y actrices de Cordoba capital. Proyecto desarrollado para la cursada de Backend II.

## Tecnologías Utilizadas
- Node.js
- Express.js
- Mongoose / MongoDB
- Dotenv

## Configuración de Variables de Entorno
Duplicá el archivo `.env.example` y nombralo `.env`, configurando los siguientes parámetros:
- `PORT`: Puerto de ejecución del servidor (ej. 8080)
- `NODE_ENV`: Entorno de ejecución (development / production)
- `MONGO_URL`: Cadena de conexión a MongoDB
- `JWT_SECRET`: Clave secreta para la firma de tokens

## Instalación y Ejecución
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
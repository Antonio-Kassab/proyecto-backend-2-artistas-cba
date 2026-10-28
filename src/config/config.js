import 'dotenv/config';

const requiredEnv = ['MONGO_URL', 'JWT_SECRET'];

for (const envName of requiredEnv) {
  if (!process.env[envName]) {
    console.warn(`[ADVERTENCIA]: La variable de entorno ${envName} no está definida en el archivo .env`);
  }
}

export const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET || 'secretKeyDefault'
};

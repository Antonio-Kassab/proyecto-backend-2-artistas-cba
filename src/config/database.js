import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
  try {
    if (!config.mongoUrl) {
      throw new Error('MONGO_URL no está configurada.');
    }

    await mongoose.connect(config.mongoUrl);
    console.log('✅ Base de datos MongoDB conectada exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

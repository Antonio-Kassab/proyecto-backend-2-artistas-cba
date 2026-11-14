import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (payload) => {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export const verifyToken = (token) => {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  return jwt.verify(token, config.jwtSecret);
};
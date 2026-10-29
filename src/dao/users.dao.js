import { User } from '../models/User.js';

export const findByEmail = async (email) => {
  return User.findOne({ email });
};

// Crea y persiste un nuevo usuario en la base de datos
export const createUser = async (userData) => {
  return User.create(userData);
};
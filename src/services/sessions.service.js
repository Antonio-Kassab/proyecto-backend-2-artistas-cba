// src/services/sessions.service.js
import { getUserByEmail, saveUser } from '../repositories/users.repository.js';
import { hashPassword } from '../utils/hash.js';

// Expresión regular para validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (userData) => {
  const { first_name, last_name, email, password } = userData;

  // Validar que estén todos los campos obligatorios
  if (!first_name || !last_name || !email || !password) {
    const error = new Error('Faltan campos obligatorios');
    error.status = 400;
    throw error;
  }

  if (!emailRegex.test(email)) {
    const error = new Error('El formato del email no es válido');
    error.status = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error('La contraseña debe tener al menos 6 caracteres');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await saveUser({
    first_name,
    last_name,
    email: normalizedEmail,
    password: hashedPassword
  });

  return {
    id: newUser._id,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    email: newUser.email,
    role: newUser.role
  };
};
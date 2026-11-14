import { getUserByEmail, saveUser } from '../repositories/users.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

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

export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    const error = new Error('Faltan campos obligatorios');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = generateToken({
    id: String(user._id),
    email: user.email,
    role: user.role
  });

  return { token };
};
import { registerUser } from '../services/sessions.service.js';

export const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);

    return res.status(201).json({
      status: 'success',
      payload: newUser
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Error interno del servidor'
    });
  }
};

export const login = async (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Endpoint preliminar de inicio de sesión'
  });
};
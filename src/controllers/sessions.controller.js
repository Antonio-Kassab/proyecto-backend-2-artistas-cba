import { registerUser, loginUser } from '../services/sessions.service.js';
import { config } from '../config/config.js';

const COOKIE_NAME = 'currentUser';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.nodeEnv === 'production'
};

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
  try {
    const { token } = await loginUser(req.body);

    res.cookie(COOKIE_NAME, token, {
      ...baseCookieOptions,
      maxAge: 3600000
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login correcto'
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Error interno del servidor'
    });
  }
};

export const current = (req, res) => {
  return res.status(200).json({
    status: 'success',
    payload: req.user
  });
};

export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, baseCookieOptions);

  return res.status(200).json({
    status: 'success',
    message: 'Sesión cerrada'
  });
};
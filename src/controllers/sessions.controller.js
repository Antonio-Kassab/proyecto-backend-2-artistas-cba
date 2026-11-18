import { config } from '../config/config.js';
import { generateToken } from '../utils/jwt.js';

const COOKIE_NAME = 'currentUser';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.nodeEnv === 'production'
};

export const register = (req, res) => {
  return res.status(201).json({
    status: 'success',
    payload: req.user
  });
};

export const login = (req, res) => {
  try {
    const token = generateToken({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    });

    res.cookie(COOKIE_NAME, token, {
      ...baseCookieOptions,
      maxAge: 3600000
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login correcto'
    });
  } catch (error) {
    return res.status(500).json({
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
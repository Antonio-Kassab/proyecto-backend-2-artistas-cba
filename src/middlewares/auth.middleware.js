import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.currentUser;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No autenticado'
    });
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'No autenticado'
    });
  }
};
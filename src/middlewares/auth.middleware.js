import passport from 'passport';

export const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      {
        session: false,
        badRequestMessage: 'Faltan campos obligatorios'
      },
      (error, user, info, status) => {
        if (error) {
          const statusCode = error.status || 500;
          return res.status(statusCode).json({
            status: 'error',
            message: error.message || 'Error interno del servidor'
          });
        }

        if (!user) {
          // passport-jwt envía una instancia de Error cuando falta la cookie o el JWT falla
          if (info instanceof Error) {
            const isConfigError = info.message?.includes('JWT_SECRET');
            return res.status(isConfigError ? 500 : 401).json({
              status: 'error',
              message: isConfigError ? info.message : 'No autenticado'
            });
          }

          const statusCode = info?.status || status || 401;
          return res.status(statusCode).json({
            status: 'error',
            message: info?.message || 'No autenticado'
          });
        }

        req.user = user;
        return next();
      }
    )(req, res, next);
  };
};
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from './config.js';
import { getUserByEmail, saveUser } from '../repositories/users.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cookieExtractor = (req) => {
  return req?.cookies?.currentUser || null;
};

export const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;

          if (!first_name || !last_name || !email || !password) {
            return done(null, false, {
              status: 400,
              message: 'Faltan campos obligatorios'
            });
          }

          if (!emailRegex.test(email)) {
            return done(null, false, {
              status: 400,
              message: 'El formato del email no es válido'
            });
          }

          if (password.length < 6) {
            return done(null, false, {
              status: 400,
              message: 'La contraseña debe tener al menos 6 caracteres'
            });
          }

          const normalizedEmail = email.trim().toLowerCase();
          const existingUser = await getUserByEmail(normalizedEmail);

          if (existingUser) {
            return done(null, false, {
              status: 409,
              message: 'El email ya está registrado'
            });
          }

          const hashedPassword = await hashPassword(password);

          const newUser = await saveUser({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword
          });

          return done(null, {
            id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      async (email, password, done) => {
        try {
          if (!email || !password) {
            return done(null, false, {
              status: 400,
              message: 'Faltan campos obligatorios'
            });
          }

          const normalizedEmail = email.trim().toLowerCase();
          const user = await getUserByEmail(normalizedEmail);

          if (!user) {
            return done(null, false, {
              status: 401,
              message: 'Credenciales inválidas'
            });
          }

          const isPasswordValid = await comparePassword(password, user.password);

          if (!isPasswordValid) {
            return done(null, false, {
              status: 401,
              message: 'Credenciales inválidas'
            });
          }

          return done(null, {
            id: String(user._id),
            email: user.email,
            role: user.role
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKeyProvider: (_req, _rawJwtToken, done) => {
          if (!config.jwtSecret) {
            return done(new Error('JWT_SECRET no está configurado en las variables de entorno'));
          }
          return done(null, config.jwtSecret);
        }
      },
      async (jwtPayload, done) => {
        try {
          return done(null, {
            id: jwtPayload.id,
            email: jwtPayload.email,
            role: jwtPayload.role
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Espacio preparado para futuras estrategias externas (Google, Facebook, etc.)
 
};
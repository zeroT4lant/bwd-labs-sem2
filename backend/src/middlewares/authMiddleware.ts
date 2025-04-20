import passport from '@config/passport';
import { Request, Response, NextFunction } from 'express';

// Тип для пользователя (должен соответствовать вашему User модели)
interface AuthenticatedUser {
  id: number;
  role: string;
  [key: string]: any;
}

// Расширяем стандартный Request для добавления user
interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

// Middleware для аутентификации JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware для проверки ролей
const authorizeRole =
  (roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Пользователь не аутентифицирован' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    next();
  };

export { authenticateJWT, authorizeRole };

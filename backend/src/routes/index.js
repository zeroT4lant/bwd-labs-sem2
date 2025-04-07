// routes/index.js
import { Router } from 'express';
import userRoutes from './user.routes.js';
// import publicRoutes from './publicjs';
import eventRoutes from './event.routes.js';
// import auth from './auth.js';
// import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = Router();

// Подключаем маршруты пользователей и мероприятий
router.use('/users', userRoutes);
router.use('/events', eventRoutes);

export default router;

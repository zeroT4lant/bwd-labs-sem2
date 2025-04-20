// routes/index.js
import { Router } from 'express';
import publicRoutes from './public.routes';
import userRoutes from './user.routes';
import eventRoutes from './event.routes';
import authRoutes from './auth.routes';

const router = Router();

// Подключаем маршруты пользователей и мероприятий
router.use('/public', publicRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/auth', authRoutes);
export default router;

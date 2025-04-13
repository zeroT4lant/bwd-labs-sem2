// routes/index.js
import { Router } from 'express';
import publicRoutes from './public.routes.js'
import userRoutes from './user.routes.js';
import eventRoutes from './event.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

// Подключаем маршруты пользователей и мероприятий
router.use('/public',publicRoutes)
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/auth',authRoutes)
export default router;

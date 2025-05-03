import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '@controllers/auth.controller';

const router = Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.get('/me', getCurrentUser as any);

export default router;

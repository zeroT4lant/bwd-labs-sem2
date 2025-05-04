import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, updateUser } from '@controllers/auth.controller';

const router = Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.get('/me', getCurrentUser as any);
router.put("/update", updateUser as any)

export default router;

import { Router } from 'express';
import { registerUser,loginUser } from '../controllers/auth.controller.js';

const router = Router();

// router.use(passport.authenticate("jwt", { session: false }));

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router
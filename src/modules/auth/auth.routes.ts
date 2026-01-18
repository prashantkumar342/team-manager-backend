import { Router } from 'express';
import { syncUser } from './auth.controller';
import { verifyFirebaseToken } from '@/middlewares/firebaseAuth.middleware';

const router = Router();

router.post('/sync-user', verifyFirebaseToken, syncUser);

export default router;

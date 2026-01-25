import { Router } from 'express';
import { assistantController } from './assistant.controller';
import { verifyFirebaseToken } from '@/middlewares/firebaseAuth.middleware';

const router = Router();

router.post('/chat', verifyFirebaseToken, assistantController);

export default router;

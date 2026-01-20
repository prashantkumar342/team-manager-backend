import { Router } from 'express';
import welcomeController from './welcome.controller';
const router = Router();

router.post('/welcome', welcomeController.welcome);

export default router;

import { Router } from 'express';
import welcomeController from './welcome.controller';
const router = Router();

router.get('/', welcomeController.welcome);

export default router;

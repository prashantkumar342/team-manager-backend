import { Router } from 'express';
import userController from './user.controller';

const router = Router();

router.post('/add-member', userController.addMember);

export default router;

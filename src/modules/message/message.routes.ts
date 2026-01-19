import { Router } from 'express';
import messageController from './message.controller';
import { verifyTeamMember } from '@/middlewares/verifyTeamMember.middleware';

const router = Router();

router.post('/send', verifyTeamMember, messageController.sendMessage);

router.get('/get-messages', verifyTeamMember, messageController.getMessages);

export default router;

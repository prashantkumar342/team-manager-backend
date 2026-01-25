import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/user/user.routes';
import teamRoutes from '@/modules/team/team.routes';
import projectRoutes from '@/modules/project/project.routes';
import taskRoutes from '@/modules/task/task.routes';
import messageRoutes from '@/modules/message/message.routes';
import welcomeRoutes from '@/modules/welcome/welcome.routes';
import assistantRoutes from '@/modules/ai-assistant/assistant.routes';

const router = Router();

router.use('/welcome', welcomeRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/team', teamRoutes);
router.use('/project', projectRoutes);
router.use('/task', taskRoutes);
router.use('/message', messageRoutes);
router.use('/assistant', assistantRoutes);

export default router;

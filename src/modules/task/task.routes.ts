import { Router } from 'express';
import { verifyFirebaseToken } from '@/middlewares/firebaseAuth.middleware';
import { verifyTeamAdminOrManager } from '@/middlewares/verifyTeamAdminOrManager';
import taskController from './task.controller';
import { verifyTeamMember } from '@/middlewares/verifyTeamMember.middleware';

const router = Router();
router.get('/tasks', verifyTeamMember, verifyFirebaseToken, taskController.getTasks);
router.post('/create', verifyTeamAdminOrManager, taskController.createTask);
router.put('/update/:id', verifyTeamAdminOrManager, taskController.updateTask);
router.delete('/delete/:id', verifyTeamAdminOrManager, taskController.deleteTask);

export default router;

import { Router } from 'express';
import { verifyFirebaseToken } from '@/middlewares/firebaseAuth.middleware';
import { verifyTeamAdmin } from '@/middlewares/adminAuth.middleware';
import projectController from './project.controller';
import { verifyTeamAdminOrManager } from '@/middlewares/verifyTeamAdminOrManager';
import { verifyTeamMember } from '@/middlewares/verifyTeamMember.middleware';

const router = Router();

router.get('/projects', verifyTeamMember, verifyFirebaseToken, projectController.getProjects);
router.post('/create', verifyTeamMember, verifyTeamAdminOrManager, projectController.createProject);
router.put('/update/:id', verifyTeamMember, verifyTeamAdminOrManager, projectController.updateProject);
router.delete('/delete/:id', verifyTeamMember, verifyTeamAdmin, projectController.deleteProject);

export default router;

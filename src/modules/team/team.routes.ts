import { Router } from 'express';
import { verifyFirebaseToken } from '@/middlewares/firebaseAuth.middleware';
import teamController from './team.controller';
import { verifyTeamAdmin } from '@/middlewares/adminAuth.middleware';

const router = Router();

router.get('/get-teams', verifyFirebaseToken, teamController.getTeams);
router.get('/get-team/:id', verifyFirebaseToken, teamController.getTeamById);
router.delete('/delete', verifyTeamAdmin, teamController.deleteTeam);
router.post('/create-team', verifyFirebaseToken, teamController.createTeam);
router.post('/toggle-add-member/:teamId', verifyTeamAdmin, teamController.toggleAddMember);
router.post('/create-manager/:teamId', verifyTeamAdmin, teamController.createManager);

export default router;

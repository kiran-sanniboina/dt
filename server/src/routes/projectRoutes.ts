import { Router } from 'express';
import {
  getPublicProjects,
  getProjectById,
  getMyTeamProject,
  submitProject,
} from '../controllers/projectController';
import { verifyToken, isTeamLead } from '../middleware/auth';

const router = Router();

// Public discovery
router.get('/public', getPublicProjects);
router.get('/:id', getProjectById);

// Team Lead project upload and review
router.get('/team/me', verifyToken, isTeamLead, getMyTeamProject);
router.post('/', verifyToken, isTeamLead, submitProject);

export default router;

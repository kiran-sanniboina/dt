import { Router } from 'express';
import {
  getUnratedProjects,
  getRatedProjects,
  submitRating,
  getRatingByProjectId,
} from '../controllers/ratingController';
import { verifyToken, isTeacher } from '../middleware/auth';

const router = Router();

// Evaluation queues (Teacher only)
router.get('/unrated', verifyToken, isTeacher, getUnratedProjects);
router.get('/rated', verifyToken, isTeacher, getRatedProjects);
router.post('/', verifyToken, isTeacher, submitRating);

// Rating details
router.get('/project/:projectId', getRatingByProjectId);

export default router;

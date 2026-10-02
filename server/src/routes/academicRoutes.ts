import { Router } from 'express';
import {
  getYears,
  createYear,
  deleteYear,
  getSections,
  createSection,
  deleteSection,
  getTeams,
  createTeam,
  deleteTeam,
  getMailStatus,
  sendTestEmail,
} from '../controllers/academicController';
import { verifyToken, isTeacher, validateInstitutionalDomain } from '../middleware/auth';

const router = Router();

// Mail status & test routes
router.get('/mail-status', getMailStatus);
router.post('/test-mail', sendTestEmail);

// Academic Year routes
router.get('/years', getYears);
router.post('/years', verifyToken, isTeacher, createYear);
router.delete('/years/:id', verifyToken, isTeacher, deleteYear);

// Section routes
router.get('/sections', getSections);
router.post('/sections', verifyToken, isTeacher, createSection);
router.delete('/sections/:id', verifyToken, isTeacher, deleteSection);

// Team routes
router.get('/teams', getTeams);
router.post('/teams', verifyToken, isTeacher, validateInstitutionalDomain, createTeam);
router.delete('/teams/:id', verifyToken, isTeacher, deleteTeam);

export default router;

import { Router } from 'express';
import { teacherLogin, teamLeadLogin, getMe, getRecentMailLogs } from '../controllers/authController';
import { verifyToken, validateInstitutionalDomain } from '../middleware/auth';

const router = Router();

router.post('/teacher/login', validateInstitutionalDomain, teacherLogin);
router.post('/teamlead/login', validateInstitutionalDomain, teamLeadLogin);
router.get('/me', verifyToken, getMe);
router.get('/mail-logs', getRecentMailLogs);

export default router;

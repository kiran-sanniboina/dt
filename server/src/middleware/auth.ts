import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: 'TEACHER' | 'ADMIN' | 'TEAM_LEAD';
  name: string;
  teamId?: string;
  sectionId?: string;
  yearId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'super_secret_rgukt_jwt_key_2026_secure';

  try {
    const decoded = jwt.verify(token, secret) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const isTeacher = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN')) {
    res.status(403).json({ success: false, message: 'Access denied: Teacher privileges required.' });
    return;
  }
  next();
};

export const isTeamLead = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'TEAM_LEAD') {
    res.status(403).json({ success: false, message: 'Access denied: Team Lead privileges required.' });
    return;
  }
  next();
};

export const validateInstitutionalDomain = (req: Request, res: Response, next: NextFunction): void => {
  const email = req.body.email || req.body.teamLeadEmail;
  const domain = process.env.COLLEGE_DOMAIN || '@rguktsklm.ac.in';

  if (!email || typeof email !== 'string') {
    res.status(400).json({ success: false, message: 'Official college email is required.' });
    return;
  }

  const normalized = email.trim().toLowerCase();
  if (!normalized.endsWith(domain.toLowerCase())) {
    res.status(400).json({
      success: false,
      message: `Invalid domain. Authentication and team creation strictly requires ${domain} emails.`,
    });
    return;
  }

  next();
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { inMemoryMailLog } from '../config/mailer';

export const teacherLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials or user not registered.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'super_secret_rgukt_jwt_key_2026_secure';
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Teacher authenticated successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('[AuthController] Teacher login error:', error);
    res.status(500).json({ success: false, message: 'Server error during teacher authentication.' });
  }
};

export const teamLeadLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'College email and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const team = await Team.findOne({ teamLeadEmail: normalizedEmail })
      .populate('yearId', 'year')
      .populate('sectionId', 'name');

    if (!team) {
      res.status(404).json({
        success: false,
        message: 'No team registered with this Team Lead email. Contact your teacher.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid password. Check credentials sent to your email.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'super_secret_rgukt_jwt_key_2026_secure';
    const token = jwt.sign(
      {
        id: team._id.toString(),
        email: team.teamLeadEmail,
        name: team.teamLeadName,
        role: 'TEAM_LEAD',
        teamId: team._id.toString(),
        sectionId: team.sectionId._id ? team.sectionId._id.toString() : team.sectionId.toString(),
        yearId: team.yearId._id ? team.yearId._id.toString() : team.yearId.toString(),
      },
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Team Lead authenticated successfully.',
      token,
      team: {
        id: team._id,
        teamName: team.name,
        teamLeadName: team.teamLeadName,
        teamLeadEmail: team.teamLeadEmail,
        members: team.members,
        year: team.yearId,
        section: team.sectionId,
        isSubmitted: team.isSubmitted,
      },
    });
  } catch (error: any) {
    console.error('[AuthController] Team Lead login error:', error);
    res.status(500).json({ success: false, message: 'Server error during Team Lead authentication.' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.role === 'TEACHER' || req.user.role === 'ADMIN') {
      const user = await User.findById(req.user.id).select('-password');
      res.json({ success: true, user });
      return;
    }

    if (req.user.role === 'TEAM_LEAD') {
      const team = await Team.findById(req.user.id)
        .select('-password')
        .populate('yearId', 'year')
        .populate('sectionId', 'name');
      res.json({ success: true, team });
      return;
    }

    res.json({ success: true, user: req.user });
  } catch (error: any) {
    console.error('[AuthController] getMe error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving profile.' });
  }
};

export const getRecentMailLogs = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, logs: inMemoryMailLog });
};

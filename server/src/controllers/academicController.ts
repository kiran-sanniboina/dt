import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Year } from '../models/Year';
import { Section } from '../models/Section';
import { Team } from '../models/Team';
import { Project } from '../models/Project';
import { Rating } from '../models/Rating';
import { sendCredentialsEmail } from '../config/mailer';

// Helper to generate secure random password
const generateSecurePassword = (length: number = 10): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    password += chars[randomIndex];
  }
  return password;
};

// ======================== YEARS ========================
export const getYears = async (_req: Request, res: Response): Promise<void> => {
  try {
    const years = await Year.find().sort({ year: -1 });

    const yearsWithCounts = await Promise.all(
      years.map(async (y) => {
        const sectionCount = await Section.countDocuments({ yearId: y._id });
        const teamCount = await Team.countDocuments({ yearId: y._id });
        const projectCount = await Project.countDocuments({ yearId: y._id });
        return {
          ...y.toObject(),
          sectionCount,
          teamCount,
          projectCount,
        };
      })
    );

    res.json({ success: true, years: yearsWithCounts });
  } catch (error: any) {
    console.error('[AcademicController] getYears error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch academic years.' });
  }
};

export const createYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year } = req.body;
    if (!year || typeof year !== 'string') {
      res.status(400).json({ success: false, message: 'Academic Year is required (e.g. "2026").' });
      return;
    }

    const trimmedYear = year.trim();
    const existing = await Year.findOne({ year: trimmedYear });
    if (existing) {
      res.status(400).json({ success: false, message: `Academic Year ${trimmedYear} already exists.` });
      return;
    }

    const newYear = await Year.create({ year: trimmedYear });
    res.status(201).json({ success: true, message: 'Academic Year created successfully.', year: newYear });
  } catch (error: any) {
    console.error('[AcademicController] createYear error:', error);
    res.status(500).json({ success: false, message: 'Failed to create academic year.' });
  }
};

export const deleteYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const year = await Year.findById(id);
    if (!year) {
      res.status(404).json({ success: false, message: 'Academic Year not found.' });
      return;
    }

    // Cascading deletion
    const sections = await Section.find({ yearId: id });
    const sectionIds = sections.map((s) => s._id);

    const teams = await Team.find({ yearId: id });
    const teamIds = teams.map((t) => t._id);

    const projects = await Project.find({ teamId: { $in: teamIds } });
    const projectIds = projects.map((p) => p._id);

    // Delete ratings
    await Rating.deleteMany({ projectId: { $in: projectIds } });
    // Delete projects
    await Project.deleteMany({ _id: { $in: projectIds } });
    // Delete teams
    await Team.deleteMany({ _id: { $in: teamIds } });
    // Delete sections
    await Section.deleteMany({ _id: { $in: sectionIds } });
    // Delete year
    await Year.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Academic Year ${year.year} and all linked sections (${sections.length}), teams (${teams.length}), and submissions (${projects.length}) have been deleted.`,
    });
  } catch (error: any) {
    console.error('[AcademicController] deleteYear error:', error);
    res.status(500).json({ success: false, message: 'Failed to cascade delete academic year.' });
  }
};

// ======================== SECTIONS ========================
export const getSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const { yearId } = req.query;
    const filter = yearId ? { yearId } : {};
    const sections = await Section.find(filter).populate('yearId', 'year').sort({ name: 1 });

    const sectionsWithCounts = await Promise.all(
      sections.map(async (s) => {
        const teamCount = await Team.countDocuments({ sectionId: s._id });
        const projectCount = await Project.countDocuments({ sectionId: s._id });
        return {
          ...s.toObject(),
          teamCount,
          projectCount,
        };
      })
    );

    res.json({ success: true, sections: sectionsWithCounts });
  } catch (error: any) {
    console.error('[AcademicController] getSections error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sections.' });
  }
};

export const createSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { yearId, name } = req.body;
    if (!yearId || !name) {
      res.status(400).json({ success: false, message: 'Year ID and Section Name are required.' });
      return;
    }

    const year = await Year.findById(yearId);
    if (!year) {
      res.status(404).json({ success: false, message: 'Academic Year does not exist.' });
      return;
    }

    const trimmedName = name.trim().toUpperCase();
    const existing = await Section.findOne({ yearId, name: trimmedName });
    if (existing) {
      res.status(400).json({ success: false, message: `Section "${trimmedName}" already exists for this Year.` });
      return;
    }

    const section = await Section.create({ yearId, name: trimmedName });
    const populated = await Section.findById(section._id).populate('yearId', 'year');

    res.status(201).json({ success: true, message: 'Section created successfully.', section: populated });
  } catch (error: any) {
    console.error('[AcademicController] createSection error:', error);
    res.status(500).json({ success: false, message: 'Failed to create section.' });
  }
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id);
    if (!section) {
      res.status(404).json({ success: false, message: 'Section not found.' });
      return;
    }

    const teams = await Team.find({ sectionId: id });
    const teamIds = teams.map((t) => t._id);

    const projects = await Project.find({ teamId: { $in: teamIds } });
    const projectIds = projects.map((p) => p._id);

    // Cascading deletion
    await Rating.deleteMany({ projectId: { $in: projectIds } });
    await Project.deleteMany({ _id: { $in: projectIds } });
    await Team.deleteMany({ _id: { $in: teamIds } });
    await Section.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Section "${section.name}" and all linked teams (${teams.length}) and projects (${projects.length}) have been deleted.`,
    });
  } catch (error: any) {
    console.error('[AcademicController] deleteSection error:', error);
    res.status(500).json({ success: false, message: 'Failed to cascade delete section.' });
  }
};

// ======================== TEAMS ========================
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { yearId, sectionId } = req.query;
    const filter: any = {};
    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;

    const teams = await Team.find(filter)
      .select('-password')
      .populate('yearId', 'year')
      .populate('sectionId', 'name')
      .sort({ name: 1 });

    res.json({ success: true, teams });
  } catch (error: any) {
    console.error('[AcademicController] getTeams error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch teams.' });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { yearId, sectionId, name, members, teamLeadName, teamLeadEmail } = req.body;

    if (!yearId || !sectionId || !name || !teamLeadName || !teamLeadEmail) {
      res.status(400).json({ success: false, message: 'All fields including Team Lead Email are mandatory.' });
      return;
    }

    const domain = process.env.COLLEGE_DOMAIN || '@rguktsklm.ac.in';
    const normalizedEmail = teamLeadEmail.trim().toLowerCase();
    if (!normalizedEmail.endsWith(domain.toLowerCase())) {
      res.status(400).json({
        success: false,
        message: `Team Lead Email must belong to the college domain (${domain}).`,
      });
      return;
    }

    const year = await Year.findById(yearId);
    const section = await Section.findById(sectionId);
    if (!year || !section) {
      res.status(404).json({ success: false, message: 'Specified Year or Section not found.' });
      return;
    }

    const existingEmail = await Team.findOne({ teamLeadEmail: normalizedEmail });
    if (existingEmail) {
      res.status(400).json({
        success: false,
        message: `A team lead with email "${normalizedEmail}" is already registered.`,
      });
      return;
    }

    const trimmedName = name.trim();
    const existingTeam = await Team.findOne({ sectionId, name: trimmedName });
    if (existingTeam) {
      res.status(400).json({
        success: false,
        message: `Team "${trimmedName}" already exists in section "${section.name}".`,
      });
      return;
    }

    // Process members list
    let memberList: string[] = [];
    if (Array.isArray(members)) {
      memberList = members.map((m: string) => m.trim()).filter(Boolean);
    } else if (typeof members === 'string') {
      memberList = members
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
    }

    // Make sure team lead is included in members if not already
    if (!memberList.includes(teamLeadName.trim())) {
      memberList.unshift(teamLeadName.trim());
    }

    // Generate secure password
    const rawPassword = generateSecurePassword(10);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const team = await Team.create({
      yearId,
      sectionId,
      name: trimmedName,
      members: memberList,
      teamLeadName: teamLeadName.trim(),
      teamLeadEmail: normalizedEmail,
      password: hashedPassword,
      isSubmitted: false,
    });

    // Send credentials email
    const mailResult = await sendCredentialsEmail({
      toEmail: normalizedEmail,
      teamLeadName: teamLeadName.trim(),
      teamName: trimmedName,
      year: year.year,
      section: section.name,
      temporaryPassword: rawPassword,
    });

    const populatedTeam = await Team.findById(team._id)
      .select('-password')
      .populate('yearId', 'year')
      .populate('sectionId', 'name');

    let responseMessage = `Team created successfully!`;
    if (mailResult.mode === 'SMTP_REAL' && mailResult.sent) {
      responseMessage = `Team created successfully! Credentials dispatched to ${normalizedEmail} via SMTP.`;
    } else if (mailResult.mode === 'SMTP_REAL' && !mailResult.sent) {
      responseMessage = `Team created! However, SMTP email delivery failed: ${mailResult.error}. Please share the temporary password manually.`;
    } else {
      responseMessage = `Team created! (Note: Real SMTP is not configured in server/.env, so the email was recorded in Notification Logs. Use the generated password below or configure SMTP in server/.env).`;
    }

    res.status(201).json({
      success: true,
      message: responseMessage,
      team: populatedTeam,
      mailResult,
      generatedPasswordForTeacherRecord: rawPassword,
    });
  } catch (error: any) {
    console.error('[AcademicController] createTeam error:', error);
    res.status(500).json({ success: false, message: 'Failed to create team.' });
  }
};

export const getMailStatus = async (_req: Request, res: Response): Promise<void> => {
  const user = process.env.SMTP_USER?.trim() || '';
  const pass = process.env.SMTP_PASS?.trim() || '';
  const configured = Boolean(user && pass);
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT || '587';
  const maskedUser = user
    ? user.replace(/^(.)(.*)(@.*)$/, (_m, p1, p2, p3) => p1 + '*'.repeat(Math.max(1, p2.length)) + p3)
    : null;

  res.json({
    success: true,
    configured,
    mode: configured ? 'SMTP_REAL' : 'DEVELOPMENT_SIMULATED',
    host,
    port,
    user: maskedUser,
  });
};

export const sendTestEmail = async (req: Request, res: Response): Promise<void> => {
  const targetEmail = req.body.toEmail || process.env.SMTP_USER;
  if (!targetEmail) {
    res.status(400).json({ success: false, message: 'Target recipient email required.' });
    return;
  }

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) {
    res.status(400).json({ success: false, message: 'SMTP credentials not configured in server/.env.' });
    return;
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    const from = process.env.SMTP_FROM || `"College Project Hub" <${user}>`;
    const info = await transporter.sendMail({
      from,
      to: targetEmail,
      subject: '🎓 College Project Hub - Live SMTP Verification Test',
      text: `Hello!\n\nThis test email confirms that your live SMTP server configuration is working properly.\n\nTimestamp: ${new Date().toLocaleString()}\nPlatform: College Project Hub (RGUKT Srikakulam)\n\nCredential notifications and project evaluations will now be delivered directly to inboxes.`,
    });

    res.json({
      success: true,
      message: `Test email successfully dispatched to ${targetEmail}! (MessageId: ${info.messageId})`,
    });
  } catch (err: any) {
    console.error('[AcademicController] sendTestEmail error:', err);
    res.status(500).json({ success: false, message: `Failed to deliver test email: ${err.message}` });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) {
      res.status(404).json({ success: false, message: 'Team not found.' });
      return;
    }

    const project = await Project.findOne({ teamId: id });
    if (project) {
      await Rating.deleteMany({ projectId: project._id });
      await Project.findByIdAndDelete(project._id);
    }

    await Team.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Team "${team.name}" and any associated project submissions have been deleted.`,
    });
  } catch (error: any) {
    console.error('[AcademicController] deleteTeam error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete team.' });
  }
};

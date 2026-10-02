import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { Team } from '../models/Team';
import { Rating } from '../models/Rating';

// ======================== PUBLIC PROJECTS ========================
export const getPublicProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { yearId, sectionId, search } = req.query;
    const filter: any = {};

    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;

    if (search && typeof search === 'string') {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const projects = await Project.find(filter)
      .populate('yearId', 'year')
      .populate('sectionId', 'name')
      .populate({
        path: 'teamId',
        select: 'name members teamLeadName', // Conceal email from public
      })
      .populate({
        path: 'ratingId',
        select: 'totalScore evaluatedAt',
      })
      .sort({ submittedAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error: any) {
    console.error('[ProjectController] getPublicProjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch public projects.' });
  }
};

// ======================== PROJECT BY ID ========================
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('yearId', 'year')
      .populate('sectionId', 'name')
      .populate('teamId', 'name members teamLeadName teamLeadEmail isSubmitted')
      .populate('ratingId');

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('[ProjectController] getProjectById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project details.' });
  }
};

// ======================== TEAM LEAD: MY PROJECT ========================
export const getMyTeamProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamId = req.user?.teamId || req.user?.id;
    if (!teamId) {
      res.status(400).json({ success: false, message: 'No team context associated with this user.' });
      return;
    }

    const team = await Team.findById(teamId)
      .select('-password')
      .populate('yearId', 'year')
      .populate('sectionId', 'name');

    if (!team) {
      res.status(404).json({ success: false, message: 'Team profile not found.' });
      return;
    }

    const project = await Project.findOne({ teamId })
      .populate('ratingId')
      .populate('yearId', 'year')
      .populate('sectionId', 'name');

    res.json({
      success: true,
      team,
      project: project || null,
      isSubmitted: team.isSubmitted || !!project,
    });
  } catch (error: any) {
    console.error('[ProjectController] getMyTeamProject error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch team project status.' });
  }
};

// ======================== TEAM LEAD: SUBMIT PROJECT ========================
export const submitProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamId = req.user?.teamId || req.user?.id;
    const { title, description, liveUrl } = req.body;

    if (!teamId) {
      res.status(400).json({ success: false, message: 'Team Lead authentication required.' });
      return;
    }

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ success: false, message: 'Team not found.' });
      return;
    }

    // STRICT ONE-TIME SUBMISSION CONSTRAINT
    const existing = await Project.findOne({ teamId });
    if (team.isSubmitted || existing) {
      res.status(400).json({
        success: false,
        message: 'You have already uploaded your project. A team can submit only one project.',
        project: existing,
      });
      return;
    }

    if (!title || !description || !liveUrl) {
      res.status(400).json({
        success: false,
        message: 'Project title, description, and live project URL are mandatory.',
      });
      return;
    }

    // Live URL validation
    let formattedUrl = liveUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newProject = await Project.create({
      teamId: team._id,
      yearId: team.yearId,
      sectionId: team.sectionId,
      title: title.trim(),
      description: description.trim(),
      liveUrl: formattedUrl,
      status: 'SUBMITTED',
    });

    team.isSubmitted = true;
    await team.save();

    const populatedProject = await Project.findById(newProject._id)
      .populate('yearId', 'year')
      .populate('sectionId', 'name')
      .populate('teamId', 'name members teamLeadName teamLeadEmail');

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully! Your submission is now recorded.',
      project: populatedProject,
    });
  } catch (error: any) {
    console.error('[ProjectController] submitProject error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit project.' });
  }
};

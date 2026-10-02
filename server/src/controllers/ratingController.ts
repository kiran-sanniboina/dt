import { Request, Response } from 'express';
import { Rating } from '../models/Rating';
import { Project } from '../models/Project';
import { Team } from '../models/Team';
import { sendEvaluationEmail } from '../config/mailer';

// ======================== GET UNRATED PROJECTS ========================
export const getUnratedProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({
      $or: [{ status: { $ne: 'RATED' } }, { ratingId: null }],
    })
      .populate('yearId', 'year')
      .populate('sectionId', 'name')
      .populate('teamId', 'name members teamLeadName teamLeadEmail')
      .sort({ submittedAt: 1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error: any) {
    console.error('[RatingController] getUnratedProjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unrated projects.' });
  }
};

// ======================== GET RATED PROJECTS ========================
export const getRatedProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({
      status: 'RATED',
      ratingId: { $ne: null },
    })
      .populate('yearId', 'year')
      .populate('sectionId', 'name')
      .populate('teamId', 'name members teamLeadName teamLeadEmail')
      .populate({
        path: 'ratingId',
        populate: { path: 'teacherId', select: 'name email' },
      })
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error: any) {
    console.error('[RatingController] getRatedProjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rated projects.' });
  }
};

// ======================== SUBMIT RATING ========================
export const submitRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    const teacherName = req.user?.name || 'Faculty Evaluator';
    const { projectId, criteria, feedback } = req.body;

    if (!projectId || !criteria || !feedback) {
      res.status(400).json({
        success: false,
        message: 'Project ID, criteria scores, and teacher feedback remarks are required.',
      });
      return;
    }

    const project = await Project.findById(projectId).populate('teamId');
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    const team = await Team.findById(project.teamId);
    if (!team) {
      res.status(404).json({ success: false, message: 'Associated team not found.' });
      return;
    }

    const {
      technicalApproach = 0,
      uiUxDesign = 0,
      designThinking = 0,
      functionality = 0,
      innovation = 0,
      projectQuality = 0,
      problemSolving = 0,
    } = criteria;

    // Validate boundaries
    if (
      technicalApproach < 0 || technicalApproach > 15 ||
      uiUxDesign < 0 || uiUxDesign > 15 ||
      designThinking < 0 || designThinking > 10 ||
      functionality < 0 || functionality > 20 ||
      innovation < 0 || innovation > 15 ||
      projectQuality < 0 || projectQuality > 10 ||
      problemSolving < 0 || problemSolving > 15
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid score ranges. Please verify individual rubric limits (totaling 100).',
      });
      return;
    }

    const totalScore =
      Number(technicalApproach) +
      Number(uiUxDesign) +
      Number(designThinking) +
      Number(functionality) +
      Number(innovation) +
      Number(projectQuality) +
      Number(problemSolving);

    // Create or update rating
    let rating = await Rating.findOne({ projectId });
    if (rating) {
      rating.teacherId = teacherId as any;
      rating.criteria = {
        technicalApproach,
        uiUxDesign,
        designThinking,
        functionality,
        innovation,
        projectQuality,
        problemSolving,
      };
      rating.totalScore = totalScore;
      rating.feedback = feedback.trim();
      rating.evaluatedAt = new Date();
      await rating.save();
    } else {
      rating = await Rating.create({
        projectId: project._id,
        teacherId,
        criteria: {
          technicalApproach,
          uiUxDesign,
          designThinking,
          functionality,
          innovation,
          projectQuality,
          problemSolving,
        },
        totalScore,
        feedback: feedback.trim(),
        evaluatedAt: new Date(),
      });
    }

    project.status = 'RATED';
    project.ratingId = rating._id as any;
    await project.save();

    // Trigger evaluation email to Team Lead
    const mailResult = await sendEvaluationEmail({
      toEmail: team.teamLeadEmail,
      teamLeadName: team.teamLeadName,
      projectName: project.title,
      totalScore,
      criteriaScores: rating.criteria,
      feedback: rating.feedback,
      evaluatorName: teacherName,
    });

    let responseMessage = 'Project evaluation saved!';
    if (mailResult.mode === 'SMTP_REAL' && mailResult.sent) {
      responseMessage = `Project evaluation saved! Official report emailed to ${team.teamLeadEmail} via SMTP.`;
    } else if (mailResult.mode === 'SMTP_REAL' && !mailResult.sent) {
      responseMessage = `Project evaluation saved! However, SMTP email delivery failed: ${mailResult.error}.`;
    } else {
      responseMessage = `Project evaluation saved! (Note: Real SMTP is not configured in server/.env, so results were logged to Notification Logs instead of an external inbox).`;
    }

    res.json({
      success: true,
      message: responseMessage,
      mailResult,
      rating,
      project,
    });
  } catch (error: any) {
    console.error('[RatingController] submitRating error:', error);
    res.status(500).json({ success: false, message: 'Failed to record project evaluation.' });
  }
};

// ======================== GET RATING DETAILS ========================
export const getRatingByProjectId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const rating = await Rating.findOne({ projectId }).populate('teacherId', 'name email');

    if (!rating) {
      res.status(404).json({ success: false, message: 'No evaluation found for this project.' });
      return;
    }

    res.json({ success: true, rating });
  } catch (error: any) {
    console.error('[RatingController] getRatingByProjectId error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rating.' });
  }
};

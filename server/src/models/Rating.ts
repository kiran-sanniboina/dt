import mongoose, { Document, Schema } from 'mongoose';

export interface IRatingCriteria {
  technicalApproach: number; // 0-15
  uiUxDesign: number;        // 0-15
  designThinking: number;    // 0-10
  functionality: number;     // 0-20
  innovation: number;        // 0-15
  projectQuality: number;    // 0-10
  problemSolving: number;    // 0-15
}

export interface IRating extends Document {
  projectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  criteria: IRatingCriteria;
  totalScore: number;
  feedback: string;
  evaluatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    criteria: {
      technicalApproach: { type: Number, required: true, min: 0, max: 15 },
      uiUxDesign: { type: Number, required: true, min: 0, max: 15 },
      designThinking: { type: Number, required: true, min: 0, max: 10 },
      functionality: { type: Number, required: true, min: 0, max: 20 },
      innovation: { type: Number, required: true, min: 0, max: 15 },
      projectQuality: { type: Number, required: true, min: 0, max: 10 },
      problemSolving: { type: Number, required: true, min: 0, max: 15 },
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Rating = mongoose.model<IRating>('Rating', ratingSchema);

import mongoose, { Document, Schema } from 'mongoose';

export type ProjectStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'RATED';

export interface IProject extends Document {
  teamId: mongoose.Types.ObjectId;
  yearId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  liveUrl: string;
  status: ProjectStatus;
  ratingId?: mongoose.Types.ObjectId;
  submittedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      unique: true,
    },
    yearId: {
      type: Schema.Types.ObjectId,
      ref: 'Year',
      required: true,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    liveUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'RATED'],
      default: 'SUBMITTED',
    },
    ratingId: {
      type: Schema.Types.ObjectId,
      ref: 'Rating',
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);

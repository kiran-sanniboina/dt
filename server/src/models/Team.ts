import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  yearId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  name: string;
  members: string[];
  teamLeadName: string;
  teamLeadEmail: string;
  password: string;
  isSubmitted: boolean;
  createdAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    members: {
      type: [String],
      required: true,
      default: [],
    },
    teamLeadName: {
      type: String,
      required: true,
      trim: true,
    },
    teamLeadEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => v.endsWith('@rguktsklm.ac.in'),
        message: 'Team lead email must belong to institutional domain (@rguktsklm.ac.in)',
      },
    },
    password: {
      type: String,
      required: true,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

teamSchema.index({ sectionId: 1, name: 1 }, { unique: true });

export const Team = mongoose.model<ITeam>('Team', teamSchema);

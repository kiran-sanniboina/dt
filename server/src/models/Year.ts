import mongoose, { Document, Schema } from 'mongoose';

export interface IYear extends Document {
  year: string;
  isActive: boolean;
  createdAt: Date;
}

const yearSchema = new Schema<IYear>(
  {
    year: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Year = mongoose.model<IYear>('Year', yearSchema);

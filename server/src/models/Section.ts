import mongoose, { Document, Schema } from 'mongoose';

export interface ISection extends Document {
  yearId: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
}

const sectionSchema = new Schema<ISection>(
  {
    yearId: {
      type: Schema.Types.ObjectId,
      ref: 'Year',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

sectionSchema.index({ yearId: 1, name: 1 }, { unique: true });

export const Section = mongoose.model<ISection>('Section', sectionSchema);

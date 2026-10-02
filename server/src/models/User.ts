import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'TEACHER' | 'ADMIN';
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => v.endsWith('@rguktsklm.ac.in'),
        message: 'Email must be a valid institutional domain (@rguktsklm.ac.in)',
      },
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['TEACHER', 'ADMIN'], default: 'TEACHER' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);

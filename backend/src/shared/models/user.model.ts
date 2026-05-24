import mongoose, { Document, Schema } from 'mongoose';

import bcrypt from 'bcryptjs';

import { UserRole } from '../../shared/types';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  isVerified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const jsonRet = ret as { password?: string; refreshToken?: string };
    delete jsonRet.password;
    delete jsonRet.refreshToken;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', userSchema);

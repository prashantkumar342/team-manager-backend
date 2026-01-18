import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  uid: string;
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  // role: UserRole;
  teamId?: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);

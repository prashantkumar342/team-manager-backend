import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export enum MemberRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export interface TeamMember {
  userId: Types.ObjectId;
  role: MemberRole;
  joinedAt: Date;
}

export interface ITeam {
  name: string;
  description?: string;
  members: TeamMember[];
  joinId: string;
  adminId: Types.ObjectId;
  managerId?: Types.ObjectId;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    joinId: {
      type: String,
      required: false,
      trim: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: MemberRole,
          default: MemberRole.MEMBER,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true },
);

export const Team = model<ITeam>('Team', teamSchema);

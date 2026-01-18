import { Schema, model, Types } from 'mongoose';

export interface IProject {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  teamId: Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Project = model<IProject>('Project', projectSchema);

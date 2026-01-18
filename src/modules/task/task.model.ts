import { Schema, model, Types } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export interface ITask {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: Types.ObjectId;
  assignedTo?: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = model<ITask>('Task', taskSchema);

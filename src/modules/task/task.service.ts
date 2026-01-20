import { ApiError } from '@/utils/apiError';
import { Task, TaskStatus } from './task.model';
import { Types } from 'mongoose';

const taskService = {
  // ================= get tasks =================
  async getTasks(projectId: string) {
    return Task.find({ projectId });
  },

  // ================= create task =================
  async createTask({
    title,
    description,
    teamId,
    projectId,
    assignedTo,
  }: {
    title: string;
    description?: string;
    teamId: string;
    projectId: string;
    assignedTo?: string;
  }) {
    const task = await Task.create({
      title,
      description,
      teamId: new Types.ObjectId(teamId),
      projectId: new Types.ObjectId(projectId),
      assignedTo: assignedTo ? new Types.ObjectId(assignedTo) : undefined,
    });

    return task;
  },

  // ================= update task =================
  async updateTask({ taskId, status, assignedTo }: { taskId: string; status?: TaskStatus; assignedTo?: string }) {
    const update: Record<string, any> = {};

    if (status) update.status = status;
    if (assignedTo) update.assignedTo = new Types.ObjectId(assignedTo);

    const task = await Task.findByIdAndUpdate(taskId, update, {
      new: true,
    });

    if (!task) throw new ApiError(404, 'Task not found');
    return task;
  },

  // ================= delete task =================
  async deleteTask(taskId: string) {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) throw new ApiError(404, 'Task not found');
    return task;
  },
};

export default taskService;

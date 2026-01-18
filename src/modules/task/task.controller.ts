import { Request, Response } from 'express';
import taskService from './task.service';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { TaskStatus } from './task.model';

const taskController = {
  // ================= get tasks =================
  async getTasks(req: Request, res: Response) {
    try {
      const { projectId } = req.query;
      if (!projectId) throw new ApiError(400, 'projectId is required');

      const tasks = await taskService.getTasks(projectId as string);

      res.status(200).json(new ApiResponse('Tasks fetched successfully', { tasks }));
    } catch (error) {
      throw error;
    }
  },

  // ================= create task =================
  async createTask(req: Request, res: Response) {
    try {
      const { title, description, projectId, assignedTo } = req.body;

      if (!title || !projectId) throw new ApiError(400, 'title and projectId are required');

      const task = await taskService.createTask({
        title,
        description,
        projectId,
        assignedTo,
      });

      res.status(201).json(new ApiResponse('Task created successfully', { task }));
    } catch (error) {
      throw error;
    }
  },

  // ================= update task =================
  async updateTask(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, assignedTo } = req.body;

      if (!status && !assignedTo) throw new ApiError(400, 'status or assignedTo must be provided');

      const task = await taskService.updateTask({
        taskId: id,
        status,
        assignedTo,
      });

      res.status(200).json(new ApiResponse('Task updated successfully', { task }));
    } catch (error) {
      throw error;
    }
  },

  // ================= delete task =================
  async deleteTask(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      await taskService.deleteTask(id);

      res.status(200).json(new ApiResponse('Task deleted successfully'));
    } catch (error) {
      throw error;
    }
  },
};

export default taskController;

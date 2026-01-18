import { Request, Response } from 'express';
import projectService from './project.service';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';

const projectController = {
  // ================= get projects =================
  async getProjects(req: Request, res: Response) {
    try {
      const { teamId } = req.query;
      if (!teamId) throw new ApiError(400, 'teamId is required');

      const projects = await projectService.getProjects(teamId as string);

      res.status(200).json(new ApiResponse('Projects fetched successfully', { projects }));
    } catch (error) {
      throw error;
    }
  },

  // ================= create project =================
  async createProject(req: Request, res: Response) {
    try {
      const { name, description, teamId } = req.body;
      if (!name || !teamId) throw new ApiError(400, 'name and teamId are required');

      const project = await projectService.createProject({
        name,
        description,
        teamId,
      });

      res.status(201).json(new ApiResponse('Project created successfully', { project }));
    } catch (error) {
      throw error;
    }
  },

  // ================= update project =================
  async updateProject(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, description } = req.body;

      const project = await projectService.updateProject({
        projectId: id,
        name,
        description,
      });

      res.status(200).json(new ApiResponse('Project updated successfully', { project }));
    } catch (error) {
      throw error;
    }
  },

  // ================= delete project =================
  async deleteProject(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      await projectService.deleteProject(id);

      res.status(200).json(new ApiResponse('Project deleted successfully'));
    } catch (error) {
      throw error;
    }
  },
};

export default projectController;

import { ApiError } from '@/utils/apiError';
import { Project } from './project.model';

const projectService = {
  // ================= get projects =================
  async getProjects(teamId: string) {
    return Project.find({ teamId });
  },

  // ================= create project =================
  async createProject({ name, description, teamId }: { name: string; description?: string; teamId: string }) {
    const project = await Project.create({
      name,
      description,
      teamId,
    });

    return project;
  },

  // ================= update project =================
  async updateProject({ projectId, name, description }: { projectId: string; name?: string; description?: string }) {
    const project = await Project.findByIdAndUpdate(projectId, { name, description }, { new: true });

    if (!project) throw new ApiError(404, 'Project not found');
    return project;
  },

  // ================= delete project =================
  async deleteProject(projectId: string) {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) throw new ApiError(404, 'Project not found');
    return project;
  },
};

export default projectService;

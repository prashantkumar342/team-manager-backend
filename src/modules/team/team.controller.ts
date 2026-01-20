/// <reference path="../../types/express.d.ts" />
import { Request, Response } from 'express';
import teamService from './team.service';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { User } from '../user/user.model';
import { MemberRole } from './team.model';

const teamController = {
  async getTeams(req: Request, res: Response) {
    try {
      const uid = req.firebaseUser?.uid;
      if (!uid) throw new ApiError(401, 'User not authenticated');

      const offset = Number(req.query.offset) || 0;
      const limit = (Number(req.query.limit) || 10) + 1;

      const teams = await teamService.getTeams({ uid, offset, limit });

      res.status(200).json(
        new ApiResponse('Teams fetched successfully', {
          hasMore: teams.length > limit,
          teams,
        }),
      );
    } catch (error) {
      throw error;
    }
  },

  async getTeamById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const team = await teamService.getTeamById({ id });

      res.status(200).json(new ApiResponse('Team fetched successfully', { team }));
    } catch (error) {
      throw error;
    }
  },

  async createTeam(req: Request, res: Response) {
    try {
      const uid = req.firebaseUser?.uid;
      if (!uid) throw new ApiError(401, 'User not authenticated');

      const { name, description } = req.body;
      const user = await User.findOne({ uid });
      if (!user) throw new ApiError(404, 'User not found');

      const team = await teamService.createTeam({ name, description, user });

      res.status(201).json(new ApiResponse('Team created successfully', { team }));
    } catch (error) {
      throw error;
    }
  },

  async toggleAddMember(req: Request, res: Response) {
    try {
      const { teamId, uid } = req.body;
      if (!teamId || !uid) throw new ApiError(400, 'teamId and uid are required');

      const result = await teamService.toggleAddMember({ teamId, uid });

      res.status(200).json(new ApiResponse(result.message, { team: result.team }));
    } catch (error) {
      throw error;
    }
  },

  async createManager(req: Request, res: Response) {
    try {
      const { teamId, uid } = req.body;
      if (!teamId || !uid) throw new ApiError(400, 'teamId and uid are required');

      const team = await teamService.createManager({ teamId, uid });

      res.status(200).json(new ApiResponse('Manager assigned successfully', { team }));
    } catch (error) {
      throw error;
    }
  },

  async updateTeam(req: Request, res: Response) {
    try {
      const teamId = req.query.teamId as string;
      const { name, description } = req.body;

      if (!teamId) throw new ApiError(400, 'teamId is required');
      if (!name && !description) {
        throw new ApiError(400, 'Nothing to update');
      }

      const team = await teamService.updateTeam({
        teamId,
        name,
        description,
      });

      res.status(200).json(new ApiResponse('Team updated successfully', { team }));
    } catch (error) {
      throw error;
    }
  },

  async deleteTeam(req: Request, res: Response) {
    try {
      const teamId = req.query.teamId as string;
      if (!teamId) throw new ApiError(400, 'teamId is required');

      const result = await teamService.deleteTeam({ teamId });

      res.status(200).json(new ApiResponse(result.message));
    } catch (error) {
      throw error;
    }
  },

  async getTeamMembers(req: Request, res: Response) {
    try {
      const teamId = req.query.teamId as string;
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 10; // Removed the + 1

      if (!teamId) throw new ApiError(400, 'teamId is required');

      // Result now contains { members, hasMore, total }
      const result = await teamService.getTeamMembers({ teamId, offset, limit });

      res.status(200).json(new ApiResponse('Team members retrieved successfully', result));
    } catch (error) {
      throw error;
    }
  },

  async addMember(req: Request, res: Response) {
    const teamId = req.query.teamId as string;
    const { email } = req.body;

    const team = await teamService.addMember(teamId, email);
    res.status(200).json(new ApiResponse('Member added', team));
  },

  async removeMember(req: Request, res: Response) {
    const teamId = req.query.teamId as string;
    const { userId } = req.body;

    const team = await teamService.removeMember(teamId, userId);
    res.status(200).json(new ApiResponse('Member removed', team));
  },

  async updateMemberRole(req: Request, res: Response) {
    const teamId = req.query.teamId as string;
    const { userId, role } = req.body;

    if (!Object.values(MemberRole).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const team = await teamService.updateMemberRole(teamId, userId, role);

    res.status(200).json(new ApiResponse('Member role updated', team));
  },
};

export default teamController;

import { ApiError } from '@/utils/apiError';
import { IUser, User } from '../user/user.model';
import { ITeam, Team } from './team.model';
import { MemberRole } from './team.model';
import { Types } from 'mongoose';
import { Message } from '../message/message.model';
import { Project } from '../project/project.model';
import { Task } from '../task/task.model';
import { generateJoinCode } from '@/utils/helpers';

const teamService = {
  // ================= get teams =================
  async getTeams({ uid, offset = 0, limit = 11 }: { uid: string; offset?: number; limit?: number }) {
    const user = await User.findOne({ uid });
    if (!user) throw new ApiError(404, 'User not found');

    return Team.find({
      'members.userId': user._id,
    })
      .skip(offset)
      .limit(limit);
  },

  // ============================= get team by id =============================
  async getTeamById({ id }: { id: string }) {
    const team = await Team.findById(id).select('-members');
    if (!team) throw new ApiError(404, 'Team not found');
    return team;
  },

  // ============================= update team =============================
  async updateTeam({ teamId, name, description }: { teamId: string; name?: string; description?: string }) {
    const team = await Team.findById(teamId);
    if (!team) throw new ApiError(404, 'Team not found');

    if (name !== undefined) team.name = name;
    if (description !== undefined) team.description = description;

    await team.save();
    return team;
  },

  // ================= create team =================
  async createTeam({ name, description, user }: { name: string; description: string; user: IUser }) {
    const team = new Team({
      name,
      description,
      adminId: user._id,
      joinId: generateJoinCode(),

      members: [
        {
          userId: user._id,
          role: MemberRole.ADMIN,
          joinedAt: new Date(),
        },
      ],
    });

    await team.save();
    return team;
  },

  // ================= toggle add/remove member =================
  async toggleAddMember({ teamId, uid }: { teamId: string; uid: string }) {
    const user = await User.findOne({ uid });
    if (!user) throw new ApiError(404, 'User not found');

    const team = await Team.findById(teamId);
    if (!team) throw new ApiError(404, 'Team not found');

    const index = team.members.findIndex((m) => m.userId.equals(user._id));

    if (index !== -1) {
      // prevent removing admin
      if (team.members[index].role === MemberRole.ADMIN) {
        throw new ApiError(400, 'Admin cannot be removed');
      }

      team.members.splice(index, 1);
      await team.save();

      return { team, message: 'Member removed from team' };
    }

    team.members.push({
      userId: user._id,
      role: MemberRole.MEMBER,
      joinedAt: new Date(),
    });

    await team.save();
    return { team, message: 'Member added to team' };
  },

  // ================= assign manager =================
  async createManager({ teamId, uid }: { teamId: string; uid: string }) {
    const user = await User.findOne({ uid });
    if (!user) throw new ApiError(404, 'User not found');

    const team = await Team.findById(teamId);
    if (!team) throw new ApiError(404, 'Team not found');

    const member = team.members.find((m) => m.userId.equals(user._id));

    if (!member) throw new ApiError(400, 'User is not a team member');

    member.role = MemberRole.MANAGER;
    team.managerId = user._id;

    await team.save();
    return team;
  },

  // ============================= delete team =============================
  async deleteTeam({ teamId }: { teamId: string }) {
    const team = await Team.findByIdAndDelete(teamId);
    await Message.deleteMany({ teamId });
    await Project.deleteMany({ teamId });
    await Task.deleteMany({ teamId });
    if (!team) throw new ApiError(404, 'Team not found');

    return { message: 'Team deleted' };
  },

  // ============================= get team members =============================

  async getTeamMembers({ teamId, offset = 0, limit = 10 }: { teamId: string; offset?: number; limit?: number }) {
    const teamCount = await Team.findById(teamId).select('members');
    if (!teamCount) throw new ApiError(404, 'Team not found');

    const totalMembers = teamCount.members.length;

    const team = await Team.findById(teamId)
      .select({ members: { $slice: [offset, limit] } })
      .populate({
        path: 'members.userId',
        select: '_id uid name email',
      })
      .lean();

    if (!team) throw new ApiError(404, 'Team not found');

    const hasMore = offset + team.members.length < totalMembers;

    return {
      members: team.members,
      hasMore,
      totalMembers,
    };
  },

  async addMember(teamId: string, email: string) {
    if (!Types.ObjectId.isValid(teamId)) {
      throw new Error('Invalid teamId');
    }

    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User with this email does not exist');
    }

    const alreadyMember = team.members.some((m) => m.userId.equals(user._id));

    if (alreadyMember) {
      throw new Error('User already in team');
    }

    team.members.push({
      userId: user._id,
      role: MemberRole.MEMBER,
      joinedAt: new Date(),
    });

    await team.save();
    return team;
  },

  async removeMember(teamId: string, userId: string) {
    const team = await Team.findById(teamId);
    if (!team) throw new Error('Team not found');

    const userObjectId = new Types.ObjectId(userId);

    const member = team.members.find((m) => m.userId.equals(userObjectId));
    if (!member) throw new Error('User is not a team member');

    // prevent admin removal
    if (member.role === 'ADMIN') {
      throw new Error('Admin cannot be removed');
    }

    team.members = team.members.filter((m) => !m.userId.equals(userObjectId));

    await team.save();
    return team;
  },

  async updateMemberRole(teamId: string, userId: string, role: MemberRole) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId');
    }

    const team = await Team.findById(teamId);
    if (!team) throw new Error('Team not found');

    const userObjectId = new Types.ObjectId(userId);

    const member = team.members.find((m) => m.userId.equals(userObjectId));

    if (!member) {
      throw new Error('Member not found');
    }

    // 🔒 protect ADMIN downgrade
    if (member.role === MemberRole.ADMIN && role !== MemberRole.ADMIN) {
      throw new Error('Admin role cannot be changed');
    }

    member.role = role;
    await team.save();

    return team;
  },
};

export default teamService;

import { ApiError } from '@/utils/apiError';
import { IUser, User } from '../user/user.model';
import { Team } from './team.model';
import { MemberRole } from './team.model';
import { Types } from 'mongoose';

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

  // ================= create team =================
  async createTeam({ name, description, user }: { name: string; description: string; user: IUser }) {
    const team = new Team({
      name,
      description,
      adminId: user._id,
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
    if (!team) throw new ApiError(404, 'Team not found');

    return { message: 'Team deleted' };
  },
};

export default teamService;

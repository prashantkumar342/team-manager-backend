import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '@/config/firebase';
import { ApiError } from '@/utils/apiError';
import { MemberRole, Team } from '@/modules/team/team.model';
import { User } from '@/modules/user/user.model';

export const verifyTeamAdmin = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const teamId = req.params?.teamId || req.body?.teamId || req.query?.teamId;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authorization token missing');
    }

    if (!teamId) {
      throw new ApiError(400, 'teamId is required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await firebaseAuth.verifyIdToken(token);

    const user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const team = await Team.findOne({
      _id: teamId,
      members: {
        $elemMatch: {
          userId: user._id,
          role: MemberRole.ADMIN,
        },
      },
    });

    if (!team) {
      throw new ApiError(403, 'Admin access required');
    }

    req.firebaseUser = {
      uid: user.uid,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};

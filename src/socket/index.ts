import { Server, Socket } from 'socket.io';
import { firebaseAuth } from '@/config/firebase';
import { User } from '@/modules/user/user.model';
import { Team } from '@/modules/team/team.model';
import { Types } from 'mongoose';

export const setupSocket = (io: Server) => {
  // ================= AUTH MIDDLEWARE =================
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Unauthorized'));

      const decoded = await firebaseAuth.verifyIdToken(token);
      const user = await User.findOne({ uid: decoded.uid });
      if (!user) return next(new Error('User not found'));

      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error('Unauthorized'));
    }
  });

  // ================= CONNECTION =================
  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;

    // -------- JOIN TEAM ROOM --------
    socket.on('join-team', async (payload: { teamId: string }) => {
      try {
        const { teamId } = payload || {};

        if (!teamId || !Types.ObjectId.isValid(teamId)) {
          socket.emit('error', 'Invalid teamId');
          return;
        }

        const isMember = await Team.exists({
          _id: new Types.ObjectId(teamId),
          'members.userId': user._id,
        });

        if (!isMember) {
          socket.emit('error', 'Not a team member');
          return;
        }

        socket.join(`team:${teamId}`);
      } catch (err) {
        socket.emit('error', 'Failed to join team');
      }
    });

    // -------- LEAVE TEAM ROOM --------
    socket.on('leave-team', ({ teamId }: { teamId: string }) => {
      if (!teamId) return;
      socket.leave(`team:${teamId}`);
    });

    // -------- CLEANUP --------
    socket.on('disconnect', () => {
      // optional cleanup
    });
  });
};

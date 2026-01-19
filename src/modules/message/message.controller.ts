/// <reference path="../../types/express.d.ts" />
import { Request, Response } from 'express';
import messageService from './message.service';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { User } from '../user/user.model';
import { Types } from 'mongoose';

const messageController = {
  async sendMessage(req: Request, res: Response) {
    const uid = req.firebaseUser?.uid;
    if (!uid) throw new ApiError(401, 'Unauthorized');

    const teamId = req.query.teamId as string;
    const { content } = req.body;

    if (!content || !teamId) {
      throw new ApiError(400, 'content and teamId are required');
    }

    const user = await User.findOne({ uid });
    if (!user) throw new ApiError(404, 'User not found');

    // create message
    const message = await messageService.sendMessage({
      content,
      senderId: user._id,
      teamId: new Types.ObjectId(teamId),
    });

    // populate sender
    const populatedMessage = await message.populate('senderId', 'name email');

    // emit to team room
    req.app.locals.io.to(`team:${teamId}`).emit('new-message', populatedMessage);
    res.status(201).json(new ApiResponse('Message sent', { message: populatedMessage }));
  },

  async getMessages(req: Request, res: Response) {
    const { teamId } = req.query;
    if (!teamId) throw new ApiError(400, 'teamId is required');

    const messages = await messageService.getTeamMessages({
      teamId: teamId as string,
    });

    res.status(200).json(new ApiResponse('Messages fetched', { messages }));
  },
};

export default messageController;

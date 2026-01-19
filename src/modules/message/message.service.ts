import { ApiError } from '@/utils/apiError';
import { Message } from './message.model';
import { Types } from 'mongoose';

const messageService = {
  async sendMessage({ content, senderId, teamId }: { content: string; senderId: Types.ObjectId; teamId: Types.ObjectId }) {
    if (!content.trim()) {
      throw new ApiError(400, 'Message content is required');
    }

    const message = await Message.create({
      content,
      senderId,
      teamId,
      timestamp: new Date(),
    });

    return message;
  },

  async getTeamMessages({ teamId, limit = 50, offset = 0 }: { teamId: string; limit?: number; offset?: number }) {
    return Message.find({ teamId }).sort({ createdAt: -1 }).skip(offset).limit(limit).populate('senderId', 'name email');
  },
};

export default messageService;

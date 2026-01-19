import { Schema, model, Types } from 'mongoose';

export interface IMessage {
  _id: Types.ObjectId;
  content: string;
  senderId: Types.ObjectId;
  teamId: Types.ObjectId;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
  },
  { timestamps: true },
);

export const Message = model<IMessage>('Message', messageSchema);

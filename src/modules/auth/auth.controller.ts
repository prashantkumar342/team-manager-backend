import { Request, Response } from 'express';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';
import authService from './auth.service';
import { ENV } from '@/config/env';
import { User } from '../user/user.model';
import { AuthRequest } from '@/middlewares/firebaseAuth.middleware';

export const syncUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { email, name, uid } = req.firebaseUser!;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name: name || email.split('@')[0],
      uid,
    });
  }

  return res.status(201).json(
    new ApiResponse('User Synced', {
      id: user._id,
      uid: user.uid,
      email: user.email,
      name: user.name,
    }),
  );
};

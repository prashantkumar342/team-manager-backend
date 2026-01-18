import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '@/config/firebase';
import { ApiError } from '@/utils/apiError';

export interface AuthRequest extends Request {
  firebaseUser?: {
    uid: string;
    email: string;
    name?: string;
  };
}

export const verifyFirebaseToken = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization token missing');
  }

  const token = authHeader.split(' ')[1];

  const decoded = await firebaseAuth.verifyIdToken(token);
  if (!decoded.email_verified) {
    throw new ApiError(403, 'Email not verified');
  }

  if (!decoded.email) {
    throw new ApiError(400, 'Invalid Firebase token');
  }

  req.firebaseUser = {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name,
  };

  next();
};

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { ApiError } from '@/utils/apiError';
import { ENV } from '@/config/env';

const authService = {
  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      ENV.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  },
};

export default authService;

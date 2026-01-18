import { ApiError } from '@/utils/apiError';
import { User } from './user.model';

const userService = {
  async addMember(email: string, password: string, name?: string) {
    const isUserExists = await User.findOne({ email });
    if (isUserExists) throw new ApiError(409, 'User already exists');

    const newUser = await User.create({
      email,
      password,
      name,
    });

    return newUser;
  },
};

export default userService;

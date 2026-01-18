import { Request, Response } from 'express';
import userService from './user.service';
import { ApiResponse } from '@/utils/apiResponse';

const userController = {
  async addMember(req: Request, res: Response) {
    const { email, password, name } = req.body;
    const newUser = await userService.addMember(email, password, name);

    res.status(201).json(new ApiResponse('member created', newUser));
  },
};

export default userController;

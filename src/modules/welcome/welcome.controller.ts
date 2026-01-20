import { ApiResponse } from '@/utils/apiResponse';
import { Request, Response } from 'express';

const welcomeController = {
  async welcome(req: Request, res: Response) {
    res.status(200).json(new ApiResponse('backend alive: team-Manager', {}));
  },
};

export default welcomeController;

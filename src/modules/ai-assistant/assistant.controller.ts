import { Request, Response } from 'express';
import { askAssistant } from './assistant.service';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';

export async function assistantController(req: Request, res: Response) {
  try {
    const { message } = req.body;

    if (!message) throw new ApiError(400, 'Message is required');

    const answer = await askAssistant(message);

    res.status(200).json(new ApiResponse('Ai Response', { answer }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI assistant failed' });
  }
}

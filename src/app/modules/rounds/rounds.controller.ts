import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { roundsService } from './rounds.service';
import sendResponse from '../../utils/sendResponse';

const createRounds = catchAsync(async (req: Request, res: Response) => {
  const result = await roundsService.createRounds(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Rounds created successfully',
    data: result,
  });
});

const getAllRounds = catchAsync(async (req: Request, res: Response) => {
  const result = await roundsService.getAllRounds(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All rounds fetched successfully',
    data: result,
  });
});

const getRoundsById = catchAsync(async (req: Request, res: Response) => {
  const result = await roundsService.getRoundsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rounds fetched successfully',
    data: result,
  });
});
const updateRounds = catchAsync(async (req: Request, res: Response) => {
  const result = await roundsService.updateRounds(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rounds updated successfully',
    data: result,
  });
});
const roundReviewScore = catchAsync(async (req: Request, res: Response) => {
  const result = await roundsService.updateRounds(req.params.id, {
    reviewScore: req.body.reviewScore,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Score updated successfully',
    data: result,
  });
});

const deleteRounds = catchAsync(async (req: Request, res: Response) => {
  const result = await roundsService.deleteRounds(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rounds deleted successfully',
    data: result,
  });
});

export const roundsController = {
  createRounds,
  getAllRounds,
  getRoundsById,
  updateRounds,
  deleteRounds,
  roundReviewScore,
};

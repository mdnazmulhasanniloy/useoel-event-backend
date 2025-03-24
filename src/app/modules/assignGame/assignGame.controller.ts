import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { assignGameService } from './assignGame.service';
import sendResponse from '../../utils/sendResponse'; 

const createAssignGame = catchAsync(async (req: Request, res: Response) => {
  const result = await assignGameService.createAssignGame(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'AssignGame created successfully',
    data: result,
  });
});

const getAllAssignGame = catchAsync(async (req: Request, res: Response) => {
  const result = await assignGameService.getAllAssignGame(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All assignGame fetched successfully',
    data: result,
  });
});

const getAssignGameById = catchAsync(async (req: Request, res: Response) => {
  const result = await assignGameService.getAssignGameById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AssignGame fetched successfully',
    data: result,
  });
});
const updateAssignGame = catchAsync(async (req: Request, res: Response) => {
  const result = await assignGameService.updateAssignGame(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AssignGame updated successfully',
    data: result,
  });
});

const deleteAssignGame = catchAsync(async (req: Request, res: Response) => {
  const result = await assignGameService.deleteAssignGame(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AssignGame deleted successfully',
    data: result,
  });
});

export const assignGameController = {
  createAssignGame,
  getAllAssignGame,
  getAssignGameById,
  updateAssignGame,
  deleteAssignGame,
};

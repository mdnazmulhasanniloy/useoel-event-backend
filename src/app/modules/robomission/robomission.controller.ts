import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { robomissionService } from './robomission.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createRobomission = catchAsync(async (req: Request, res: Response) => {
  req.body.coach = req.user.userId;
  const result = await robomissionService.createRobomission(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Robomission created successfully',
    data: result,
  });
});

const getAllRobomission = catchAsync(async (req: Request, res: Response) => {
  const result = await robomissionService.getAllRobomission(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All robomission fetched successfully',
    data: result,
  });
});

const getRobomissionById = catchAsync(async (req: Request, res: Response) => {
  const result = await robomissionService.getRobomissionById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Robomission fetched successfully',
    data: result,
  });
});
const updateRobomission = catchAsync(async (req: Request, res: Response) => {
  const result = await robomissionService.updateRobomission(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Robomission updated successfully',
    data: result,
  });
});

const deleteRobomission = catchAsync(async (req: Request, res: Response) => {
  const result = await robomissionService.deleteRobomission(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Robomission deleted successfully',
    data: result,
  });
});

export const robomissionController = {
  createRobomission,
  getAllRobomission,
  getRobomissionById,
  updateRobomission,
  deleteRobomission,
};

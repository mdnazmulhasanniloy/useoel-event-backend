import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { dashboardService } from './dashboard.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const getDashboardData = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getDashboardData(req.query);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Dashboard data get successfully',
    data: result,
  });
});
const getAdminEarning = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getAdminEarning(req.query);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Dashboard earning get successfully',
    data: result,
  });
});

export const dashboardController = {
  getDashboardData,
  getAdminEarning,
};

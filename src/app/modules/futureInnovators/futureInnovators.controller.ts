
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { futureInnovatorsService } from './futureInnovators.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createFutureInnovators = catchAsync(async (req: Request, res: Response) => {
  req.body.coach = req.user.userId;
 const result = await futureInnovatorsService.createFutureInnovators(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'FutureInnovators created successfully',
    data: result,
  });

});

const getAllFutureInnovators = catchAsync(async (req: Request, res: Response) => {

 const result = await futureInnovatorsService.getAllFutureInnovators(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All futureInnovators fetched successfully',
    data: result,
  });

});

const getFutureInnovatorsById = catchAsync(async (req: Request, res: Response) => {
 const result = await futureInnovatorsService.getFutureInnovatorsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FutureInnovators fetched successfully',
    data: result,
  });

});
const updateFutureInnovators = catchAsync(async (req: Request, res: Response) => {
const result = await futureInnovatorsService.updateFutureInnovators(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FutureInnovators updated successfully',
    data: result,
  });

});


const deleteFutureInnovators = catchAsync(async (req: Request, res: Response) => {
 const result = await futureInnovatorsService.deleteFutureInnovators(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FutureInnovators deleted successfully',
    data: result,
  });

});

export const futureInnovatorsController = {
  createFutureInnovators,
  getAllFutureInnovators,
  getFutureInnovatorsById,
  updateFutureInnovators,
  deleteFutureInnovators,
};

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { futureEngineersService } from './futureEngineers.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createFutureEngineers = catchAsync(async (req: Request, res: Response) => {
   req.body.coach = req.user.userId;
 const result = await futureEngineersService.createFutureEngineers(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'FutureEngineers created successfully',
    data: result,
  });

});

const getAllFutureEngineers = catchAsync(async (req: Request, res: Response) => {

 const result = await futureEngineersService.getAllFutureEngineers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All futureEngineers fetched successfully',
    data: result,
  });

});

const getFutureEngineersById = catchAsync(async (req: Request, res: Response) => {
 const result = await futureEngineersService.getFutureEngineersById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FutureEngineers fetched successfully',
    data: result,
  });

});
const updateFutureEngineers = catchAsync(async (req: Request, res: Response) => {
const result = await futureEngineersService.updateFutureEngineers(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FutureEngineers updated successfully',
    data: result,
  });

});


const deleteFutureEngineers = catchAsync(async (req: Request, res: Response) => {
 const result = await futureEngineersService.deleteFutureEngineers(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FutureEngineers deleted successfully',
    data: result,
  });

});

export const futureEngineersController = {
  createFutureEngineers,
  getAllFutureEngineers,
  getFutureEngineersById,
  updateFutureEngineers,
  deleteFutureEngineers,
};
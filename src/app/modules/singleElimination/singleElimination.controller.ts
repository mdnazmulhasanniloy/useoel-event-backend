
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { singleEliminationService } from './singleElimination.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createSingleElimination = catchAsync(async (req: Request, res: Response) => {
 const result = await singleEliminationService.createSingleElimination(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'SingleElimination created successfully',
    data: result,
  });

});

const getAllSingleElimination = catchAsync(async (req: Request, res: Response) => {

 const result = await singleEliminationService.getAllSingleElimination(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All singleElimination fetched successfully',
    data: result,
  });

});

const getSingleEliminationById = catchAsync(async (req: Request, res: Response) => {
 const result = await singleEliminationService.getSingleEliminationById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SingleElimination fetched successfully',
    data: result,
  });

});
const updateSingleElimination = catchAsync(async (req: Request, res: Response) => {
const result = await singleEliminationService.updateSingleElimination(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SingleElimination updated successfully',
    data: result,
  });

});


const deleteSingleElimination = catchAsync(async (req: Request, res: Response) => {
 const result = await singleEliminationService.deleteSingleElimination(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SingleElimination deleted successfully',
    data: result,
  });

});

export const singleEliminationController = {
  createSingleElimination,
  getAllSingleElimination,
  getSingleEliminationById,
  updateSingleElimination,
  deleteSingleElimination,
};
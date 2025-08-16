
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { matchService } from './match.service';
import sendResponse from '../../utils/sendResponse'; 

const createMatch = catchAsync(async (req: Request, res: Response) => {
 const result = await matchService.createMatch(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Match created successfully',
    data: result,
  });

});
const createMultiMatch = catchAsync(async (req: Request, res: Response) => {
 const result = await matchService.createMultiMatch(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Matches created successfully',
    data: result,
  });

});

const getAllMatch = catchAsync(async (req: Request, res: Response) => {

 const result = await matchService.getAllMatch(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All match fetched successfully',
    data: result,
  });

});

const getMatchById = catchAsync(async (req: Request, res: Response) => {
 const result = await matchService.getMatchById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match fetched successfully',
    data: result,
  });

});
const updateMatch = catchAsync(async (req: Request, res: Response) => {
const result = await matchService.updateMatch(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match updated successfully',
    data: result,
  });

});


const deleteMatch = catchAsync(async (req: Request, res: Response) => {
 const result = await matchService.deleteMatch(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Match deleted successfully',
    data: result,
  });

});

export const matchController = {
  createMatch,
  getAllMatch,
  getMatchById,
  updateMatch,
  deleteMatch,createMultiMatch
};
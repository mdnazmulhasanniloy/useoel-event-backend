
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { upcomingBattlesService } from './upcomingBattles.service';
import sendResponse from '../../utils/sendResponse'; 

const createUpcomingBattles = catchAsync(async (req: Request, res: Response) => {
  req.body.author = req?.user?.userId;
 const result = await upcomingBattlesService.createUpcomingBattles(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'UpcomingBattles created successfully',
    data: result,
  });

});

const getAllUpcomingBattles = catchAsync(async (req: Request, res: Response) => {

 const result = await upcomingBattlesService.getAllUpcomingBattles(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All upcomingBattles fetched successfully',
    data: result,
  });

});

const getUpcomingBattlesById = catchAsync(async (req: Request, res: Response) => {
 const result = await upcomingBattlesService.getUpcomingBattlesById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'UpcomingBattles fetched successfully',
    data: result,
  });

});
const updateUpcomingBattles = catchAsync(async (req: Request, res: Response) => {
const result = await upcomingBattlesService.updateUpcomingBattles(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'UpcomingBattles updated successfully',
    data: result,
  });

});


const deleteUpcomingBattles = catchAsync(async (req: Request, res: Response) => {
 const result = await upcomingBattlesService.deleteUpcomingBattles(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'UpcomingBattles deleted successfully',
    data: result,
  });

});

export const upcomingBattlesController = {
  createUpcomingBattles,
  getAllUpcomingBattles,
  getUpcomingBattlesById,
  updateUpcomingBattles,
  deleteUpcomingBattles,
};
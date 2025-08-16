
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { leaderBoardService } from './leaderBoard.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

 
const getLeaderBoardByEventId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await leaderBoardService.getLeaderBoardByEventId(
      req.params.eventId,
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All leaderBoard fetched successfully',
      data: result,
    });
  },
);

const getLeaderBoardById = catchAsync(async (req: Request, res: Response) => {
 const result = await leaderBoardService.getLeaderBoardById(req.params.eventId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'LeaderBoard fetched successfully',
    data: result,
  });

});
 

export const leaderBoardController = {
  getLeaderBoardByEventId,
  getLeaderBoardById,
};

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { participantService } from './participant.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createParticipant = catchAsync(async (req: Request, res: Response) => {
 const result = await participantService.createParticipant(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Participant created successfully',
    data: result,
  });

});

const getAllParticipant = catchAsync(async (req: Request, res: Response) => {

 const result = await participantService.getAllParticipant(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All participant fetched successfully',
    data: result,
  });

});

const getParticipantById = catchAsync(async (req: Request, res: Response) => {
 const result = await participantService.getParticipantById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Participant fetched successfully',
    data: result,
  });

});
const updateParticipant = catchAsync(async (req: Request, res: Response) => {
const result = await participantService.updateParticipant(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Participant updated successfully',
    data: result,
  });

});


const deleteParticipant = catchAsync(async (req: Request, res: Response) => {
 const result = await participantService.deleteParticipant(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Participant deleted successfully',
    data: result,
  });

});

export const participantController = {
  createParticipant,
  getAllParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
};
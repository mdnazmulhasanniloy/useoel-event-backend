import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { eventRegisterService } from './eventRegister.service';
import sendResponse from '../../utils/sendResponse'; 

const createEventRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await eventRegisterService.createEventRegister(
    req.body,
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'EventRegister created successfully',
    data: result,
  });
});

const getAllEventRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await eventRegisterService.getAllEventRegister(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All eventRegister fetched successfully',
    data: result,
  });
});

const getEventRegisterById = catchAsync(async (req: Request, res: Response) => {
  const result = await eventRegisterService.getEventRegisterById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'EventRegister fetched successfully',
    data: result,
  });
});

const updateEventRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await eventRegisterService.updateEventRegister(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'EventRegister updated successfully',
    data: result,
  });
});

const acceptEventRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await eventRegisterService.updateEventRegister(req.params.id, {
    status: 'accept',
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'EventRegister accepted successfully',
    data: result,
  });
});

const rejectEventRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await eventRegisterService.updateEventRegister(req.params.id, {
    status: 'rejected',
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'EventRegister rejected successfully',
    data: result,
  });
});

const deleteEventRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await eventRegisterService.deleteEventRegister(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'EventRegister deleted successfully',
    data: result,
  });
});

export const eventRegisterController = {
  createEventRegister,
  getAllEventRegister,
  getEventRegisterById,
  updateEventRegister,
  deleteEventRegister,
  acceptEventRegister,
  rejectEventRegister,
};

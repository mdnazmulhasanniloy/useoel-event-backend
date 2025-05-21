import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { paymentsService } from './payments.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';

const checkout = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.userId;
  const result = await paymentsService.checkout(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'payment link get successful',
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.confirmPayment(req?.query);
  // res.redirect(`${config.success_url}?subscriptionId=${result?.subscription}`);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'payment successful',
  });
});

const dashboardData = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.dashboardData(req?.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'dashboard data successful',
  });
});
const getEarnings = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.getEarnings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'earnings data successful',
  });
});

const createPayments = catchAsync(async (req: Request, res: Response) => {});
const getAllPayments = catchAsync(async (req: Request, res: Response) => {});
const getPaymentsById = catchAsync(async (req: Request, res: Response) => {});
const updatePayments = catchAsync(async (req: Request, res: Response) => {});
const deletePayments = catchAsync(async (req: Request, res: Response) => {});

export const paymentsController = {
  createPayments,
  getAllPayments,
  getPaymentsById,
  updatePayments,
  deletePayments,
  confirmPayment,
  checkout,
  dashboardData,
  getEarnings,
};

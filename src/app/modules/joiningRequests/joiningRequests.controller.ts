import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { joiningRequestsService } from './joiningRequests.service';
import sendResponse from '../../utils/sendResponse';
import { USER_ROLE } from '../user/user.constants';

const createJoiningRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await joiningRequestsService.createJoiningRequests(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'JoiningRequests created successfully',
      data: result,
    });
  },
);

const getAllJoiningRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await joiningRequestsService.getAllJoiningRequests(
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All joiningRequests fetched successfully',
      data: result,
    });
  },
);
const getMyTeamJoiningRequests = catchAsync(
  async (req: Request, res: Response) => {
    if(req.user.role === USER_ROLE.coach){
      req.query['player'] = req?.user?.userId;
    }
    req.query['player'] = req?.user?.userId;
    const result = await joiningRequestsService.getAllJoiningRequests(
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All joiningRequests fetched successfully',
      data: result,
    });
  },
);
 

const getJoiningRequestsById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await joiningRequestsService.getJoiningRequestsById(
      req.params.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'JoiningRequests fetched successfully',
      data: result,
    });
  },
);

const approvedRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await joiningRequestsService.approvedRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'JoiningRequests approved successfully',
    data: result,
  });
});

const canceledRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await joiningRequestsService.canceledRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'JoiningRequests canceled successfully',
    data: result,
  });
});

const updateJoiningRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await joiningRequestsService.updateJoiningRequests(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'JoiningRequests updated successfully',
      data: result,
    });
  },
);

const deleteJoiningRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await joiningRequestsService.deleteJoiningRequests(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'JoiningRequests deleted successfully',
      data: result,
    });
  },
);

export const joiningRequestsController = {
  createJoiningRequests,
  getAllJoiningRequests,
  getJoiningRequestsById,
  updateJoiningRequests,
  deleteJoiningRequests,
  getMyTeamJoiningRequests,
  approvedRequest,
  canceledRequest,
};

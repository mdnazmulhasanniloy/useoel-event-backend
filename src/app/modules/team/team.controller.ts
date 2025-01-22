import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { teamService } from './team.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToS3 } from '../../utils/s3';

const createTeam = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.logo = await uploadToS3({
      file: req.file,
      fileName: `images/team/logo/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  req.body.user = req.user.userId;

  const result = await teamService.createTeam(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Team created successfully',
    data: result,
  });
});

const getAllTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await teamService.getAllTeam(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All team fetched successfully',
    data: result,
  });
});

const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const result = await teamService.getTeamById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team fetched successfully',
    data: result,
  });
});
const updateTeam = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.logo = await uploadToS3({
      file: req.file,
      fileName: `images/team/logo/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  const result = await teamService.updateTeam(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team updated successfully',
    data: result,
  });
});

const addPlayerInTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await teamService.addPlayerInTeam(
    req?.user?.userId,
    req?.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Add player in team successfully',
    data: result,
  });
});
const removePlayerFromTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await teamService.removePlayerFromTeam(
    req?.user?.userId,
    req?.body?.email,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Add player in team successfully',
    data: result,
  });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await teamService.deleteTeam(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team deleted successfully',
    data: result,
  });
});

export const teamController = {
  createTeam,
  getAllTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
  addPlayerInTeam,
  removePlayerFromTeam,
};

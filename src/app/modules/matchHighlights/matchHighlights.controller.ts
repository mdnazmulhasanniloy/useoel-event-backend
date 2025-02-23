import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { matchHighlightsService } from './matchHighlights.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createMatchHighlights = catchAsync(
  async (req: Request, res: Response) => {
    if (req.file) {
      req.body.video = await uploadToS3({
        file: req.file,
        fileName: `videos/highlight_match/${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }
    const result = await matchHighlightsService.createMatchHighlights(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'MatchHighlights created successfully',
      data: result,
    });
  },
);

const getAllMatchHighlights = catchAsync(
  async (req: Request, res: Response) => {
    const result = await matchHighlightsService.getAllMatchHighlights(
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All matchHighlights fetched successfully',
      data: result,
    });
  },
);

const getMatchHighlightsById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await matchHighlightsService.getMatchHighlightsById(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'MatchHighlights fetched successfully',
      data: result,
    });
  },
);
const updateMatchHighlights = catchAsync(
  async (req: Request, res: Response) => {
    if (req.file) {
      req.body.video = await uploadToS3({
        file: req.file,
        fileName: `videos/highlight_match/${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }
    const result = await matchHighlightsService.updateMatchHighlights(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'MatchHighlights updated successfully',
      data: result,
    });
  },
);

const deleteMatchHighlights = catchAsync(
  async (req: Request, res: Response) => {
    const result = await matchHighlightsService.deleteMatchHighlights(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'MatchHighlights deleted successfully',
      data: result,
    });
  },
);

export const matchHighlightsController = {
  createMatchHighlights,
  getAllMatchHighlights,
  getMatchHighlightsById,
  updateMatchHighlights,
  deleteMatchHighlights,
};

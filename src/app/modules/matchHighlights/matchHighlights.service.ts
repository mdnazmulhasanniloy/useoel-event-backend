import httpStatus from 'http-status';
import { IMatchHighlights } from './matchHighlights.interface';
import MatchHighlights from './matchHighlights.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createMatchHighlights = async (payload: IMatchHighlights) => {
  const result = await MatchHighlights.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create matchHighlights',
    );
  }
  return result;
};

const getAllMatchHighlights = async (query: Record<string, any>) => {
  const matchHighlightsModel = new QueryBuilder(
    MatchHighlights.find({ isDeleted: false }),
    query,
  )
    .search(['title', 'ageGroup'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await matchHighlightsModel.modelQuery;
  const meta = await matchHighlightsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getMatchHighlightsById = async (id: string) => {
  const result = await MatchHighlights.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'MatchHighlights not found!');
  }
  await MatchHighlights.findByIdAndUpdate(result?._id, { $inc: { plays: 1 } });
  return result;
};

const updateMatchHighlights = async (
  id: string,
  payload: Partial<IMatchHighlights>,
) => {
  const result = await MatchHighlights.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update MatchHighlights',
    );
  }
  return result;
};

const deleteMatchHighlights = async (id: string) => {
  const result = await MatchHighlights.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete matchHighlights',
    );
  }
  return result;
};

export const matchHighlightsService = {
  createMatchHighlights,
  getAllMatchHighlights,
  getMatchHighlightsById,
  updateMatchHighlights,
  deleteMatchHighlights,
};

import httpStatus from 'http-status';
import { IRounds } from './rounds.interface';
import Rounds from './rounds.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createRounds = async (payload: IRounds) => {
  const result = await Rounds.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create rounds');
  }
  return result;
};

const getAllRounds = async (query: Record<string, any>) => {
  const roundsModel = new QueryBuilder(
    Rounds.find().populate([{ path: 'game' }]),
    query,
  )
    .search(['roundName', 'gameType'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await roundsModel.modelQuery;
  const meta = await roundsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getRoundsById = async (id: string) => {
  const result = await Rounds.findById(id).populate([{ path: 'game' }]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Rounds not found!');
  }
  return result;
};

const updateRounds = async (id: string, payload: Partial<IRounds>) => {
  const result = await Rounds.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Rounds');
  }
  return result;
};

const deleteRounds = async (id: string) => {
  const result = await Rounds.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete rounds');
  }
  return result;
};

export const roundsService = {
  createRounds,
  getAllRounds,
  getRoundsById,
  updateRounds,
  deleteRounds,
};

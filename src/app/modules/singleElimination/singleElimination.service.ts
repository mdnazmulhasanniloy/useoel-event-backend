
import httpStatus from 'http-status';
import { ISingleElimination } from './singleElimination.interface';
import SingleElimination from './singleElimination.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createSingleElimination = async (payload: ISingleElimination) => {
  const result = await SingleElimination.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create singleElimination');
  }
  return result;
};

const getAllSingleElimination = async (query: Record<string, any>) => {
  const singleEliminationModel = new QueryBuilder(SingleElimination.find({isDeleted:false}), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await singleEliminationModel.modelQuery;
  const meta = await singleEliminationModel.countTotal();

  return {
    data,
    meta,
  };
};

const getSingleEliminationById = async (id: string) => {
  const result = await SingleElimination.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'SingleElimination not found!');
  }
  return result;
};

const updateSingleElimination = async (id: string, payload: Partial<ISingleElimination>) => {
  const result = await SingleElimination.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to update SingleElimination');
  }
  return result;
};

const deleteSingleElimination = async (id: string) => {
  const result = await SingleElimination.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete singleElimination');
  }
  return result;
};

export const singleEliminationService = {
  createSingleElimination,
  getAllSingleElimination,
  getSingleEliminationById,
  updateSingleElimination,
  deleteSingleElimination,
};
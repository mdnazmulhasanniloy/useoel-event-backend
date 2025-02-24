
import httpStatus from 'http-status';
import { IUpcomingBattles } from './upcomingBattles.interface';
import UpcomingBattles from './upcomingBattles.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createUpcomingBattles = async (payload: IUpcomingBattles) => {
  const result = await UpcomingBattles.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create upcomingBattles');
  }
  return result;
};

const getAllUpcomingBattles = async (query: Record<string, any>) => {
  const upcomingBattlesModel = new QueryBuilder(UpcomingBattles.find({isDeleted:false}), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await upcomingBattlesModel.modelQuery;
  const meta = await upcomingBattlesModel.countTotal();

  return {
    data,
    meta,
  };
};

const getUpcomingBattlesById = async (id: string) => {
  const result = await UpcomingBattles.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'UpcomingBattles not found!');
  }
  return result;
};

const updateUpcomingBattles = async (id: string, payload: Partial<IUpcomingBattles>) => {
  const result = await UpcomingBattles.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to update UpcomingBattles');
  }
  return result;
};

const deleteUpcomingBattles = async (id: string) => {
  const result = await UpcomingBattles.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete upcomingBattles');
  }
  return result;
};

export const upcomingBattlesService = {
  createUpcomingBattles,
  getAllUpcomingBattles,
  getUpcomingBattlesById,
  updateUpcomingBattles,
  deleteUpcomingBattles,
};
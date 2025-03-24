import httpStatus from 'http-status';
import { IAssignGame } from './assignGame.interface';
import AssignGame from './assignGame.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createAssignGame = async (payload: IAssignGame) => {
  const result = await AssignGame.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create assignGame');
  }
  return result;
};

const getAllAssignGame = async (query: Record<string, any>) => {
  const assignGameModel = new QueryBuilder(
    AssignGame.find({ isDeleted: false }).populate([
      {
        path: 'event',
        select: 'name email phoneNumber team image profile',
      },
      {
        path: 'winner',
        select: 'name email phoneNumber team image profile',
        populate: 'team',
      },
      {
        path: 'teamA',
        select: 'name email phoneNumber team image profile',
        populate: 'team',
      },
      {
        path: 'teamA',
        select: 'name email phoneNumber team image profile',
        populate: 'team',
      },
    ]),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await assignGameModel.modelQuery;
  const meta = await assignGameModel.countTotal();

  return {
    data,
    meta,
  };
};

const getAssignGameById = async (id: string) => {
  const result = await AssignGame.findById(id).populate([
    {
      path: 'event',
      select: 'name email phoneNumber team image profile',
    },
    {
      path: 'winner',
      select: 'name email phoneNumber team image profile',
      populate: 'team',
    },
    {
      path: 'teamA',
      select: 'name email phoneNumber team image profile',
      populate: 'team',
    },
    {
      path: 'teamA',
      select: 'name email phoneNumber team image profile',
      populate: 'team',
    },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'AssignGame not found!');
  }
  return result;
};

const updateAssignGame = async (id: string, payload: Partial<IAssignGame>) => {
  const result = await AssignGame.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update AssignGame');
  }
  return result;
};

const deleteAssignGame = async (id: string) => {
  const result = await AssignGame.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete assignGame');
  }
  return result;
};

export const assignGameService = {
  createAssignGame,
  getAllAssignGame,
  getAssignGameById,
  updateAssignGame,
  deleteAssignGame,
};

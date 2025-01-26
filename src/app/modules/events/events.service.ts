
import httpStatus from 'http-status';
import { IEvents } from './events.interface';
import Events from './events.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createEvents = async (payload: IEvents) => {
  const result = await Events.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create events');
  }
  return result;
};

const getAllEvents = async (query: Record<string, any>) => {
  const eventsModel = new QueryBuilder(Events.find({isDeleted:false}), query)
    .search(["name status category"])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await eventsModel.modelQuery;
  const meta = await eventsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getEventsById = async (id: string) => {
  const result = await Events.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Events not found!');
  }
  return result;
};

const updateEvents = async (id: string, payload: Partial<IEvents>) => {
  const result = await Events.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to update Events');
  }
  return result;
};

const deleteEvents = async (id: string) => {
  const result = await Events.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete events');
  }
  return result;
};

export const eventsService = {
  createEvents,
  getAllEvents,
  getEventsById,
  updateEvents,
  deleteEvents,
};
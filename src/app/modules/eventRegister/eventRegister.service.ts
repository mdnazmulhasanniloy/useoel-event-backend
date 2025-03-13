import httpStatus from 'http-status';
import { IEventRegister } from './eventRegister.interface';
import EventRegister from './eventRegister.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import Events from '../events/events.models';
import { CATEGORY_NAME } from '../events/events.constants';
import moment from 'moment';
import { IEvents } from '../events/events.interface';

const createEventRegister = async (payload: IEventRegister, userId: string) => {
  const event: IEvents | null = await Events.findById(payload.event);
  if (!event) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Event not found!');
  }
  const currentTime = moment().utc();

  //@ts-ignore
  const registrationEndTime = moment(event.registrationEndTime).utc();
  const registrationStartTime = moment(event.registrationStartTime).utc();

  if (currentTime.isBefore(registrationStartTime)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Registration has not started yet.',
    );
  }

  if (currentTime.isAfter(registrationEndTime)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Registration period has ended.',
    );
  }
  if (
    event?.category === CATEGORY_NAME?.robosporst ||
    CATEGORY_NAME.sumboBots
  ) {
    //@ts-ignore
    payload.player = userId;
  } else {
    //@ts-ignore
    payload.coach = userId;
  }

  const result = await EventRegister.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create eventRegister',
    );
  }
  return result;
};

const getAllEventRegister = async (query: Record<string, any>) => {
  const eventRegisterModel = new QueryBuilder(
    EventRegister.find({}).populate([
      { path: 'event' },
      {
        path: 'coach',
        select: '-verification -password -isDeleted -role -gender -status',
      },
      {
        path: 'player',
        select: '-verification -password -isDeleted -role -gender -status',
      },
    ]),
    query,
  )
    .search(['teamName'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await eventRegisterModel.modelQuery;
  const meta = await eventRegisterModel.countTotal();

  return {
    data,
    meta,
  };
};

const getEventRegisterById = async (id: string) => {
  const result = await EventRegister.findById(id).populate([
    { path: 'event' },
    {
      path: 'coach',
      select: '-verification -password -isDeleted -role -gender -status',
    },
    {
      path: 'player',
      select: '-verification -password -isDeleted -role -gender -status',
    },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'EventRegister not found!');
  }
  return result;
};

const updateEventRegister = async (
  id: string,
  payload: Partial<IEventRegister>,
) => {
  const result = await EventRegister.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update EventRegister',
    );
  }
  return result;
};

const deleteEventRegister = async (id: string) => {
  const result = await EventRegister.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete eventRegister',
    );
  }
  return result;
};

export const eventRegisterService = {
  createEventRegister,
  getAllEventRegister,
  getEventRegisterById,
  updateEventRegister,
  deleteEventRegister,
};

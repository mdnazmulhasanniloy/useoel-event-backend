import httpStatus from 'http-status';
import { IEvents } from './events.interface';
import Events from './events.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { CATEGORY_NAME } from './events.constants';
import { PipelineStage, Types } from 'mongoose';
import Rounds from '../rounds/rounds.models';

const createEvents = async (payload: IEvents) => {
  if (
    payload?.category ===
      (CATEGORY_NAME.robosporst || CATEGORY_NAME.sumboBots) &&
    !payload?.gameType
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Game type is required for this category',
    );
  } else {
    delete payload.gameType;
  }

  const result = await Events.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create events');
  }
  return result;
};

const getAllEvents = async (query: Record<string, any>) => {
  const eventsModel = new QueryBuilder(
    Events.find({ isDeleted: false }).populate([
      { path: 'registered', select: 'team', populate: { path: 'team' } },
    ]),
    query,
  )
    .search(['name status category'])
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
  const result = await Events.findById(id).populate([
    { path: 'registered', select: 'team', populate: { path: 'team' } },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Events not found!');
  }
  return result;
};

const updateEvents = async (id: string, payload: Partial<IEvents>) => {
  const result = await Events.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Events');
  }
  return result;
};

const deleteEvents = async (id: string) => {
  const result = await Events.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete events');
  }
  return result;
};

const getLeaderBoard = async (query: Record<string, any>) => {
  const event = await Events.findById(query.event);
  if (!event) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Event not found');
  }
  if (
    event.category === (CATEGORY_NAME.robosporst || CATEGORY_NAME.sumboBots)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Leaderboard is not available for this category',
    );
  }

  const pipeline: PipelineStage[] = [];

  pipeline.push({
    $match: {
      event: new Types.ObjectId(query.event),
      // isDeleted: false,
    },
  });
  console.log(pipeline);
  pipeline.push({
    $group: {
      _id: '$coach',  
      totalReviewScore: { $sum: { $ifNull: ['$reviewScore', 0] } },  
      roundsCount: { $sum: 1 }, 
    },
  });

  // pipeline.push({
  //   $lookup: {
  //     from: 'coaches', // Assuming the coaches collection is named 'coaches'
  //     localField: '_id',
  //     foreignField: '_id',
  //     as: 'coachDetails',
  //   },
  // });

  // pipeline.push({
  //   $sort: { totalReviewScore: -1 }, // optional: sort descending by total score
  // });
  const result = await Rounds.aggregate(pipeline);
  return result;
};

export const eventsService = {
  createEvents,
  getAllEvents,
  getEventsById,
  updateEvents,
  deleteEvents,
  getLeaderBoard,
};

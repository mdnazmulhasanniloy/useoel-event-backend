import httpStatus from 'http-status';
import { IRobomission } from './robomission.interface';
import Robomission from './robomission.models';
import AppError from '../../error/AppError';
import { gameType, IRounds } from '../rounds/rounds.interface';
import Rounds from '../rounds/rounds.models';
import Events from '../events/events.models';
import EventRegister from '../eventRegister/eventRegister.models';
import pickQuery from '../../utils/pickQuery';
import { startSession, Types } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';
import { CATEGORY_NAME } from '../events/events.constants';

const createRobomission = async (payload: IRobomission) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const registration = await EventRegister.findOne(
      { event: payload?.event, coach: payload?.coach, status: 'accept' },
      null,
      { session },
    );

    if (!registration) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not registered for this event',
      );
    }

    payload.teamName = registration.teamName;

    const { rounds, ...gameData } = payload;

    // Find the event
    const event = await Events.findById(gameData?.event, null, { session });
    if (!event) {
      throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
    }

    if (event.category !== CATEGORY_NAME.roboMission) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'This event is not a Robomission event',
      );
    }

    // Create FutureInnovators
    const result = await Robomission.create([gameData], { session });
    if (!result || result.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create Robomission',
      );
    }

    // Prepare rounds data
    //@ts-ignore
    const roundsArr: IRounds[] = rounds
      ? await Promise.all(
          rounds.map(async round => ({
            ...round,
            gameType: gameType.robomission,
            //@ts-ignore
            game: result[0]._id,
          })),
        )
      : [];

    // Create rounds if available
    if (roundsArr.length > 0) {
      await Rounds.create(roundsArr, { session });
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error: any) {
    console.log('🚀 ~ error:', error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getAllRobomission = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, latitude, longitude, ...filtersData } = filters;

  if (filtersData?.author) {
    filtersData['event'] = new Types.ObjectId(filtersData?.event);
  }

  if (filtersData?.facility) {
    filtersData['coach'] = new Types.ObjectId(filtersData?.coach);
  }

  // Initialize the aggregation pipeline
  const pipeline: any[] = [];

  pipeline.push({
    $match: { isDeleted: false, ...filtersData },
  });

  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: ['name', 'Other'].map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  // Add custom filters (filtersData) to the aggregation pipeline
  if (Object.entries(filtersData).length) {
    Object.entries(filtersData).map(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      }
    });

    if (Object.entries(filtersData).length) {
      pipeline.push({
        $match: {
          $and: Object.entries(filtersData).map(([field, value]) => ({
            isDeleted: false,
            [field]: value,
          })),
        },
      });
    }
  }

  // Sorting condition
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(pagination);

  if (sort) {
    const sortArray = sort.split(',').map(field => {
      const trimmedField = field.trim();
      if (trimmedField.startsWith('-')) {
        return { [trimmedField.slice(1)]: -1 };
      }
      return { [trimmedField]: 1 };
    });

    pipeline.push({ $sort: Object.assign({}, ...sortArray) });
  }

  pipeline.push({
    $facet: {
      totalData: [{ $count: 'total' }],
      paginatedData: [
        { $skip: skip },
        { $limit: limit },
        // Lookups

        {
          $lookup: {
            from: 'rounds',
            let: { robomissionId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$game', '$$robomissionId'] },
                      { $eq: ['$gameType', gameType.robomission] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: -1 } },
            ],
            as: 'rounds',
          },
        },

        {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'coach',
            foreignField: '_id',
            as: 'coach',
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  phoneNumber: 1,
                  profile: 1,
                  image: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            coach: { $arrayElemAt: ['$coach', 0] },
            event: { $arrayElemAt: ['$event', 0] },
          },
        },
        {
          $project: {
            teamName: 1,
            event: 1,
            coach: 1,
            isDeleted: 1,
            createdAt: 1,
            updatedAt: 1,
            rounds: 1,
          },
        },
      ],
    },
  });

  const [result] = await Robomission.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0;
  const data = result?.paginatedData || [];

  return {
    meta: { page, limit, total },
    data,
  };
};

const getRobomissionById = async (id: string) => {
  const [result] = await Robomission.aggregate([
    {
      $match: { _id: new Types.ObjectId(id), isDeleted: false },
    },
    {
      $lookup: {
        from: 'rounds',
        let: { robomissionId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$game', '$$robomissionId'] },
                  { $eq: ['$gameType', gameType.robomission] },
                ],
              },
            },
          },
          { $sort: { createdAt: -1 } },
        ],
        as: 'rounds',
      },
    },

    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'event',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'coach',
        foreignField: '_id',
        as: 'coach',
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              phoneNumber: 1,
              profile: 1,
              image: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        coach: { $arrayElemAt: ['$coach', 0] },
        event: { $arrayElemAt: ['$event', 0] },
      },
    },
    {
      $project: {
        teamName: 1,
        event: 1,
        coach: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        rounds: 1,
      },
    },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Robomission not found!');
  }

  return result;
};

const updateRobomission = async (
  id: string,
  payload: Partial<IRobomission>,
) => {
  const result = await Robomission.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Robomission');
  }
  return result;
};

const deleteRobomission = async (id: string) => {
  const result = await Robomission.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete robomission');
  }
  return result;
};

export const robomissionService = {
  createRobomission,
  getAllRobomission,
  getRobomissionById,
  updateRobomission,
  deleteRobomission,
};

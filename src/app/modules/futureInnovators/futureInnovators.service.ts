import httpStatus from 'http-status';
import { IFutureInnovators } from './futureInnovators.interface';
import FutureInnovators from './futureInnovators.models';
import AppError from '../../error/AppError';
import EventRegister from '../eventRegister/eventRegister.models';
import { gameType, IRounds } from '../rounds/rounds.interface';
import Events from '../events/events.models';
import Rounds from '../rounds/rounds.models';
import pickQuery from '../../utils/pickQuery';
import { paginationHelper } from '../../helpers/pagination.helpers';
import { CATEGORY_NAME } from '../events/events.constants';
import { startSession, Types } from 'mongoose';

// const createFutureInnovators = async (payload: IFutureInnovators) => {
//   const registration = await EventRegister.findOne({
//     event: payload?.event,
//     coach: payload?.coach,
//     status: 'accept',
//   });

//   if (!registration) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'You are not registered for this event',
//     );
//   }

//   payload.teamName = registration?.teamName;

//   const roundsArr: IRounds[] = [];
//   const { rounds, ...gameData } = payload;

//   // Find the event
//   const event = await Events.findById(gameData?.event, null);
//   if (!event) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
//   }

//   if (event?.category !== CATEGORY_NAME.futureInnovators) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'This event is not a Future Innovators event',
//     );
//   }
//   // Create FutureInnovators
//   const result = await FutureInnovators.create(gameData);
//   if (!result) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Failed to create Future Innovators',
//     );
//   }

//   // Prepare rounds data
//   rounds?.map(round =>
//     roundsArr.push({
//       ...round,
//       gameType: gameType.FutureInnovators,
//       //@ts-ignore
//       game: result?._id,
//     }),
//   );

//   // Create rounds
//   await Rounds.create(roundsArr);

//   return result;
// };

const createFutureInnovators = async (payload: IFutureInnovators) => {
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

    if (event.category !== CATEGORY_NAME.futureInnovators) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'This event is not a Future Innovators event',
      );
    }

    // Create FutureInnovators
    const result = await FutureInnovators.create([gameData], { session });
    if (!result || result.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create Future Innovators',
      );
    }

    // Prepare rounds data
    //@ts-ignore
    const roundsArr: IRounds[] = rounds
      ? await Promise.all(
          rounds.map(async round => ({
            ...round,
            gameType: gameType.FutureInnovators,
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
  } catch (error) {
    console.log('🚀 ~ error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllFutureInnovators = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, latitude, longitude, ...filtersData } = filters;

  if (filtersData?.author) {
    filtersData['event'] = new Types.ObjectId(filtersData?.coach);
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
            let: { futureInnovators: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$game', '$$futureInnovators'] },
                      { $eq: ['$gameType', gameType.FutureInnovators] },
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

  const [result] = await FutureInnovators.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0;
  const data = result?.paginatedData || [];

  return {
    meta: { page, limit, total },
    data,
  };
};

const getFutureInnovatorsById = async (id: string) => {
  const [result] = await FutureInnovators.aggregate([
    {
      $match: { _id: new Types.ObjectId(id), isDeleted: false },
    },
    {
      $lookup: {
        from: 'rounds',
        let: { futureInnovators: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$game', '$$futureInnovators'] },
                  { $eq: ['$gameType', gameType.FutureInnovators] },
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Future innovators not found!');
  }

  return result;
};

const updateFutureInnovators = async (
  id: string,
  payload: Partial<IFutureInnovators>,
) => {
  const result = await FutureInnovators.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update FutureInnovators',
    );
  }
  return result;
};

const deleteFutureInnovators = async (id: string) => {
  const result = await FutureInnovators.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete futureInnovators',
    );
  }
  return result;
};

export const futureInnovatorsService = {
  createFutureInnovators,
  getAllFutureInnovators,
  getFutureInnovatorsById,
  updateFutureInnovators,
  deleteFutureInnovators,
};

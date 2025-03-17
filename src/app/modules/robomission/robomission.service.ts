import httpStatus from 'http-status';
import { IRobomission } from './robomission.interface';
import Robomission from './robomission.models'; 
import AppError from '../../error/AppError';
import { gameType, IRounds } from '../rounds/rounds.interface';
import Rounds from '../rounds/rounds.models';
import Events from '../events/events.models';
import EventRegister from '../eventRegister/eventRegister.models';
import pickQuery from '../../utils/pickQuery';
import { Types } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';

const createRobomission = async (payload: IRobomission) => {
  const registration = await EventRegister.findOne({
    event: payload?.event,
    coach: payload?.coach,
    status: 'accept',
  });

  if (!registration) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You not registered for this event',
    );
  }
  payload.teamName = registration?.teamName;

  const roundsArr: IRounds[] = [];
  const { rounds, ...gameData } = payload;
  const event = await Events.findById(gameData?.event);
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }

  const result = await Robomission.create(gameData);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create robomission');
  }
  rounds?.map(round =>
    roundsArr.push({
      ...round,
      gameType: gameType.robomission,
      //@ts-ignore
      game: result?._id,
    }),
  );

  await Rounds.create(roundsArr);

  return result;
};

 
const getAllRobomission = async (query: Record<string, any>) => {
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

import httpStatus from 'http-status';
import { IMatch } from './match.interface';
import Match from './match.models'; 
import AppError from '../../error/AppError';
import Events from '../events/events.models';
import { startSession, Types } from 'mongoose';
import Participant from '../participant/participant.models';
import pickQuery from '../../utils/pickQuery';
import { paginationHelper } from '../../helpers/pagination.helpers';

const createMatch = async (payload: IMatch) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Check if event exists
    const event = await Events.findById(payload?.event).session(session);
    if (!event) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Event not found!');
    }

    // Separate participants and match data
    const { participants, ...matchData } = payload;

    // Create match
    const match = await Match.create([{ ...matchData }], { session });
    if (!match?.[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Match creation failed');
    }

    // Attach match ID to each participant
    const participantsWithMatch = participants.map(participant => ({
      ...participant,
      match: match[0]._id,
    }));

    // Create participants
    const createdParticipants = await Participant.insertMany(
      participantsWithMatch,
      { session },
    );
    if (!createdParticipants.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create participants',
      );
    }

    await session.commitTransaction();
    session.endSession();

    return match[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const createMultiMatch = async (payloads: IMatch[]) => { 
  console.log("🚀 ~ createMultiMatch ~ payloads:", payloads)
  const session = await startSession();
  session.startTransaction();

  try {
    // Validate all events exist
    const eventIds = [...new Set(payloads.map(payload => payload.event))];
    const events = await Events.find({ _id: { $in: eventIds } }).session(session);
    
    console.log("🚀 ~ createMultiMatch ~ events:", events)
    // Check if all events were found
    if (events.length !== eventIds.length) {
      const foundEventIds = events.map(event => event._id.toString());
      const missingEventId = eventIds.find(id => !foundEventIds.includes(id.toString()));
      throw new AppError(httpStatus.BAD_REQUEST, `Event not found: ${missingEventId}`);
    }

    const createdMatches = [];

    // Process each match creation
    for (const payload of payloads) {
      // Separate participants and match data
      const { participants, ...matchData } = payload;

      // Create match
      const match = await Match.create([{ ...matchData }], { session });
      if (!match?.[0]) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Match creation failed');
      }

      // Attach match ID to each participant
      const participantsWithMatch = participants.map(participant => ({
        ...participant,
        match: match[0]._id,
      }));

      // Create participants
      const createdParticipants = await Participant.insertMany(
        participantsWithMatch,
        { session }
      );
      if (!createdParticipants.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to create participants'
        );
      }

      createdMatches.push(match[0]);
    }

    await session.commitTransaction();
    session.endSession();
    return createdMatches 
  } catch (error:any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error?.message ?? "server internal error");
  }
};

const getAllMatch = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);

  const { searchTerm, ...filtersData } = filters;

  if (filtersData?.event) {
    filtersData['event'] = new Types.ObjectId(filtersData?.event);
  }
  if (filtersData?._id) {
    filtersData['_id'] = new Types.ObjectId(filtersData?._id);
  }

  // Initialize the aggregation pipeline
  const pipeline: any[] = [];

  // Add a match to exclude deleted documents
  pipeline.push({
    $match: {
      isDeleted: false,
    },
  });

  // If searchTerm is provided, add a search condition
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: ['name', 'nextMatchId', 'state'].map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  if (Object.entries(filtersData).length) {
    Object.entries(filtersData).forEach(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      } else {
        // 🔁 Convert to number if numeric string
        if (!isNaN(value)) {
          filtersData[field] = Number(value);
        }
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
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event',
          },
        },

        {
          $addFields: {
            event: { $arrayElemAt: ['$event', 0] },
          },
        },

        {
          $lookup: {
            from: 'participants',
            localField: '_id',
            foreignField: 'match',
            as: 'participants',
          },
        },
      ],
    },
  });

  const [result] = await Match.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0;
  const data = result?.paginatedData || [];

  return {
    meta: { page, limit, total },
    data,
  };
};

const getMatchById = async (id: string) => {
  const result = await Match.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
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
      $addFields: {
        event: { $arrayElemAt: ['$event', 0] },
      },
    },

    {
      $lookup: {
        from: 'participants',
        localField: '_id',
        foreignField: 'match',
        as: 'participants',
      },
    },
  ]).then(data => data[0]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Match not found!');
  }
  return result;
};

const updateMatch = async (id: string, payload: Partial<IMatch>) => {
  const result = await Match.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Match');
  }
  return result;
};

const deleteMatch = async (id: string) => {
  const result = await Match.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete match');
  }
  return result;
};

export const matchService = {
  createMatch,
  getAllMatch,
  getMatchById,
  updateMatch,
  deleteMatch,createMultiMatch
};

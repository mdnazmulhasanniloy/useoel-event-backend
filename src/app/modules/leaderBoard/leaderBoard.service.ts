import { Types } from 'mongoose';
import pickQuery from '../../utils/pickQuery';
import Rounds from '../rounds/rounds.models';
import { paginationHelper } from '../../helpers/pagination.helpers';
import { populate } from 'dotenv';

const getLeaderBoardByEventId = async (
  eventId: string,
  query: Record<string, any>,
) => {
  console.log(eventId);
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;
  const pipeline = [];

  pipeline.push({
    $match: {
      event: new Types.ObjectId(eventId),
    },
  });
  pipeline.push({
    $group: {
      _id: '$game', // group by game
      gameType: { $first: '$gameType' },
      event: { $first: '$event' },
      coach: { $first: '$coach' },
      rounds: {
        $push: {
          roundName: '$roundName',
          gettingScore: '$gettingScore',
          reviewScore: '$reviewScore',
        },
      },
      totalReviewScore: { $sum: { $ifNull: ['$reviewScore', 0] } },
      avgReviewScore: { $avg: '$reviewScore' },
      highestReviewScore: { $max: '$reviewScore' },
    },
  });

  //lookup
  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'coach',
        foreignField: '_id',
        as: 'coachDetails',
      },
    },
    {
      $unwind: {
        path: '$coachDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'teams', // assuming User has team: ObjectId ref
        localField: 'coachDetails.team',
        foreignField: '_id',
        as: 'teamDetails',
      },
    },
    {
      $unwind: {
        path: '$teamDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $lookup: {
    //     from: 'events',
    //     localField: 'event',
    //     foreignField: '_id',
    //     as: 'eventDetails',
    //   },
    // },
    // {
    //   $unwind: {
    //     path: '$eventDetails',
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
    {
      $project: {
        totalReviewScore: 1,
        avgReviewScore: 1,
        highestReviewScore: 1,
        _id: 0,
        game: '$_id',
        gameType: 1,
        // event: '$eventDetails',
        coach: {
          _id: '$coachDetails._id',
          name: '$coachDetails.name',
          email: '$coachDetails.email',
        },
        team: '$teamDetails',
        rounds: 1,
      },
    },
  );

  // Sorting condition
  const { sort } = paginationHelper.calculatePagination(pagination);

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

  const result = await Rounds.aggregate(pipeline);
  return result;
};

const getLeaderBoardById = async (eventId: string) => {};

export const leaderBoardService = {
  getLeaderBoardByEventId,
  getLeaderBoardById,
};

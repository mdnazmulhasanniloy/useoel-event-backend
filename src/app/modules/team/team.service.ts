import httpStatus from 'http-status';
import { ITeam } from './team.interface';
import Team from './team.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import { startSession } from 'mongoose';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';

export const createTeam = async (payload: any) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Step 1: Create the team
    const result = await Team.create([payload], { session });
    if (!result || result.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create team');
    }

    // Step 2: Update the user
    const team = result[0];
    const userUpdate = await User.findByIdAndUpdate(
      team?.user,
      { team: team?._id },
      { session, new: true },
    );
    if (!userUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update user');
    }

    // Step 3: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return team;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus?.BAD_REQUEST, error?.message); // Rethrow the error for the caller to handle
  }
};

const getAllTeam = async (query: Record<string, any>) => {
  const teamModel = new QueryBuilder(
    Team.find({ isDeleted: false }).populate({
      path: 'user',
      select: '-password -verification',
    }),
    query,
  )
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await teamModel.modelQuery;
  const meta = await teamModel.countTotal();

  return {
    data,
    meta,
  };
};

const getTeamById = async (id: string) => {
  const result = await Team.findById(id).populate('user');
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Team not found!');
  }
  return result;
};

const addPlayerInTeam = async (
  userId: string,
  payload: { playerId: string },
) => {
  const team = await Team.findOne({ user: userId });
  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found for the team');
  }

  if (team.player.length >= 3) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Team is full');
  }

  const result = await Team.findByIdAndUpdate(
    team?._id,
    {
      $push: { player: { $each: payload.playerId } },
    },
    { new: true },
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to add player in team',
    );
  }
  return result;
};

const removePlayerFromTeam = async (userId: string, playerId: string) => {
  // Step 1: Find the team by userId and validate if it exists
  const team = await Team.findOne({ user: userId });
  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, 'Team not found for the user');
  }

  // Step 3: Remove the player from the team using $pull
  const result = await Team.findByIdAndUpdate(
    team._id,
    { $pull: { player: playerId } },
    { new: true },
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to remove player from the team',
    );
  }
  notificationServices.insertNotificationIntoDb({
    receiver: playerId,
    message: 'You have been removed from a team',
    description: `You have been removed from the team "<b>${team.name}</b>". We wish you the best in your future endeavors.`,
    refference: result?._id,
    model_type: modeType.Team,
  });
  return result; // Return the updated team
};

const updateTeam = async (id: string, payload: Partial<ITeam>) => {
  const result = await Team.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Team');
  }
  return result;
};

const deleteTeam = async (id: string) => {
  const result = await Team.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete team');
  }
  return result;
};

export const teamService = {
  createTeam,
  getAllTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
  addPlayerInTeam,
  removePlayerFromTeam,
};

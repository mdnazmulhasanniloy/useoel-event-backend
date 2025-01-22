import httpStatus from 'http-status';
import { ITeam, ITeamPlayer } from './team.interface';
import Team from './team.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import { startSession } from 'mongoose';

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

const addPlayerInTeam = async (userId: string, payload: ITeamPlayer) => {
  const team = await Team.findOne({ user: userId });
  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found for the team');
  }

  if (team.player.length >= 3) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Team is full');
  }

  const isDuplicate = team.player.some(
    player => player.email === payload.email,
  );
  if (isDuplicate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Player with this email already exists in the team',
    );
  }

  const result = await Team.findByIdAndUpdate(
    team?._id,
    {
      $push: { player: payload },
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

const removePlayerFromTeam = async (userId: string, playerEmail: string) => {
  // Step 1: Find the team by userId and validate if it exists
  const team = await Team.findOne({ user: userId });
  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, 'Team not found for the user');
  }

  // Step 2: Check if the player exists in the team
  const playerExists = team.player.some(player => player.email === playerEmail);
  if (!playerExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Player not found in the team');
  }

  // Step 3: Remove the player from the team using $pull
  const result = await Team.findByIdAndUpdate(
    team._id,
    { $pull: { player: { email: playerEmail } } },
    { new: true },
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to remove player from the team',
    );
  }

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

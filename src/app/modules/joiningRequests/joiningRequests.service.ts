import httpStatus from 'http-status';
import { IJoiningRequests } from './joiningRequests.interface';
import JoiningRequests from './joiningRequests.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import Team from '../team/team.models';
import { User } from '../user/user.models';
import { startSession } from 'mongoose';
import { ITeam } from '../team/team.interface';
import { IUser } from '../user/user.interface';

const createJoiningRequests = async (payload: IJoiningRequests) => {
  // Check if the player has already requested to join the team
  const team = await Team.findById(payload.team);
  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, 'Team not found');
  }
  const result = await JoiningRequests.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create joiningRequests',
    );
  }

  notificationServices.insertNotificationIntoDb({
    receiver: result.player,
    message: 'You have received a team invite!',
    description: `The team "<b>${team.name}</b>" has invited you to join them. Check your joining requests for more details.`,
    refference: result?._id,
    model_type: modeType.JoiningRequests,
  });

  return result;
};

const getAllJoiningRequests = async (query: Record<string, any>) => {
  const joiningRequestsModel = new QueryBuilder(
    JoiningRequests.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await joiningRequestsModel.modelQuery;
  const meta = await joiningRequestsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getJoiningRequestsById = async (id: string) => {
  const result = await JoiningRequests.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'JoiningRequests not found!');
  }
  return result;
};

const updateJoiningRequests = async (
  id: string,
  payload: Partial<IJoiningRequests>,
) => {
  const result = await JoiningRequests.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update JoiningRequests',
    );
  }
  return result;
};

const approvedRequest = async (id: string) => {
  const session = await startSession();
  session.startTransaction();
  const request = await JoiningRequests.findById(id).populate([
    'player',
    'team',
  ]);
  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'JoiningRequests not found');
  }

  if (!request?.player) {
    throw new AppError(httpStatus.NOT_FOUND, 'Player not found');
  }

  if ((request?.team as ITeam)?.player.length >= 3) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Team is full');
  }

  const isDuplicate = (request?.team as ITeam).player.some(
    player => player?.email === (request?.player as IUser)?.email,
  );

  
  if (isDuplicate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'you are already exists in the team',
    );
  }

  try {
    const result = await JoiningRequests.findByIdAndUpdate(
      id,
      { status: 'accept' },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update JoiningRequests',
      );
    }

    const player = await User.findByIdAndUpdate(
      result?.player,
      { available: true },
      { new: true, upsert: false, session },
    );

    if (!player) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Player not found');
    }

    const team = await Team.findByIdAndUpdate(
      result?.team,
      {
        player: {
          name: player.name,
          email: player.email,
          image: player.profile,
        },
      },
      { new: true, upsert: false, session },
    );

    if (!team) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Team not found');
    }

    notificationServices.insertNotificationIntoDb({
      receiver: team?.user,
      message: 'A player has accepted your team invite!',
      description: `Player <b>${player?.name}</b> has accepted your invitation and joined your team "<b>${team?.name}</b>`,
      refference: result?._id,
      model_type: modeType.JoiningRequests,
    });

    notificationServices.insertNotificationIntoDb({
      receiver: player?._id,
      message: 'You have joined a new team!',
      description: `You have successfully joined the team "<b>${team.name}</b>". Best of luck with your new journey!`,
      refference: result?._id,
      model_type: modeType.JoiningRequests,
    });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const canceledRequest = async (id: string) => {
  const result = await JoiningRequests.findByIdAndUpdate(
    id,
    { status: 'rejected' },
    { new: true },
  )
    .populate('team')
    .populate('player');
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cancel joiningRequests',
    );
  }
  notificationServices.insertNotificationIntoDb({
    receiver: (result?.team as ITeam)?.user,
    message: 'A player has rejected your team invite!',
    description: `Player <b>${(result?.player as IUser)?.name}</b> has declined your invitation to join the team "<b>${(result?.team as ITeam)?.name}</b>".`,
    refference: result?._id,
    model_type: modeType.JoiningRequests,
  });
  return result;
};

const deleteJoiningRequests = async (id: string) => {
  const result = await JoiningRequests.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete joiningRequests',
    );
  }
  return result;
};

export const joiningRequestsService = {
  createJoiningRequests,
  getAllJoiningRequests,
  getJoiningRequestsById,
  updateJoiningRequests,
  deleteJoiningRequests,
  approvedRequest,
  canceledRequest,
};


import httpStatus from 'http-status';
import { IParticipant } from './participant.interface';
import Participant from './participant.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

const createParticipant = async (payload: IParticipant) => {
  const result = await Participant.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create participant');
  }
  return result;
};

const getAllParticipant = async (query: Record<string, any>) => {
  const participantModel = new QueryBuilder(Participant.find({isDeleted:false}), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await participantModel.modelQuery;
  const meta = await participantModel.countTotal();

  return {
    data,
    meta,
  };
};

const getParticipantById = async (id: string) => {
  const result = await Participant.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Participant not found!');
  }
  return result;
};

const updateParticipant = async (id: string, payload: Partial<IParticipant>) => {
  const result = await Participant.findByIdAndUpdate(id, payload, { new: true });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to update Participant');
  }
  return result;
};

const deleteParticipant = async (id: string) => {
  const result = await Participant.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete participant');
  }
  return result;
};

export const participantService = {
  createParticipant,
  getAllParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
};
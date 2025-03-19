
import { Model, ObjectId } from 'mongoose';

export interface IAssignGame {
  event: ObjectId;
  teamA: ObjectId;
  teamB: ObjectId;
  rounds: string;
  status: string;
  video: string;
  winner: ObjectId;
  result: {
    teamA: number;
    teamB: number;
  };
  isDeleted: boolean;
}

export type IAssignGameModules = Model<IAssignGame, Record<string, unknown>>;
import { Model } from 'mongoose';
import { IRounds } from '../rounds/rounds.interface';
import { ObjectId } from 'mongoose';

export interface IFutureEngineers {
  event: ObjectId;
  teamName: string;
  coach: ObjectId;
  rounds?: IRounds[];
  isDeleted: boolean;
}

export type IFutureEngineersModules = Model<
  IFutureEngineers,
  Record<string, unknown>
>;

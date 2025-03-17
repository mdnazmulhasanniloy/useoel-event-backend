
import { Model, ObjectId } from 'mongoose';
import { IRounds } from '../rounds/rounds.interface';

export interface IFutureInnovators {
      event: ObjectId;
      teamName: string;
      coach: ObjectId;
      rounds?: IRounds[];
      isDeleted: boolean;
}

export type IFutureInnovatorsModules = Model<IFutureInnovators, Record<string, unknown>>;
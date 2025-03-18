import { Model, ObjectId } from 'mongoose';
import { IRounds } from '../rounds/rounds.interface';

export interface IRobomission {
  event: ObjectId;
  teamName: string;
  coach: ObjectId;
  rounds?: IRounds[];
  isDeleted: boolean;
}

export type IRobomissionModules = Model<IRobomission, Record<string, unknown>>;

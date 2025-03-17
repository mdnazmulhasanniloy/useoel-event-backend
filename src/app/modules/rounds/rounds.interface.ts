import { Model, ObjectId } from 'mongoose';

export enum gameType {
  robomission = 'Robomission',
}

export interface IRounds {
  roundName: string;
  gameType: gameType;
  game: ObjectId;
  gettingScore: number;
  reviewScore: number;
  videos: string;
}

export type IRoundsModules = Model<IRounds, Record<string, unknown>>;

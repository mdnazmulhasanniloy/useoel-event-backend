import { Model, ObjectId } from 'mongoose';

export interface IUpcomingBattles {
  author: ObjectId;
  teamName: string;
  teamMember: number;
  ageGroup: string;
  coachEmail: string;
  score: string;
  video: string;
  isDeleted: boolean;
}

export type IUpcomingBattlesModules = Model<
  IUpcomingBattles,
  Record<string, unknown>
>;

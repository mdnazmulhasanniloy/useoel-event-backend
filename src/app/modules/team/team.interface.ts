import { Model, ObjectId } from 'mongoose';

 
export interface ITeam {
  user: ObjectId;
  name: string;
  city: string;
  state: string;
  country: string;
  teamCategory: string;
  ageGroup: string;
  logo: string;
  player: ObjectId[];
  isDeleted: boolean;
}

export type ITeamModules = Model<ITeam, Record<string, unknown>>;

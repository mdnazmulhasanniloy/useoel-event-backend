import { Model, ObjectId } from 'mongoose';

export interface ITeamPlayer {
  name: string;
  email: string;
  image: string;
}
export interface ITeam {
  user: ObjectId;
  name: string;
  city: string;
  state: string;
  country: string;
  teamCategory: string;
  ageGroup: string; 
  logo: string;
  player: ITeamPlayer[];
  isDeleted: boolean;
}

export type ITeamModules = Model<ITeam, Record<string, unknown>>;

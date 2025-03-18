import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { ITeam } from '../team/team.interface';

export interface IJoiningRequests {
  player: ObjectId | IUser;
  team: ObjectId | ITeam;
  status: 'pending' | 'accept' | 'rejected';
}

export type IJoiningRequestsModules = Model<
  IJoiningRequests,
  Record<string, unknown>
>;

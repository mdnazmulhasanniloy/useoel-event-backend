import { Model, ObjectId } from 'mongoose';
import { IMatch } from '../match/match.interface';
import { ITeam } from '../team/team.interface';

export interface IParticipant {
  match: ObjectId | IMatch;
  resultText: string | null;
  isWinner: boolean;
  status: string | null;
  team: ObjectId | ITeam;
  isDeleted: boolean;
}

export type IParticipantModules = Model<IParticipant, Record<string, unknown>>;

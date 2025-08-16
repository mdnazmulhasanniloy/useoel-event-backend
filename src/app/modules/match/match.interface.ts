import { Model, ObjectId } from 'mongoose';
import { IParticipant } from '../participant/participant.interface';

export interface IMatch {
  id:string
  _id: string;
  event: ObjectId;
  name: string;
  nextMatchId: string;
  tournamentRoundText: string;
  startTime: string;
  state: 'NO_SHOW' | 'WALK_OVER' | 'DONE' | 'NO_PARTY';
  participants: IParticipant[];
  isDeleted: Boolean;
}



export type IMatchModules = Model<IMatch, Record<string, unknown>>;

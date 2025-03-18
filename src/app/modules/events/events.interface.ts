import { Model } from 'mongoose';

export interface IEvents {
  image: string;
  name: string;
  category: string;
  ageGroup: string;
  scoringStyle: string;
  status: string;
  Round: Number;
  roles: string;
  registrationStartTime: string;
  registrationEndTime: String;
  maxParticipants: Number;
  remainingParticipants: Number;
  rounds: Number;
  isDeleted: boolean;
}

export type IEventsModules = Model<IEvents, Record<string, unknown>>;

import { Model, ObjectId } from 'mongoose';

export interface IEvents {
  image: string;
  name: string;
  category: string;
  ageGroup: string;
  scoringStyle: string;
  status: string;
  Round: Number;
  rules: string;
  registrationStartTime: string;
  registrationEndTime: String;
  maxParticipants: Number;
  remainingParticipants: Number;
  registered: ObjectId[];
  rounds: Number;
  isDeleted: boolean;
}

export type IEventsModules = Model<IEvents, Record<string, unknown>>;

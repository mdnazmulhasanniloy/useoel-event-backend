import { Model, ObjectId } from 'mongoose';

export interface IRounds {
  roundName: string;
  startDate: string;
  startTime: string;
  totalTime: string;
}
export interface IEvents {
  image: string;
  name: string;
  category: string;
  ageGroup: string;
  scoringStyle: string;
  status: string;
  Round: Number;
  roles: string;
  registration: {
    startTime: string;
    endTime: string;
    maxParticipants: number;
  };
  rounds:IRounds[];
  isDeleted: boolean;
}

export type IEventsModules = Model<IEvents, Record<string, unknown>>;

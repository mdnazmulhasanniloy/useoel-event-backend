import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IEvents } from './../events/events.interface';

export interface IEventRegister {
  event: ObjectId | IEvents;
  teamName: string;
  coach: ObjectId | IUser;
  player: ObjectId | IUser;
  status: 'pending' | 'accept' | 'rejected';
}

export type IEventRegisterModules = Model<
  IEventRegister,
  Record<string, unknown>
>;

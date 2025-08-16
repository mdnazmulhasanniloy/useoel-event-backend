
import { Model } from 'mongoose';

export interface ILeaderBoard {}

export type ILeaderBoardModules = Model<ILeaderBoard, Record<string, unknown>>;
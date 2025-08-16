
import { Model } from 'mongoose';

export interface ISingleElimination {}

export type ISingleEliminationModules = Model<ISingleElimination, Record<string, unknown>>;
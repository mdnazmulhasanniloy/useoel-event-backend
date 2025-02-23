import { Model, ObjectId } from 'mongoose';

export interface IMatchHighlights {
  video: string;
  videoUrl: string;
  title: string;
  teamA: ObjectId;
  teamB: ObjectId;
  ageGroup: string;
  category: string;
  isDeleted: boolean;
  plays:Number
}

export type IMatchHighlightsModules = Model<
  IMatchHighlights,
  Record<string, unknown>
>;

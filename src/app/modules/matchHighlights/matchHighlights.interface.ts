import { Model, ObjectId } from 'mongoose';

export interface IMatchHighlights {
  videoUrl: string;
  thumbnailUrl: string;
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

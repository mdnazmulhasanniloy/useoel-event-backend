import { model, Schema, Types } from 'mongoose';
import {
  IMatchHighlights,
  IMatchHighlightsModules,
} from './matchHighlights.interface';
import { category } from '../events/events.constants';

const matchHighlightsSchema = new Schema<IMatchHighlights>(
  {
    videoUrl: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
      default: null,
    },
    teamA: {
      type: Types.ObjectId,
      ref: 'Team',
      default: null,
      required: true,
    },
    teamB: {
      type: Types.ObjectId,
      ref: 'Team',
      required: true,
      default: null,
    },
    ageGroup: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: category,
      default: null,
      required: true,
    },
    plays: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

const MatchHighlights = model<IMatchHighlights, IMatchHighlightsModules>(
  'MatchHighlights',
  matchHighlightsSchema,
);
export default MatchHighlights;

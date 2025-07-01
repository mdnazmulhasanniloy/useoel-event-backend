import { model, Schema, Types } from 'mongoose';
import { IMatch, IMatchModules } from './match.interface';
import { MATCH_STATE } from './match.constants';

const matchSchema = new Schema<IMatch>(
  {
    event: {
      type: Types.ObjectId,
      ref: 'Events',
      required: true,
    },
    name: { type: String, default: null },
    nextMatchId: {
      type: Types.ObjectId,
      ref: 'Match',
      default: null,
    },
    tournamentRoundText: { type: String, default: null },
    startTime: { type: String, default: null },
    state: { type: String, enum: MATCH_STATE, default: null },
    // participants: [
    //   {
    //     type: Types.ObjectId,
    //     ref: '',
    //     required: true,
    //   },
    // ],
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

const Match = model<IMatch, IMatchModules>('Match', matchSchema);
export default Match;

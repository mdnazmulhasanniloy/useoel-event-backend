import { model, Schema } from 'mongoose';
import { gameType, IRounds, IRoundsModules } from './rounds.interface';

const roundsSchema = new Schema<IRounds>(
  {
    roundName: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      enum: Object.values(gameType),
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Events',
      required: [true, 'Event id is required'],
    },
    coach: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },
    game: {
      type: Schema.Types.ObjectId,
      refPath: 'gameType',
      required: [true, 'Receiver id is required'],
    },
    gettingScore: {
      type: Number,
      required: true,
    },
    reviewScore: {
      type: Number,
      required: false,
    },
    videos: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Rounds = model<IRounds, IRoundsModules>('Rounds', roundsSchema);
export default Rounds;

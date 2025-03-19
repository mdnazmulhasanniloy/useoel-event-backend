import { model, Schema } from 'mongoose';
import { IAssignGame, IAssignGameModules } from './assignGame.interface';

const assignGameSchema = new Schema<IAssignGame>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Events', required: true },
    teamA: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamB: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rounds: { type: String, required: true },
    status: { type: String, enum: ['ongoing', 'complete'], default: 'ongoing' },
    winner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    video:{
      type:String,
      default:null
    },
    result: {
      teamA: { type: Number, required: true },
      teamB: { type: Number, required: true },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const AssignGame = model<IAssignGame, IAssignGameModules>(
  'AssignGame',
  assignGameSchema,
);
export default AssignGame;

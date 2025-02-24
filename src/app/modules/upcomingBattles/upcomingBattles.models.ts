import { model, Schema } from 'mongoose';
import {
  IUpcomingBattles,
  IUpcomingBattlesModules,
} from './upcomingBattles.interface';

const upcomingBattlesSchema = new Schema<IUpcomingBattles>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamName: { type: String, required: true },
    teamMember: {
      type: Number,
      required: true,
    },
    ageGroup: { type: String, required: true },
    coachEmail: { type: String, required: true },
    score: { type: String, required: true },
    video: [{ type: String, default: '' }],
    isDeleted:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);

const UpcomingBattles = model<IUpcomingBattles, IUpcomingBattlesModules>(
  'UpcomingBattles',
  upcomingBattlesSchema,
);
export default UpcomingBattles;

import { model, Schema } from 'mongoose';
import {
  IJoiningRequests,
  IJoiningRequestsModules,
} from './joiningRequests.interface';

const joiningRequestsSchema = new Schema<IJoiningRequests>(
  {
    player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    status: {
      type: String,
      enum: ['pending', 'accept', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const JoiningRequests = model<IJoiningRequests, IJoiningRequestsModules>(
  'JoiningRequests',
  joiningRequestsSchema,
);
export default JoiningRequests;

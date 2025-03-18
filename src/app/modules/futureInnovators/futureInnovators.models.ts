
import { model, Schema } from 'mongoose';
import { IFutureInnovators, IFutureInnovatorsModules } from './futureInnovators.interface';

const futureInnovatorsSchema = new Schema<IFutureInnovators>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Events', required: true },
    teamName: { type: String, required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Schema.Types.Boolean, default: false },
  },
  { timestamps: true },
);



const FutureInnovators = model<IFutureInnovators, IFutureInnovatorsModules>(
  'FutureInnovators',
  futureInnovatorsSchema
);
export default FutureInnovators;

import { model, Schema } from 'mongoose';
import { IFutureEngineers, IFutureEngineersModules } from './futureEngineers.interface';

const futureEngineersSchema = new Schema<IFutureEngineers>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Events', required: true },
    teamName: { type: String, required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Schema.Types.Boolean, default: false },
  },
  { timestamps: true },
);



const FutureEngineers = model<IFutureEngineers, IFutureEngineersModules>(
  'FutureEngineers',
  futureEngineersSchema
);
export default FutureEngineers;
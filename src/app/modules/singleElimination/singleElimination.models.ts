
import { model, Schema } from 'mongoose';
import { ISingleElimination, ISingleEliminationModules } from './singleElimination.interface';

const singleEliminationSchema = new Schema<ISingleElimination>(
  {
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  }
);



const SingleElimination = model<ISingleElimination, ISingleEliminationModules>(
  'SingleElimination',
  singleEliminationSchema
);
export default SingleElimination;
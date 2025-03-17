import { model, Schema } from 'mongoose';
import { IRobomission, IRobomissionModules } from './robomission.interface'; 

const RobomissionSchema = new Schema<IRobomission>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Events', required: true },
    teamName: { type: String, required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Schema.Types.Boolean, default: false },
  },
  { timestamps: true },
);

 


const Robomission = model<IRobomission, IRobomissionModules>(
  'Robomission',
  RobomissionSchema,
);
export default Robomission;

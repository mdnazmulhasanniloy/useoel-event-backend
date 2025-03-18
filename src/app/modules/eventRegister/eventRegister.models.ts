import { model, Schema } from 'mongoose';
import {
  IEventRegister,
  IEventRegisterModules,
} from './eventRegister.interface';

const eventRegisterSchema = new Schema<IEventRegister>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Events',
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    coach: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
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

const EventRegister = model<IEventRegister, IEventRegisterModules>(
  'EventRegister',
  eventRegisterSchema,
);
export default EventRegister;

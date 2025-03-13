import { model, Schema } from 'mongoose';
import { IEvents, IEventsModules } from './events.interface';
import { category, EVENT_STATUS } from './events.constants';

 

const eventsSchema = new Schema<IEvents>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, enum: category, required: true },
    ageGroup: { type: String, required: true },
    scoringStyle: { type: String, required: true }, 
    roles: { type: String, required: true },
    status: {
      type: String,
      enum: ['continue', 'upcoming', 'cancelled', 'complete'],
      default: EVENT_STATUS.UPCOMING,
    },
    registrationStartTime: { type: String, required: true },
    registrationEndTime: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    rounds: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Events = model<IEvents, IEventsModules>('Events', eventsSchema);
export default Events;

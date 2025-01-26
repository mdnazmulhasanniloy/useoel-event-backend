import { model, Schema } from 'mongoose';
import { IEvents, IEventsModules, IRound } from './events.interface';
import { category, EVENT_STATUS } from './events.constants';

const RoundSchema = new Schema<IRound>({
  roundName: { type: String, required: true },
  startDate: { type: String, required: true },
  startTime: { type: String, required: true },
  totalTime: { type: String, required: true },
});

const eventsSchema = new Schema<IEvents>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, enum: category, required: true },
    ageGroup: { type: String, required: true },
    scoringStyle: { type: String, required: true },
    Round: { type: Number, required: true },
    roles: { type: String, required: true },
    status: {
      type: String,
      enum: ['continue', 'upcoming', 'cancelled', 'complete'],
      default: EVENT_STATUS.UPCOMING,
    },
    registration: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      maxParticipants: { type: Number, required: true },
    },
    rounds: { type: [RoundSchema], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Events = model<IEvents, IEventsModules>('Events', eventsSchema);
export default Events;

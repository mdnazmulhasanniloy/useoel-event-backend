import { model, Schema, Types } from 'mongoose';
import { IEvents, IEventsModules } from './events.interface';
import { category, EVENT_STATUS, GAME_TYPE } from './events.constants';

const eventsSchema = new Schema<IEvents>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, enum: category, required: true },
    ageGroup: { type: String, required: true },
    scoringStyle: { type: String, required: false },
    rules: { type: String, required: true },
    gameType: {
      type: String,
      enum: GAME_TYPE,
      default: null,
    },
    status: {
      type: String,
      enum: ['continue', 'upcoming', 'cancelled', 'complete'],
      default: EVENT_STATUS.UPCOMING,
    },
    registrationStartTime: { type: String, required: true },
    registrationEndTime: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    remainingParticipants: { type: Number },
    rounds: { type: Number, default: 1 },
    registered: [{ type: Types.ObjectId, ref: 'User', default: null }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

eventsSchema.pre('save', function (next) {
  if (this.isNew && this.remainingParticipants === undefined) {
    this.remainingParticipants = this.maxParticipants;
  }
  next();
});

const Events = model<IEvents, IEventsModules>('Events', eventsSchema);
export default Events;

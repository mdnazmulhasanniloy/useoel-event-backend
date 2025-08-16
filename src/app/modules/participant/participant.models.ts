import { model, Schema, Types } from 'mongoose';
import { IParticipant, IParticipantModules } from './participant.interface';

const participantSchema = new Schema<IParticipant>(
  {
    match: {
      type: Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    resultText: {
      type: String,
      default: null,
    },
    isWinner: { type: Boolean, default:false },
    status: { type: String, default: null },
    team: {
      type: Types.ObjectId,
      ref: 'Team',
      require: false,default: null
    },
  },
  {
    timestamps: true,
  },
);

const Participant = model<IParticipant, IParticipantModules>(
  'Participant',
  participantSchema,
);
export default Participant;

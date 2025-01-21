import { model, Schema, Types } from 'mongoose';
import { ITeam, ITeamModules, ITeamPlayer } from './team.interface';

const TeamPlayerSchema = new Schema<ITeamPlayer>({
  name: { type: String, required: true },
  email: { type: String, required: true, trim: true },
  image: { type: String, required: true },
});

const teamSchema = new Schema<ITeam>(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true }, // Automatically generated
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    teamCategory: { type: String, required: true },
    ageGroup: { type: String, required: true }, 
    logo: { type: String, required: true },
    player: { type: [TeamPlayerSchema], required: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Team = model<ITeam, ITeamModules>('Team', teamSchema);
export default Team;

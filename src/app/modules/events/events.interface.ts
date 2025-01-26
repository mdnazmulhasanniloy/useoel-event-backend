
import { Model } from 'mongoose';
 
export interface IRound{
    roundName: string;
    startDate: string;
    startTime: string;
    totalTime: string;
}
export interface IEvents {
    image:string;
    name:string;
    category:string;
    ageGroup:string;
    scoringStyle:string;
    status:string
    Round:Number;
    roles:string ;
    registration:{
        startTime:string;
        endTime:string;
        maxParticipants:number;
    },
    rounds:IRound[]
    isDeleted: boolean;

}

export type IEventsModules = Model<IEvents, Record<string, unknown>>;
import { Model, ObjectId, Types } from 'mongoose';

export interface IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;
  _id?: Types.ObjectId;
  status: string;
  name: string;
  email: string;
  phoneNumber: string;
  profile: string;
  role: string;
  gender: string;
  password: string;
  address?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  signUpStyle: string;
  isDeleted: boolean;
  expireAt: Date;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };

  //additional fields
  team: ObjectId;

  available: boolean;
  specializationAreas: string[];
  skills: string[];
  videos: string[];
  experience: string;
  preferenceCategory: string;
  ageGroup: string;
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

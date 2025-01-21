import { Model, Types } from 'mongoose';

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
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>; 

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

import { Error, Query, Schema, Types, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './user.interface';
import { GENDER, Role, USER_ROLE } from './user.constants';

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    gender: {
      type: String,
      enum: GENDER,
      default: null,
    },
    profile: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Role,
      default: USER_ROLE.user,
    },
    address: {
      type: String,
      default: null,
    },

    //auth section
    needsPasswordChange: {
      type: Boolean,
    },
    passwordChangedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    verification: {
      otp: {
        type: Schema.Types.Mixed,
        default: 0,
      },
      expiresAt: {
        type: Date,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
    expireAt: {
      type: Date,
      default: () => {
        const expireAt = new Date();

        // return expireAt.setHours(expireAt.getHours() + 48);
        return expireAt.setMinutes(expireAt.getMinutes() + 20);
      },
    },

    //additional
    team: {
      type: Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    available: { type: Boolean, default: false },
    specializationAreas: { type: [String], required: false },
    skills: { type: [String], required: false },
    videos: { type: [String], required: false },
    experience: { type: String, default: null },
    preferenceCategory: { type: String, required: false },
    ageGroup: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);

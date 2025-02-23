import { model, Schema } from 'mongoose';
import { IPackage, IPackageModel } from './packages.interface';

const PackageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true },
    shortTitle: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    popularity: { type: Number, default: 0 },
    durationDay: {
      type: Number,
      required: true,
      min: 1,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

PackageSchema.pre('find', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

PackageSchema.pre('findOne', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

PackageSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Package = model<IPackage, IPackageModel>('Package', PackageSchema);

export default Package;

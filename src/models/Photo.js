import { Schema, model } from 'mongoose';

const Photo = new Schema({
  usageCount: Number,
  favorite: Number,
  url: String,
  deletedAt: Date,
  width: Number,
  height: Number,
  ownerId: Schema.Types.ObjectId
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  }
})

Photo.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true
})

export default model('Photo', Photo);


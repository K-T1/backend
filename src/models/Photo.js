import { Schema, model } from 'mongoose';

const Photo = new Schema({
  usageCount: Number,
  url: String,
  deletedAt: Date,
  ownerId: Schema.Types.ObjectId
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  }
})

export default model('Photo', Photo);


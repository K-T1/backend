import { Schema, model } from 'mongoose';

const User = new Schema({
  count: Number,
  url: String,
  deletedAt: Date,
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  }
})

export default model('User', User);


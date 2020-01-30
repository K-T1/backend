import { Schema, model } from 'mongoose';

const User = new Schema({
  displayName: String,
  displayImage: String,
  email: String,
  password: String,
  favorite: [Schema.Types.ObjectId],
}, {
  toObject: {
    virtuals: true,
  }
})

export default model('User', User);


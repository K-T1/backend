import { Schema, model } from 'mongoose';

const User = new Schema({
  displayName: String,
  displayImage: String,
  email: String,
  password: String,
  uid: String,
  favoritePhotos: [Schema.Types.ObjectId],
  photos: [Schema.Types.ObjectId]
}, {
  toObject: {
    virtuals: true,
  }
})

export default model('User', User);


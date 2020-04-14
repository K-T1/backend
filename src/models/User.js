import { Schema, model } from 'mongoose';

const User = new Schema({
  displayName: String,
  displayImage: {
    type: String,
    required: false
  },
  email: String,
  password: String,
  uid: String,
  favoritePhotos: [],
  photos: []
}, {
  toObject: {
    virtuals: true,
  }
})

export default model('User', User);


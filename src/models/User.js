import { Schema, model } from 'mongoose';

const User = new Schema({
  username: String,
  email: String,
  password: String,
})

export default model('User', User);


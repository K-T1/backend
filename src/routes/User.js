import express from 'express'
import User from '../models/User'

const router = express.Router();

router.get('/', async (req, res) => {  
  const users = await User.find({});
  res.send(users);
});

router.post('/register', (req, res) => {
  const user = new User({
    username: 'Mark',
    password: 'Kuy',
    email: 'mark@mail.com',
  })
  user.save();
  res.send(200, user);
})

export default router;

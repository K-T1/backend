import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import validator from '../../validation'

const router = express.Router();

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

router.get('/', async (req, res) => {  
  const users = await User.find({});
  if (!users) {
    res.send(404, 'users not found');
  }
  const response = users.map( user => user.toObject({ virtuals: true }))
  res.send(response);
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
    res.send(user.toObject({ virtuals: true }));
  } catch (error) {
    res.send(404, 'user not found');
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.body.uid })
    res.send(user.toObject({ virtuals: true }));
  } catch (error) {
    res.send(404, 'user not found');
  }
})

router.post('/register', async (req, res) => {
  try {
    await validator.validateAll(req.body, {
      displayName: 'required|string',
      password: 'required|string',
      email: 'required|string',
      uid: 'required|string'
    })
    // Check duplicated displayname
    const duplicatedUser = await User.findOne({ displayName: req.body.displayName })
    if(duplicatedUser) {
      res.send(422, 'This display name is already used')
    } else if(!validateEmail(req.body.email)) {
      res.send(422, 'Invalid format')
    } else {
      // Hash password
      const password = await hashPassword(req.body.password)
      const user = new User({
        displayName: req.body.displayName,
        password: password,
        email: req.body.email,
        displayImage: req.body.displayImage,
        uid: req.body.uid
      })
      await user.save()
      res.send(200, user.toObject({ virtuals: true }))
    }
  } catch (error) {
    res.send(422, error);
  }
})

router.put('/edit/:userId', async (req, res) => {
  const user = await User.findOne({_id: req.params.userId})
  if (!user) {
    res.send(400, 'User not found')
    return;
  }
  if (req.body.email) {
    if (!validateEmail(req.body.email)) {
      res.send(422,'Invalid format')
      return;
    }
  }
  user.displayName = req.body.displayName || user.displayName
  user.email = req.body.email || user.email
  user.password = req.body.password || user.password
  user.uid = req.body.uid || user.uid
  user.displayImage = req.body.displayImage || user.displayImage

  await user.save()
  res.send(200, user.toObject({ virtuals: true }))
})

export default router;

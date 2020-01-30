import express from 'express'
import User from '../models/User'
import validator from '../../validation'

const router = express.Router();

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
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

router.post('/register', async (req, res) => {
  try {
    await validator.validateAll(req.body, {
      displayName: 'required|string',
      password: 'required|string',
      email: 'required|string'
    })
    // Check duplicated displayname
    const duplicatedUser = await User.findOne({ displayName: req.body.displayName })
    if(duplicatedUser) {
      res.send(422, 'This display name is already used')
    } else if(!validateEmail(req.body.email)) {
      console.log('in');
      res.send(422, 'Invalid format')
    } else {
      const user = new User({
        displayName: req.body.displayName,
        password: req.body.password,
        email: req.body.email,
        displayImage: req.body.displayImage
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
  user.displayName = req.body.displayName || user.displayName,
  user.email = req.body.email || user.email,
  user.password = req.body.password || user.password

  await user.save()
  res.send(200, user.toObject({ virtuals: true }))
})

export default router;

import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import validator from '../../validation'
import Photo from '../models/Photo';
import withAuth from '../middlewares/withAuth';

const router = express.Router();

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export const findUserByUserId = async (uid) => {
  const user = await User.findOne({ uid }, { password: 0 })
  const photos = await Photo.find({ $and: [{ ownerId: user._id }, { deletedAt: null }] })
  user.favoritePhotos = await Photo.find({ deletedAt: null }).where('_id').in(user.favoritePhotos).exec()
  await Promise.all(user.favoritePhotos.map(photo => photo.populate('owner').execPopulate()))
  user.photos = photos.reverse()

  return user
}

// router.get('/', async (req, res) => {
//   const users = await User.find({});
//   if (!users) {
//     res.send(404, 'users not found');
//   }
//   const response = await Promise.all(users.map(async (user) => {
//     const photos = await Photo.find({ ownerId: user._id })
//     user.favoritePhotos = await Photo.find().where('_id').in(user.favoritePhotos).exec()
//     await Promise.all(user.favoritePhotos.map(photo => photo.populate('owner').execPopulate()))
//     user.photos = photos.reverse()
//     return user.toObject({ virtuals: true })
//   }))
//   res.send(response);
// });

router.get('/current', withAuth, async (req, res) => {
  if (req.user) {
    return res.send(200, req.user.toObject({ virtuals: true }))
  }
  res.sendStatus(401)
})

router.get('/:userId', async (req, res) => {
  try {
    const user = await findUserByUserId(req.params.userId)
    res.send(user.toObject({ virtuals: true }));
  } catch (error) {
    res.send(404, 'user not found');
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await findUserByUserId(req.body.uid)
    res.send(user.toObject({ virtuals: true }));
  } catch (error) {
    res.send(404, 'user not found');
  }
})

router.post('/register', async (req, res) => {
  try {
    if (!req.body.uid) {
      return res.send(422, 'uid is required')
    }
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
  } catch (error) {
    res.send(422, error);
  }
})

router.post('/register/validate', async (req, res) => {
  try {
    const data = req.body
    let error = {}

    if (!data.displayName) {
      error.displayName = 'This field is required'
    } else {
      const duplicatedUser = await User.findOne({ displayName: data.displayName })
      if (duplicatedUser) {
        error.displayName = 'This display name is already used';
      }
    }

    if (!data.email) {
      error.email = 'This field is required'
    } else if (!validateEmail(data.email)) {
      error.email = 'Invalid format';
    } else {
      const duplicatedUser = await User.findOne({ email: data.email })
      if (duplicatedUser) {
        error.email = 'This email is already used';
      }
    }

    if (!data.password) {
      error.password = 'This field is required';
    } else if (data.password.length < 6) {
      error.password = 'Password must be longer than 6 characters'
    }

    if (error.displayName || error.email || error.password) {
      return res.send(422, error)
    }
    return res.send(200, 'Pass')
  } catch (error) {
    res.send(422, error);
  }
})

router.put('/edit/:userId', async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId })
  if (!user) {
    return res.send(400, 'User not found')
  }
  if (req.body.email) {
    if (!validateEmail(req.body.email)) {
      return res.send(422, 'Invalid format')
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

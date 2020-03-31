import firebaseAdmin from '../firebaseAdmin'

import User from '../models/User'
import Photo from '../models/Photo'

const auth = firebaseAdmin.auth()

const decodeToken = async (req) => {
  let decodedToken

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    decodedToken = await auth.verifyIdToken(req.headers.authorization.split('Bearer ')[1])
  }
  return decodedToken
}

export default async (req, res, next) => {
  // TODO: Handle no bearer
  const decodedToken = await decodeToken(req)
  if (decodedToken) {
    const user = await User.findOne({ uid: decodedToken.uid })
    user.photos = await Photo.find({ ownerId: user._id })
    user.favoritePhotos = await Photo.find().where('_id').in(user.favoritePhotos).exec()
    // user.photos.map(photo => ({ ...photo, owner: user }))

    await Promise.all(user.favoritePhotos.map(photo => photo.populate('owner').execPopulate()))

    req.user = user
  }
  return next()
}

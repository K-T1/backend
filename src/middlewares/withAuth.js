import firebaseAdmin from '../firebaseAdmin'

import User from '../models/User'

const auth = firebaseAdmin.auth()

const decodeToken = async (req) => {
  let decodedToken

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      decodedToken = await auth.verifyIdToken(req.headers.authorization.split('Bearer ')[1])
    }
  } catch (error) {
    console.log(error);
  }
  return decodedToken
}

export default async (req, res, next) => {
  // TODO: Handle no bearer
  const decodedToken = await decodeToken(req)
  const user = await User.findOne({ uid: decodedToken.uid })
  req.user = user
  return next()
}

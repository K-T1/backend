import express from 'express'
import Photo from '../models/Photo'
import validator from '../../validation'
import { modelPaginator } from '../../pagination'
import User from '../models/User';
import withAuth from '../middlewares/withAuth';

const router = express.Router();

const createPhoto = (req, ownerId) => {
  const photo = new Photo({
    ownerId,
    url: req.url,
    width: req.width,
    height: req.height,
    deletedAt: null,
    usageCount: 0,
    favorite: 0,
  })
  return photo
}

const validateUrl = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

router.get('/', withAuth, async (req, res) => {
  let photos = await Photo.paginate(
    {
      deletedAt: null
    },
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sort: { createdAt: -1 }
    })

  const population = photos.docs.map(photo => photo.populate('owner').execPopulate())
  await Promise.all(population)

  const paginate = modelPaginator(photos)

  paginate.data = paginate.data.map(photo => {
    return {
      viewerLiked: req.user ? req.user.favoritePhotos.some(favPhoto => favPhoto.id === photo.id) : false,
      ...photo.toObject({ virtuals: true })
    }
  })

  res.send(200, paginate)
})

router.get('/:photoId', async (req, res) => {
  const photo = await Photo.findOne({ $and: [{ _id: req.params.photoId }, { deletedAt: null }] })
  if (!photo) {
    res.send(400, 'Photo not found')
    return
  }
  await photo.populate('owner').execPopulate()
  res.send(200, photo.toObject({ virtuals: true }))
})

router.post('/upload', withAuth, async (req, res) => {
  if (req.user) {
    if (!validateUrl(req.body.url)) {
      return res.send(422, 'URL is invalid')
    }
    if (!(req.body.width && req.body.height)) {
      return res.send(422, 'Width and height is required.')
    }
    const photo = createPhoto(req.body, req.user.id)
    await photo.save()
    return res.send(200, photo.toObject({ virtuals: true }))
  }
  res.sendStatus(401)
})

router.post('/process', async (req, res) => {
  if (req.user) {
    if (!validateUrl(req.body.url)) {
      return res.send(422, 'URL is invalid')
    }
    const original = await Photo.findOne({ _id: req.body.originalId })
    if (!original) {
      res.send(400, 'Photo not found')
      return
    }
    original.usageCount += 1
    await original.save()
    // TODO: Implement python
    // const photo = createPhoto(req.body, req.user.id)
    // await photo.save()
    return res.send(200, original.toObject({ virtuals: true }))
  }
  res.sendStatus(401)
})

router.delete('/delete/:photoId', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.photoId })
  if (!photo) {
    res.send(400, 'Photo not found')
    return
  }
  photo.deletedAt = new Date();
  await photo.save()
  res.send(200, 'Removed!')
})

router.put('/fav', withAuth, async (req, res) => {
  if (req.user) {
    const photo = await Photo.findOne({ $and: [{ _id: req.params.photoId }, { deletedAt: null }] })
    const user = await User.findOne({ _id: req.user.id })
    if (!photo) {
      res.send(400, 'Photo not found')
      return
    }
    if (!user) {
      res.send(400, 'User not found')
      return
    }
    // photo.likedUser.push(user._id)
    photo.favorite += 1
    user.favoritePhotos.push(photo._id)
    await photo.save()
    await user.save()
    return res.send(200, photo.toObject({ virtuals: true }))
  }
  res.sendStatus(401)
})

router.put('/unfav', withAuth, async (req, res) => {
  if (req.user) {
    const photo = await Photo.findOne({ $and: [{ _id: req.params.photoId }, { deletedAt: null }] })
    const user = await User.findOne({ _id: req.user.id })
    if (!photo) {
      res.send(400, 'Photo not found')
      return
    }
    if (!user) {
      res.send(400, 'User not found')
      return
    }
    photo.favorite -= 1

    const photoIndex = user.favoritePhotos.indexOf(photo._id)
    if (photoIndex >= 0) {
      user.favoritePhotos.splice(photoIndex, 1);
    }

    await photo.save()
    await user.save()
    return res.send(200, photo.toObject({ virtuals: true }))
  }
  res.sendStatus(401)
})

export default router

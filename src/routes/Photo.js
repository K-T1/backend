import express from 'express'
import Photo from '../models/Photo'
import validator from '../../validation'
import { modelPaginator } from '../../pagination'
import User from '../models/User';

const router = express.Router();

const createPhoto = (req) => {
  const photo = new Photo({
    url: req.url,
    ownerId: req.ownerId,
    width: req.width,
    height: req.height,
    deletedAt: null,
    usageCount: 0,
    favorite: 0,
  })
  return photo
}

const validateUrl = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

router.get('/', async (req, res) => {
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
  paginate.data = paginate.data.map(photo => photo.toObject({ virtuals: true }))

  res.send(200, paginate)
})

router.get('/:photoId', async (req, res) => {
  const photo = await Photo.findOne({ $and:[{ _id: req.params.photoId }, { deletedAt: null }]})
  if(!photo) {
    res.send(400, 'Photo not found')
    return
  }
  await photo.populate('owner').execPopulate()
  res.send(200, photo.toObject({ virtuals: true }))
})

router.post('/upload', async (req, res) => {
  if (!validateUrl(req.body.url)) {
    res.send(422, 'URL is invalid')
    return
  }
  if (!req.body.ownerId) {
    res.send(422, 'OwnerId is required')
    return
  }
  const photo = createPhoto(req.body)
  await photo.save()
  res.send(200, photo.toObject({ virtuals: true }))
})

router.post('/process', async (req, res) => {
  if (!validateUrl(req.body.url)) {
    console.log('in');
    res.send(422, 'URL is invalid')
    return
  }
  const original = await Photo.findOne({ _id: req.body.originalId})
  if(!original) {
    res.send(400, 'Photo not found')
    return
  }
  original.usageCount += 1
  await original.save()
  const photo = createPhoto(req.body)
  await photo.save()
  res.send(200, photo.toObject({ virtuals: true }))
})

router.delete('/delete/:photoId', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.photoId })
  if(!photo) {
    res.send(400, 'Photo not found')
    return
  }
  photo.deletedAt = new Date();
  await photo.save()
  res.send(200, 'Removed!')
})

router.put('/fav', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.body.photoId })
  const user = await User.findOne({ _id: req.body.userId})
  if (!photo) {
    res.send(400, 'Photo not found')
    return
  }
  if (!user) {
    res.send(400, 'User not found')
    return
  }
  photo.favorite += 1
  user.favoritePhotos.push(photo._id)
  await photo.save()
  await user.save()
  res.send(200, photo.toObject({ virtuals: true }))
})

router.put('/unfav', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.body.photoId })
  const user = await User.findOne({ _id: req.body.userId})
  if (!photo) {
    res.send(400, 'Photo not found')
    return
  }
  if (!user) {
    res.send(400, 'User not found')
    return
  }
  photo.favorite -= 1

  const index = user.favoritePhotos.indexOf(photo._id)
  if (index >= 0) {
    user.favoritePhotos.splice(index, 1);
  }

  await photo.save()
  await user.save()
  res.send(200, photo.toObject({ virtuals: true }))
})

export default router

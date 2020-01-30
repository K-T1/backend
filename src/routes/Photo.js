import express from 'express'
import Photo from '../models/Photo'
import validator from '../../validation'
import { modelPaginator } from '../../pagination'

const router = express.Router();

function createPhoto(req) {
  const photo = new Photo({
    url: req.url,
    ownerId: req.ownerId,
    width: req.width,
    height: req.height,
    deletedAt: null,
    usageCount: 0
  })
  return photo
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
  photos = modelPaginator(photos)
  photos.data = photos.data.map(photo => photo.toObject({ virtuals: true }))
  res.send(200, photos)
})

router.get('/:photoId', async (req, res) => {
  const photo = await Photo.findOne({ $and:[{ _id: req.params.photoId }, { deletedAt: null }]})
  if(!photo) {
    res.send(400, 'Photo not found')
    return
  }
  res.send(200, photo.toObject({ virtuals: true }))
})

router.post('/upload', async (req, res) => {
  //TODO: Check url
  const photo = createPhoto(req.body)
  await photo.save()
  res.send(200, photo.toObject({ virtuals: true }))
})

router.post('/process', async (req, res) => {
  const original = await Photo.findOne({ _id: req.body.originalId})
  if(!original) {
    res.send(400, 'Photo not found')
    return
  }
  original.usageCount += 1
  await original.save()
  //TODO: Check url
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

router.put('/fav/:photoId', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.photoId })
  if (!photo) {
    res.send(400, 'Photo not found')
    return
  }
  photo.favorite += 1
  await photo.save()
  res.send(200, photo.toObject({ virtuals: true }))
})

router.put('/unfav/:photoId', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.photoId })
  if (!photo) {
    res.send(400, 'Photo not found')
    return
  }
  photo.favorite -= 1
  await photo.save()
  res.send(200, photo.toObject({ virtuals: true }))
})

export default router

import express from 'express'
import { PythonShell } from 'python-shell'
import { readFile, remove } from 'fs-extra'
import { v4 as uuidv4 } from 'uuid'

import admin from '../firebaseAdmin'
import Photo from '../models/Photo'
import validator from '../../validation'
import { modelPaginator } from '../pagination'
import User from '../models/User';
import withAuth, { decodeToken } from '../middlewares/withAuth';

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

const getPublicFirebaseUrl = (fileName, firebaseStorageDownloadTokens) => 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UploadPhoto%2F' + fileName + '?alt=media&token=' + firebaseStorageDownloadTokens

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
    return res.send(400, 'Photo not found')
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
  const bucket = admin.storage().bucket()
  const firebaseStorageDownloadTokens = uuidv4()
  const sourcePath = req.files.source.tempFilePath
  const referencePath = req.files.reference.tempFilePath
  const fileName = uuidv4() + '.jpg'
  const filePath = `tmp/${fileName}`

  PythonShell.run('./src/color_transferring.py', {
    pythonOptions: ['-u'],
    args: [`${sourcePath}`, `${referencePath}`, `${filePath}`]
  }, async (err) => {
    await remove(sourcePath)
    await remove(referencePath)
    if (err) return res.status(400).send(err)

    bucket.upload(filePath, {
      destination: `UploadPhoto/${fileName}`,
      metadata: { metadata: { firebaseStorageDownloadTokens } }
    }, async (err) => {
      await remove(filePath)
      if (err) return res.send(400, err);

      const url = getPublicFirebaseUrl(fileName, firebaseStorageDownloadTokens)
      const referencePhotoId = req.body.referenceId

      if (referencePhotoId != 'undefined') {
        const sourcePhoto = await Photo.findOne({ _id: referencePhotoId })
        if (!sourcePhoto) return res.send(400, 'Photo not found')

        sourcePhoto.usageCount += 1
        await sourcePhoto.save()
      }
      res.send(200, url)
    })
  })
})

router.delete('/delete/:photoId', withAuth, async (req, res) => {
  if (req.user) {
    const photo = await Photo.findOne({ _id: req.params.photoId })
    if (!photo) return res.send(400, 'Photo not found')
    if (photo.ownerId != req.user.id) return res.status(401).send('Can\'t delete other user photo')
    photo.deletedAt = new Date();
    await photo.save()
    return res.send(200, 'Removed!')
  }
  res.sendStatus(401)
})

router.put('/fav', async (req, res) => {
  const decodedToken = await decodeToken(req)
  if(!decodedToken) return res.send(401)
  const photo = await Photo.findOne({ $and: [{ _id: req.body.photoId }, { deletedAt: null }] })
  const user = await User.findOne({ uid: decodedToken.uid }, { password: 0 })
  if (!photo) {
    return res.send(400, 'Photo not found')
  }
  if (!user) {
    return res.send(400, 'User not found')
  }

  photo.favorite += 1
  user.favoritePhotos.push(photo._id)
  await photo.save()
  await user.save()

  return res.send(200, photo.toObject({ virtuals: true }))
})

router.put('/unfav', async (req, res) => {
  const decodedToken = await decodeToken(req)
  if(!decodedToken) return res.send(401)
  const photo = await Photo.findOne({ $and: [{ _id: req.body.photoId }, { deletedAt: null }] })
  const user = await User.findOne({ uid: decodedToken.uid }, { password: 0 })
  if (!photo) {
    return res.send(400, 'Photo not found')
  }
  if (!user) {
    return res.send(400, 'User not found')
  }
  if(photo.favorite > 0) {
    photo.favorite -= 1
  }
  
  const photoIndex = user.favoritePhotos.indexOf(photo._id)
  
  if (photoIndex >= 0) {
    user.favoritePhotos.splice(photoIndex, 1);
  }

  await photo.save()
  await user.save()
  return res.send(200, photo.toObject({ virtuals: true }))
})

export default router

const axios = require('axios')

const photos = [
  {
    usageCount: 0,
    favorite: 0,
    url: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UploadPhoto%2F1096186.jpg?alt=media&token=5c3650ba-9b78-4ad9-9e03-e46a1907ff39',
    deletedAt: null,
    width: 1025,
    height: 769,
    ownerId: '5e831786acde786f9dfb865c',
  },
  {
    usageCount: 0,
    favorite: 0,
    url: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UploadPhoto%2F1096191.jpg?alt=media&token=c538406b-e212-408f-93b5-a39a55e36546',
    deletedAt: null,
    width: 576,
    height: 769,
    ownerId: '5e831786acde786f9dfb865d',
  },
  {
    usageCount: 0,
    favorite: 0,
    url: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UploadPhoto%2F1096207.jpg?alt=media&token=78c36051-8b03-41fd-9475-66cc33e4c282',
    deletedAt: null,
    width: 512,
    height: 768,
    ownerId: '5e831786acde786f9dfb865e',
  }
]

photos.forEach(async (photo) => {
  await axios.post('http://localhost:3000/photo/upload', photo)
})

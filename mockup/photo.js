const axios = require('axios')

const photos = [
  {
    usageCount: 0,
    favorite: 0,
    url: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2FCC95F08C-88C3-4012-9D6D-64A413D254B3-L0-001?alt=media&token=cb3f64ba-0f88-4f2f-97e4-5d49541a8380',
    deletedAt: null,
    width: 1920,
    height: 1080,
    ownerId: '5e32936649ab3e2beeb75490',
  },
  {
    usageCount: 0,
    favorite: 0,
    url: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2FCC95F08C-88C3-4012-9D6D-64A413D254B3-L0-001?alt=media&token=cb3f64ba-0f88-4f2f-97e4-5d49541a8380',
    deletedAt: null,
    width: 1920,
    height: 1080,
    ownerId: '5e32936649ab3e2beeb75490',
  },
  {
    usageCount: 0,
    favorite: 0,
    url: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2FCC95F08C-88C3-4012-9D6D-64A413D254B3-L0-001?alt=media&token=cb3f64ba-0f88-4f2f-97e4-5d49541a8380',
    deletedAt: null,
    width: 1920,
    height: 1080,
    ownerId: '5e32936649ab3e2beeb75490',
  }
]

photos.forEach(async (photo) => {
  await axios.post('http://localhost:3000/photo/upload', photo)
})

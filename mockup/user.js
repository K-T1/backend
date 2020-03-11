const axios = require('axios')

const users = [
  {
    favoritePhotos: [],
    photos: [],
    favorite: [],
    displayName: "admin",
    password: "$2b$10$lsGvMs0F42VRNnNvg2glDujsow0VGsw5k/AhTrOPnU2AI4HGDhfU6",
    email: "admin@gmail.com",
    displayImage: "https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2F24?alt=media&token=8459202b-262d-4e40-a938-cc207fb0a976",
    uid: "O0SM3hgUTVMvZx9JXnqcAMsskRf1",
  },
  {
    favoritePhotos: [],
    photos: [],
    displayName: "mark",
    password: "$2b$10$Qo3SLx7D/0gxJzSq0Z3fvukBri9tuP9qXOmglHKpKqhSmuTMyACIq",
    email: "mark@gmail.com",
    displayImage: "https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2F28?alt=media&token=f527c953-70ae-49d0-bc29-d250f0525b2a",
    uid: "d2HK2wsOcqPNqeqHZOzaecKcRj73",
  },
  {
    favoritePhotos: [],
    photos: [],
    displayName: "yo",
    password: "$2b$10$q/9f7BcKKB9kSVjX61ZPzOVvGdhmp3YiSfSe9HnzwYsXrIwOtbyPa",
    email: "yo@gmail.com",
    displayImage: "https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2F27?alt=media&token=7dcdcf01-6386-47d0-98dd-33388c349971",
    uid: "kcT5W7u0BtOtDiSeNrlDwstPYZQ2",
  },
  {
    favoritePhotos: [],
    photos: [],
    displayName: "map",
    password: "$2b$10$.NsVBya.krL1ekbIb/hrTeFOeDb7Fhze3JeJwEmW.nGQoUm0OToCO",
    email: "map@gmail.com",
    displayImage: "https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2F25?alt=media&token=fc811c6d-34a7-4d15-aea8-decfa58c826a",
    uid: "SZU2jQJbVMV7xmjPir1QpEkwQLS2",
  }
]

users.forEach(async (user) => {
  await axios.post('http://localhost:3000/users/register', user)
})

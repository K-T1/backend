const axios = require('axios')

const users = [
  {
    displayName: 'admin',
    displayImage: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2F24?alt=media&token=8459202b-262d-4e40-a938-cc207fb0a976',
    email: 'admin@gmail.com',
    password: '$2b$10$lsGvMs0F42VRNnNvg2glDujsow0VGsw5k/AhTrOPnU2AI4HGDhfU6',
    uid: 'O0SM3hgUTVMvZx9JXnqcAMsskRf1',
    favorite: [],
  },
]

users.forEach(async (user) => {
  await axios.post('http://localhost:3000/users/register', user)
})

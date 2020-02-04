const axios = require('axios')

const users = [
  {
    displayName: 'Mark',
    displayImage: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2FCC95F08C-88C3-4012-9D6D-64A413D254B3-L0-001?alt=media&token=cb3f64ba-0f88-4f2f-97e4-5d49541a8380',
    email: 'm@mail.com',
    password: "$2b$10$/WtEgxSvTk/XmXZ2/Um.nOE2pJHTLzvi8yHb8gS.iYkW0QRYbm.8y",
    uid: 'HmWqAMT50WMT3ygABgjzujnlsqQ2',
    favorite: [],
  },
  {
    displayName: 'map',
    displayImage: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2FCC95F08C-88C3-4012-9D6D-64A413D254B3-L0-001?alt=media&token=cb3f64ba-0f88-4f2f-97e4-5d49541a8380',
    email: 'm2@mail.com',
    password: "$2b$10$/WtEgxSvTk/XmXZ2/Um.nOE2pJHTLzvi8yHb8gS.iYkW0QRYbm.8y",
    uid: 'HmWqAMT50WMT3ygABgjzujnlsqQ3',
    favorite: [],
  },
  {
    displayName: 'yo',
    displayImage: 'https://firebasestorage.googleapis.com/v0/b/k-t1-cc7c3.appspot.com/o/UserProfile%2FCC95F08C-88C3-4012-9D6D-64A413D254B3-L0-001?alt=media&token=cb3f64ba-0f88-4f2f-97e4-5d49541a8380',
    email: 'm3@mail.com',
    password: "$2b$10$/WtEgxSvTk/XmXZ2/Um.nOE2pJHTLzvi8yHb8gS.iYkW0QRYbm.8y",
    uid: 'HmWqAMT50WMT3ygABgjzujnlsqQ4',
    favorite: [],
  }
]

users.forEach(async (user) => {
  await axios.post('http://localhost:3000/users/register', user)
})



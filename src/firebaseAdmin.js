import * as admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'k-t1-cc7c3.appspot.com'
})

export default admin

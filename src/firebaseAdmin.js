import * as admin from 'firebase-admin'

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

export default admin

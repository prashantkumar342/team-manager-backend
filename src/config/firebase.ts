import admin from 'firebase-admin';
var serviceAccount = require('./teamsync-firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firebaseAuth = admin.auth();

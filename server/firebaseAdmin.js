const admin = require("firebase-admin");

let db = null;

try {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing");
  }

  const serviceAccount = JSON.parse(raw);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
  console.log("Firestore підключено успішно");
} catch (error) {
  console.log("Firestore не підключено.");
  console.log(error.message);
}

module.exports = { admin, db };
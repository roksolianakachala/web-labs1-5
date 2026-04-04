const admin = require("firebase-admin");
const path = require("path");

let db = null;

try {
  const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
  console.log("Firestore підключено успішно");
} catch (error) {
  console.log("Firestore не підключено. Перевір serviceAccountKey.json");
  console.log(error.message);
}

module.exports = { admin, db };
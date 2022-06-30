// firebaseConfig = {
//     apiKey: "AIzaSyBDkZ7A9C_IUlqSjCF4LrBXCNwe206uze8",
//     authDomain: "leapfrog-project.firebaseapp.com",
//     projectId: "leapfrog-project",
//     storageBucket: "leapfrog-project.appspot.com",
//     messagingSenderId: "508741496705",
//     appId: "1:508741496705:web:c79cba50cf66ad499a8280",
//     measurementId: "G-9VBT728C9S"
//   };


var admin = require("firebase-admin");

var serviceAccount = require("./leapfrog-project-firebase-adminsdk-pufxl-682e7a171c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


//   firebase.initializeApp(firebaseConfig);
  const db = admin.firestore();
  const User = db.collection("Users");
  module.exports = User;
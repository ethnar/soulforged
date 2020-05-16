importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-messaging.js");

const config = {
  apiKey: "AIzaSyC75M7koUSuNQ31mNBZQGz08MsdUwQlZq4",
  authDomain: "gthegame-205009.firebaseapp.com",
  databaseURL: "https://gthegame-205009.firebaseio.com",
  projectId: "gthegame-205009",
  storageBucket: "gthegame-205009.appspot.com",
  messagingSenderId: "413606385188"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

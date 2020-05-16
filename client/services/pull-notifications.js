let messaging;

try {
  const config = {
    apiKey: "AIzaSyC75M7koUSuNQ31mNBZQGz08MsdUwQlZq4",
    authDomain: "gthegame-205009.firebaseapp.com",
    databaseURL: "https://gthegame-205009.firebaseio.com",
    projectId: "gthegame-205009",
    storageBucket: "gthegame-205009.appspot.com",
    messagingSenderId: "413606385188"
  };
  firebase.initializeApp(config);
  messaging = firebase.messaging();

  messaging.onMessage(payload => {
    console.log("onMessage:", payload);
  });
} catch (e) {
  console.error("Notifications not available");
}

export const pullNotifications = {
  init() {
    if (!messaging) {
      return new Promise(() => {});
    }
    return messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then(token => {
        return token;
      })
      .catch(error => {
        // if (error.code === 'messaging/permission-blocked') {
        //     ServerService.togglePushNotifications(null);
        //     return;
        // }
        console.error("Error occurred!", error);
      });
  }
};

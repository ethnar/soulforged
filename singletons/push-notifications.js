const admin = require("firebase-admin");
let privateKey;
try {
  privateKey = require("../.credentials/firebase-private-key.json");

  const firebaseConfig = {
    apiKey: "AIzaSyC75M7koUSuNQ31mNBZQGz08MsdUwQlZq4",
    authDomain: "gthegame-205009.firebaseapp.com",
    databaseURL: "https://gthegame-205009.firebaseio.com",
    projectId: "gthegame-205009",
    storageBucket: "",
    messagingSenderId: "413606385188",
    credential: admin.credential.cert(privateKey)
  };

  const API_KEY = "AIzaSyCwKDCib53rjz-0VUfaB1gtcqKy1xP-YYk";

  admin.initializeApp(firebaseConfig);

  const messaging = admin.messaging();

  module.exports = {
    send(player, message) {
      if (!player || !player.devices) {
        return;
      }
      Object.keys(utils.cleanup(player.devices))
        .filter(token => !!player.devices[token])
        .forEach(token => {
          messaging
            .send({
              notification: {
                title: "Soulforged",
                body: message
              },
              webpush: {
                notification: {
                  body: message,
                  click_action: "https://soulforged.net:8443/#/main"
                }
              },
              token: token
            })
            .catch(error => {
              // utils.error('Error occured!', error);
            });
        });
    }
  };

  setTimeout(() => {
    server.registerHandler("set-push-notifications", (params, player, conn) => {
      player.devices = player.devices || {};

      if (
        !params.token ||
        typeof params.token !== "string" ||
        (typeof params.enabled === "object" && params.enabled !== null) ||
        typeof params.enabled === "function"
      ) {
        return false;
      }

      player.devices[params.token] = params.enabled;

      server.sendToPlayer(player, "push-notifications", {
        token: params.token,
        enabled: params.enabled
      });

      return true;
    });

    server.registerHandler("get-push-notifications", (params, player, conn) => {
      server.sendToPlayer(player, "push-notifications", {
        token: params.token,
        enabled: (player.devices || {})[params.token]
      });
    });
  });
} catch (e) {
  setTimeout(() => {
    server.registerHandler(
      "get-push-notifications",
      (params, player, conn) => {}
    );
  });

  module.exports = {
    send() {}
  };
}

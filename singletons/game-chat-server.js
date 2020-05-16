const server = require("./server");

const messages = {
  global: [],
  player: {}
};

const pushMessage = message => {
  message.when = new Date().getTime();

  messages.global.push(message);

  server.sendUpdateToAll("chat-message", message);
};

const pushMessageToPlayer = (player, message) => {
  message.when = new Date().getTime();

  const playerId = player.getEntityId();
  messages.player[playerId] = messages.player[playerId] || [];
  messages.player[playerId].push(message);

  server.sendToPlayer(player, "chat-message", message);
};

server.registerHandler("get-chat-messages", (params, player, connection) => {
  const playerId = player.getEntityId();
  return [...messages.global, ...(messages.player[playerId] || [])];
});

setInterval(() => {
  const currentTime = new Date().getTime();
  [
    messages.global,
    ...Object.values(messages.player).filter(messages => !!messages)
  ].forEach(messagesList => {
    while (
      messagesList[0] &&
      messagesList[0].when < currentTime - 1 * DAYS * 1000
    ) {
      messagesList.shift();
    }
  });
}, 60000);

module.exports = {
  getMessages() {
    return messages;
  },

  loadMessages(savedMessages) {
    if (!Array.isArray(savedMessages)) {
      messages.global = savedMessages.global;
      messages.player = savedMessages.player;
    }
  },

  broadcast(message) {
    pushMessage({
      message
    });
  },

  sendToPlayer(player, message) {
    if (player) {
      pushMessageToPlayer(
        player,
        typeof message === "string"
          ? {
              message
            }
          : {
              ...message
            }
      );
    }
  }
};

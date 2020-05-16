const request = require("request");
const fs = require("fs");

const SLACK_URL = "https://soulforged.slack.com/";

let credentials;

try {
  credentials = JSON.parse(
    fs.readFileSync("./.credentials/slack-credentials.json")
  );
} catch (e) {
  utils.error("Unable to load Slack credentials!");
  credentials = {};
}

const channelMap = {};

function sendRequest(url, qs, multipart) {
  return new Promise((resolve, reject) => {
    const req = request({
      method: "POST",
      url: `${SLACK_URL}api/${url}`,
      json: true,
      qs: {
        token: credentials.accessToken,
        ...qs
      }
    })
      .on("response", function(response) {
        let body = "";
        response.on("data", function(chunk) {
          body += chunk;
        });
        response.on("end", function() {
          try {
            const result = JSON.parse(body.toString());
            if (result.ok) {
              resolve(result);
            } else {
              utils.error(result);
            }
          } catch (e) {
            utils.error("Invalid response", body.toString());
            reject({});
          }
        });
      })
      .on("error", function(error) {
        utils.error(error);
      });
    if (multipart) {
      const form = req.form();
      Object.keys(multipart).forEach(key => {
        form.append(key, multipart[key]);
      });
    }
  });
}

function findChannelId(channel, cursor = undefined) {
  return sendRequest("conversations.list", {
    exclude_archived: true,
    limit: 100,
    types: "private_channel",
    cursor
  }).then(response => {
    const match = response.channels.find(c => c.name === channel);
    if (!match) {
      if (
        response.response_metadata &&
        response.response_metadata.next_cursor
      ) {
        return findChannelId(channel, response.response_metadata.next_cursor);
      }
    } else {
      return match.id;
    }
  });
}

function getChannelId(channel) {
  if (channelMap[channel]) {
    return Promise.resolve(channelMap[channel]);
  }
  return sendRequest("conversations.create", {
    name: channel,
    is_private: true
  })
    .catch(() => {
      return findChannelId(channel);
    })
    .then(channelId => {
      channelMap[channel] = channelId;
      return channelId;
    });
}

function getUserId(player) {
  return sendRequest("users.lookupByEmail", {
    email: player.email,
    token: credentials.newAccessToken
  }).then(userData => userData.user.id);
}

function updateAvatar(player) {
  return getUserId(player)
    .then(userId => {
      return sendRequest(
        "users.setPhoto",
        {
          user: userId
        },
        {
          user: userId,
          image: fs.createReadStream(`./???`)
        }
      );
    })
    .catch(error => utils.error("Failed to update profile image:", error));
}

function updateName(player) {
  return getUserId(player)
    .then(userId => {
      return sendRequest("users.profile.set", {
        users: userId,
        name: "display_name",
        value: player.getName()
      });
    })
    .catch(error => utils.error("Failed to update profile name:", error));
}

module.exports = global.slack = {
  addUser(email) {
    return sendRequest("users.admin.invite", {
      email
    });
  },
  addUserToChannel(player, channel) {
    return Promise.all([getChannelId(channel), getUserId(player)])
      .then(([channelId, usedId]) => {
        return sendRequest("conversations.invite", {
          channel: channelId,
          users: usedId
        });
      })
      .catch(error => utils.error("Failed to add user to a channel:", error));
  },
  removeUserFromChannel(player, channel) {
    return Promise.all([getChannelId(channel), getUserId(player)])
      .then(([channelId, userId]) => {
        return sendRequest("conversations.kick", {
          channel: channelId,
          user: userId
        });
      })
      .catch(error =>
        utils.error("Failed to remove user from channel:", error)
      );
  },
  updateProfile(player) {
    return Promise.resolve();
    // return Promise.all([
    //     updateAvatar(player),
    //     updateName(player),
    // ]);
  },
  sendMessage(player, message) {
    if (program.dev) {
      return;
    }
    return getUserId(player)
      .then(userId => {
        return sendRequest("chat.postMessage", {
          channel: userId,
          text: message,
          username: "Notifications",
          token: credentials.newAccessToken
        });
      })
      .catch(error => utils.error("Failed to message player:", error));
  }
};

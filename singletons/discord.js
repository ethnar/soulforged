const fs = require("fs");
const Discord = require("discord.js");

global.Discord = Discord;

let credentials;
try {
  credentials = JSON.parse(fs.readFileSync("./.credentials/discord.json"));
} catch (e) {
  utils.error("Unable to load Discord credentials!");
  credentials = {};
}
global.URLSearchParams = require("url").URLSearchParams;

let timeout = 500;
let connectionTimeout;
function handleError(error) {
  utils.error("DISCORD ERROR", timeout);
  if (!connectionTimeout) {
    connectionTimeout = setTimeout(() => {
      connectionTimeout = null;
      connect();
    }, timeout);
    timeout *= 2;
    timeout = utils.limit(timeout, 0, 5 * MINUTES * IN_MILISECONDS);
  }
}

function connect() {
  if (!credentials.botToken) {
    return;
  }
  if (global.discordClient) {
    global.discordClient.destroy();
  }
  global.discordClient = new Discord.Client();
  global.discordClient.on("ready", () => {
    console.log(
      `DISCORD: Logged as ${global.discordClient.user &&
        global.discordClient.user.tag}!`
    );
  });
  global.discordClient.login(credentials.botToken).catch(handleError);

  global.discordClient.on("error", handleError);
}

if (credentials.botToken) {
  connect();
}

function getProfileId(player) {
  return player && player.discord && player.discord.id;
}

module.exports = global.discord = {
  getJoinDiscordUrl() {
    const redirectUrl = encodeURIComponent(credentials.callbackURL);
    return `https://discordapp.com/oauth2/authorize?client_id=${credentials.clientId}&scope=identify+guilds.join&response_type=code&redirect_uri=${redirectUrl}`;
  },
  addUserToChannel(player, channel) {},
  removeUserFromChannel(player, channel) {},

  removePlayer(player) {
    if (!player.discord) {
      return;
    }
    const member = global.discordClient.guilds
      .first()
      .member(player.discord.id);

    if (!member) {
      player.lastDiscord = player.discord;
      delete player.discord;
      return Promise.resolve();
    }

    return member.kick().then(() => {
      player.lastDiscord = player.discord;
      delete player.discord;
    });
  },
  updateProfile(player) {
    if (!global.discordClient) {
      return;
    }
    const creature = player.getCreature();
    if (!player.discord || !creature) {
      return;
    }
    const member = global.discordClient.guilds
      .first()
      .member(player.discord.id);
    if (!member) {
      utils.error(
        "Could not find discord user",
        player.discord.id,
        player.email,
        creature.name
      );
      delete player.discord;
      return;
    }
    return member.setNickname(creature.name);
  },
  sendMessage(player, message) {
    if (program.dev) {
      return;
    }
    const profileId = getProfileId(player);
    if (profileId && global.discordClient) {
      utils.withRetries(
        () =>
          global.discordClient
            .fetchUser(profileId)
            .then(user => user.send(message)),
        () =>
          utils.error(
            `Failed to send message to a user: ${player.discord.name}`
          )
      );
    }
  }
};

setTimeout(() => {
  // to work around circular dependency
  if (global.expressServer) {
    global.expressServer.get("/api/discord/auth/callback", (req, res) => {
      utils
        .clusterRequest("discord-update", {
          cookies: req.headers.cookie,
          code: req.query.code
        })
        .then(args => {
          const { ok, error } = args;
          if (ok) {
            res.send("<script>window.close();</script>");
          } else {
            utils.error(error, args);
            res.send("Error encountered, please contact the administrator");
          }
        });
    });
  }

  if (global.server) {
    global.server.registerHandler(
      "get-join-discord-url",
      (params, player, connection) => {
        return discord.getJoinDiscordUrl();
      }
    );
  }
});

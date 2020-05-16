const ws = require("nodejs-websocket");
const fs = require("fs");

const Player = require("../class/player");

require("./game-statistics");
require("./debug-data-serve.js");

const PLAYER_LIMIT = 200;

let tokens = {};
const preFlightChecks = [];

let STARTUP_ID = null; // = utils.md5(new Date().toISOString());

if (!program.test) {
  require("child_process").exec("git rev-parse HEAD", function(err, stdout) {
    STARTUP_ID = stdout;
    utils.log("Starting ID:", stdout);
  });
}

const isTokenExpired = token => {
  const match = tokens[token];
  return (
    match &&
    (!match.accessTokenExpiresOn ||
      match.accessTokenExpiresOn < new Date().getTime())
  );
};

setInterval(() => {
  Object.keys(tokens).forEach(token => {
    if (isTokenExpired(token)) {
      global.httpServerFork.send({
        type: "auth-token",
        token,
        playerId: null
      });
      delete tokens[token];
    }
  });
}, 14 * DAYS * IN_MILISECONDS);

const pathToKey = {};
// const keyToPath = {};

const getPlayerFromCookies = cookiesString => {
  if (program.dev && debugOption.loginAsEmail) {
    return Player.list.find(p => p.email === debugOption.loginAsEmail);
  }
  const cookies = (cookiesString || "")
    .split(";")
    .map(item => item.trim().split("="))
    .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});
  const token = cookies.authToken;
  if (isTokenExpired(token)) {
    delete tokens[token];
    global.httpServerFork.send({
      type: "auth-token",
      token,
      playerId: null
    });
  }
  return tokens[token] && tokens[token].player;
};

const getPlayerFromRequest = request => {
  return getPlayerFromCookies(request.headers.cookie);
};

const server = new (class Server {
  constructor() {
    this.connections = [];
    this.updateQueue = [];
    this.handlers = {};
    this.playerMap = new Map();

    if (program.test) {
      return;
    }

    ws.createServer(conn => {
      let player;

      try {
        player = getPlayerFromCookies(conn.headers.cookie);
      } catch (e) {}

      if (!player) {
        conn.sendText(JSON.stringify("not_logged_in"));
        setTimeout(() => {
          conn.close();
        }, 10000);
        return;
      }

      this.connections.push(conn);
      conn.pongTime = world.currentTime;

      if (player.getCreature() && !player.getCreature().isDead()) {
        server.sendText(
          conn,
          JSON.stringify({
            u5: "alive"
          })
        );
      }

      utils.log(
        "New connection",
        player.creature && player.creature.name,
        `now connected: ${this.connections.length}`
      );
      if (this.updateQueue.length) {
        this.updateQueue.unshift(conn);
      }
      this.playerMap.set(conn, player);

      server.sendToConnection(conn, "startup-id", STARTUP_ID);

      conn.on("text", str => {
        let json;
        try {
          json = JSON.parse(str);
        } catch (e) {
          utils.log("Invalid request", json);
          return;
        }

        const sender = () => {
          let response = {
            r6: json.r6,
            data: this.handleRequest(json, conn),
            key: json.key
          };

          server.sendText(conn, JSON.stringify(response));
        };

        if (program.dev && program.latency) {
          setTimeout(() => {
            sender();
          }, program.latency);
        } else {
          sender();
        }
      });

      conn.on("close", (code, reason) => {
        server.connectionClosed(conn);
      });

      conn.on("error", () => {});

      player.connected(conn);
    }).listen(8020);
  }

  getPlayerFromRequest(...args) {
    return getPlayerFromRequest(...args);
  }

  connectionClosed(conn) {
    const player = server.getPlayer(conn);
    let idx = this.connections.indexOf(conn);
    this.connections.splice(idx, 1);
    this.playerMap.delete(conn);
    utils.log(
      "Closing connection",
      this.connections.length,
      player && player.email
    );
  }

  sendText(connection, message) {
    return connection.sendText(message, e => {
      try {
        if (e && e.toString().match("This socket has been ended")) {
          utils.log("Connection has been terminated, stopping updates");
          server.connectionClosed(connection);
        }
      } catch (ex) {
        utils.log("Failed to fail", ex);
      }
    });
  }

  syncTokens(world) {
    tokens = {
      ...tokens,
      ...(world.authTokens || {})
    };
    world.authTokens = tokens;
  }

  handleRequest(request, conn) {
    const player = this.playerMap.get(conn);
    if (!this.handlers[request.r6]) {
      utils.error(
        "Invalid request: " +
          request.r6 +
          " " +
          JSON.stringify(request) +
          " " +
          (player && player.email)
      );
      return {};
    } else {
      const handler = this.handlers[request.r6];
      if (!player && !handler.unauthenticated) {
        return utils.errorResponse("Unauthenticated");
      }

      let result;
      try {
        result = handler.callback(request.params, player, conn);
      } catch (e) {
        utils.error(e);
      }
      return result;
    }
  }

  registerHandler(topic, callback, unauthenticated = false) {
    this.handlers[topic] = {
      callback,
      unauthenticated
    };
  }

  getPlayer(connection) {
    return this.playerMap.get(connection);
  }

  updatePlayers(seconds) {
    if (!this.updateQueue.length) {
      // rotate the connections to mix up the order
      const first = this.connections.shift();
      if (first) {
        this.connections.push(first);
      }
      this.updateQueue = [...this.connections];
    }
    let timeSpent = 0;
    let processed = 0;
    const targetMs = 300 * seconds;
    while (this.updateQueue.length && timeSpent < targetMs) {
      processed += 1;
      const connection = this.updateQueue.shift();
      const player = this.getPlayer(connection);
      if (!player) {
        continue;
      }
      const time = new Date().getTime();
      this.updatePlayer(connection);
      timeSpent += new Date().getTime() - time;
    }
    if (this.updateQueue.length) {
      // utils.log(
      //   "Waiting updates",
      //   this.updateQueue.length,
      //   "; Processed",
      //   processed
      // );
    }
  }

  updatePlayer(connection) {
    const milliseconds =
      world.currentTime.getTime() - connection.pongTime.getTime();
    if (milliseconds > 10 * SECONDS * IN_MILISECONDS) {
      connection.close();
      return;
    }

    const player = this.getPlayer(connection);
    const creature = player.getCreature();

    if (!creature || creature.isDead()) {
      server.sendText(
        connection,
        JSON.stringify({
          u5: "dead",
          data: player.deadReason
        })
      );
      server.sendUpdate(
        `data.payload.ticker.initial`,
        connection,
        global.timing.nextCycleSeconds
      );
      return;
    }

    creature.sendData(connection);

    if (!creature || creature.isDead()) {
      return;
    }

    Player.sendMapPayload(connection);
  }

  sendToConnection(connection, topic, data) {
    return server.sendText(
      connection,
      JSON.stringify({
        u5: topic,
        data
      })
    );
  }

  sendToPlayer(player, topic, data) {
    this.getConnections(player).forEach(connection =>
      server.sendToConnection(connection, topic, data)
    );
  }

  sendUpdate(topic, connection, data) {
    server.sendText(
      connection,
      JSON.stringify({
        u5: topic,
        data: data
      })
    );
  }

  sendUpdateToAll(topic, data) {
    [...this.connections].forEach(connection => {
      this.sendUpdate(topic, connection, data);
    });
  }

  sendUpdateForEachConnection(topic, callback) {
    [...this.connections].forEach(connection => {
      const data = callback(server.getPlayer(connection));
      if (data) {
        this.sendUpdate(topic, connection, data);
      }
    });
  }

  sendJSToAll(fn) {
    server.sendUpdateToAll("clientSideEvent", fn.toString());
  }

  setPlayer(conn, player) {
    utils.log(player.name + " authenticated");
    this.playerMap.set(conn, player);
  }

  isFocused(player) {
    return server
      .getConnections(player)
      .some(connection => !connection.background);
  }

  isConnected(player) {
    return server.getConnections(player).length > 0;
  }

  getConnections(player) {
    return this.connections.filter(conn => this.playerMap.get(conn) === player);
  }

  getConnectedPlayers() {
    return this.connections.map(
      conn =>
        `${this.playerMap.get(conn).getEmail()}${conn.background ? " (B)" : ""}`
    );
  }

  getHttpResourceForPlayer(player, file) {
    file = server.filePathToKey("/resources" + file);
    if (player) {
      player.accessResQ = player.accessResQ || {};
      if (!player.accessResQ[file] && global.httpServerFork) {
        global.httpServerFork.send({
          type: "player-data-icon",
          playerId: player.getEntityId(),
          icon: file
        });
        player.accessResQ[file] = true;
      }
    }
    return file;
  }

  filePathToKey(path, autofix = true) {
    if (autofix && path.substr(0, 10) !== "/resources") {
      // TODO: performance opportunity
      path = "/resources" + path;
    }
    if (!pathToKey[path]) {
      const key =
        "/qres/" + utils.md5(path).substr(0, 10) + /\.[^.]+$/.exec(path);
      pathToKey[path] = key;
      // keyToPath[key] = path;
      if (global.httpServerFork) {
        global.httpServerFork.send({
          type: "key-to-path",
          key,
          path: path.replace(/^\/resources/, "")
        });
      }
    }
    return pathToKey[path];
  }

  getImage(creature, image) {
    return this.getHttpResourceForPlayer(creature.getPlayer(), image);
  }

  preFlightCheck(callback) {
    preFlightChecks.push(callback);
  }

  runPreFlightChecks() {
    preFlightChecks.forEach(preFlightCheck => preFlightCheck());
  }
})();

utils.registerClusterHandler(global.httpServerFork, "new-token", data => {
  const player = Player.getByProfile(data.profile);
  tokens[data.token] = {
    accessTokenExpiresOn: new Date().getTime() + 30 * DAYS * IN_MILISECONDS,
    player
  };
  global.httpServerFork.send({
    type: "auth-token",
    token: data.token,
    playerId: player.getEntityId()
  });
  return {
    player: player.httpServerData()
  };
});

utils.registerClusterHandler(global.httpServerFork, "new-avatar", data => {
  let player = Player.list.find(p => p.id === data.player.id);

  if (player.onRookIsland) {
    const livingPlayers = Player.list
      .filter(p => p.creature)
      .filter(p => !p.creature.isDead()).length;

    if (livingPlayers > PLAYER_LIMIT) {
      return {
        status: 400,
        message:
          "We're sorry, but the server is at capacity and no new players can join at this time."
      };
    }
  }

  if (player.getCreature() && !player.getCreature().isDead()) {
    return {
      status: 400,
      message: "Already has an avatar."
    };
  }
  const params = data.params;
  params.name = params.name.trim();
  const validation = utils.validateDataStructure(params, {
    type: Object,
    format: {
      name: {
        type: String,
        rules: [
          {
            regex: /^[A-Za-z ]*$/,
            message: `Only letter and spaces are allowed.`
          },
          {
            regex: /^.{3,12}$/,
            message: `Name must be between 3 and 12 characters long.`
          },
          {
            regex: /^[A-Za-z].*[A-Za-z]/,
            message: `No leading or trailing spaces are allowed.`
          },
          {
            regex: /^[A-Za-z]{3,12}/,
            message: `First name must be between 3 and 12 characters.`
          },
          {
            regex: /^[A-Za-z]{3,12}( [A-Za-z]{1,12})?$/,
            message: `Name may only contain up to two words.`
          }
        ]
      },
      preferences: {
        type: Object,
        format: {
          hairStyle: { type: Number, min: 0, max: 100 },
          hairColor: { type: Number, min: 0, max: 100 },
          skinColor: { type: Number, min: 0, max: 100 }
        }
      },
      perks: {
        type: Array,
        format: { type: String }
      },
      race: {
        type: String
      }
    }
  });
  if (!validation.ok) {
    return {
      status: 400,
      message: validation.message || "Invalid request."
    };
  }

  if (
    Player.list.find(
      player =>
        player.name && player.name.toLowerCase() === params.name.toLowerCase()
    )
  ) {
    return {
      status: 400,
      message: "Name is taken"
    };
  }

  if (!params.perks.every(PerkSystem.isValidPerkCode)) {
    return {
      status: 400,
      message: "Invalid request"
    };
  }

  const perks = params.perks;
  const perkPointsNeeded = perks.reduce((acc, p) => acc + p.pointCost, 0);

  if (perkPointsNeeded > player.getPerkPoints()) {
    return {
      status: 400,
      message: "Not enough trait points."
    };
  }

  if (
    DISALLOWED_USERNAME_WORDS.some(word =>
      params.name.toLowerCase().includes(word)
    )
  ) {
    return {
      status: 400,
      message: "Provided name includes forbidden word"
    };
  }

  if (!player.getRaces().includes(params.race)) {
    return {
      status: 400,
      message: "Unknown error"
    };
  }

  // CREATION
  const avatar = new global[params.race]({
    name: params.name,
    looks: params.preferences
  });

  perks.forEach(p => PerkSystem.gainPerk(avatar, p));
  player.possessCreature(avatar);

  if (avatar.spawn()) {
    player.updateDiscordRole();

    avatar.move(avatar.getNode());
    avatar.satiated = 75;

    discord.updateProfile(player);

    return {
      status: 200
    };
  } else {
    avatar.annihilate();
    return {
      status: 400,
      message: "It is not possible to create a vessel of this type at this time"
    };
  }
});

utils.registerClusterHandler(
  global.httpServerFork,
  "discord-update",
  ({ cookies, code }) => {
    const fs = require("fs");
    const credentials = JSON.parse(
      fs.readFileSync("./.credentials/discord.json")
    );
    const player = getPlayerFromCookies(cookies);

    return utils
      .httpRequest({
        method: "POST",
        url: `https://discordapp.com/api/oauth2/token`,
        body: new URLSearchParams({
          client_id: credentials.clientId,
          client_secret: credentials.secret,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: credentials.callbackURL,
          scope: "identify guilds.join"
        }).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(responseJson => {
        return utils
          .httpRequest({
            method: "GET",
            url: "https://discordapp.com/api/users/@me",
            headers: {
              Authorization: `Bearer ${responseJson.access_token}`
            }
          })
          .then(newResponse => ({
            accessToken: responseJson.access_token,
            responseJson: newResponse
          }));
      })
      .then(({ accessToken, responseJson }) => {
        player.discord = {
          id: responseJson.id,
          name: `${responseJson.username}#${responseJson.discriminator}`
        };
        if (global.discordClient) {
          utils.withRetries(() =>
            global.discordClient.guilds
              .first()
              .addMember(responseJson.id, {
                accessToken: accessToken
              })
              .then(member => {
                setTimeout(() => {
                  player.updateDiscordRole();
                  discord.updateProfile(player);
                }, 3000);
              })
          );
        }
        player.sendDiscordData();
        return {
          ok: true
        };
      })
      .catch(error => {
        return Promise.resolve({
          ok: false,
          error
        });
      });
  }
);

module.exports = global.server = server;

server.preFlightCheck(() => {
  utils.getClasses(Entity).forEach(e => {
    utils.getKey(e.constructor.name);
  });

  function buildKeyToPathCache(array) {
    array.forEach(path => {
      path = path.replace(/^../, "");
      const key = server.filePathToKey(path);
      global.httpServerFork.send({
        type: "key-to-path",
        key,
        path: path.replace(/^\/resources/, "")
      });
    });
  }

  buildKeyToPathCache(utils.recursiveScandir("./resources/.map"));
  buildKeyToPathCache(utils.recursiveScandir("./resources/icons96"));
  buildKeyToPathCache(utils.recursiveScandir("./resources/tiles/decor"));
  buildKeyToPathCache(utils.recursiveScandir("./resources/tiles/structures"));
});

server.registerHandler("client-side-error", (params, player) => {
  const message = new Date().toISOString() + ` [${player.email}] ` + params;
  fs.appendFileSync(
    ".logs/client-side-error.log",
    message.replace(/\\n/g, "\n") + "\n"
  );
});

const express = require("express");
const proxy = require("http-proxy-middleware");
const path = require("path");
const fs = require("fs");
const https = require("https");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const debug = require("../../debug/debug-data");
const discord = require("../../singletons/discord");

const port = process.env.PORT || 8443;

utils.log(`Running on port: ${port}`);

const expressApp = express();

const resourcesAvailable = {};
global.keyToPath = global.keyToPath || {};

process.on("message", msg => {
  switch (msg.type) {
    case "auth-tokens":
      global.AuthTokens = msg.data;
      break;
    case "auth-token":
      global.AuthTokens = global.AuthTokens || {};
      if (msg.token) {
        global.AuthTokens[msg.token] = msg.playerId;
      } else {
        delete global.AuthTokens[msg.token];
      }
      break;
    case "players-data":
      global.PlayerData = msg.data;
      break;
    case "player-data":
      global.PlayerData = global.PlayerData || {};
      global.PlayerData[msg.playerId] = msg.data;
      break;
    case "player-data-icon":
      if (global.PlayerData && global.PlayerData[msg.playerId]) {
        global.PlayerData[msg.playerId].httpResources[msg.icon] = true;
      }
      break;
    case "key-to-path":
      global.keyToPath[msg.key] = msg.path;
  }
});

function validateSession(req, res) {
  const player = getPlayerFromCookies(req.headers.cookie);
  if (!player) {
    res.status(400);
    res.redirect("/#/login");
    return false;
  }
  return player;
}

const getPlayerFromCookies = cookiesString => {
  if (program.dev && debugOption.loginAsEmail) {
    return Object.values(PlayerData).find(
      player => player.email === debugOption.loginAsEmail
    );
  }
  const cookies = (cookiesString || "")
    .split(";")
    .map(item => item.trim().split("="))
    .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});
  const token = cookies.authToken;
  return AuthTokens[token] && PlayerData[AuthTokens[token]];
};

const getPlayerFromRequest = request => {
  return getPlayerFromCookies(request.headers.cookie);
};

expressApp.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://play.soulforged.net");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const wsProxy = proxy("ws://localhost:8020/", {
  changeOrigin: true,
  logLevel: "warn",
  onProxyReqWs(proxyReq, req, res) {
    const player = getPlayerFromRequest(req);
    if (player) {
      const ipAddress = req && req.connection && req.connection.remoteAddress;
      utils.log(player.email, "connected at IPaddr", ipAddress);
    }
  }
});

let serverApp;
if (program.ssl) {
  serverApp = https.createServer(
    {
      key: fs.readFileSync("./ssl/privatekey.pem"),
      cert: fs.readFileSync("./ssl/certificate.pem")
    },
    expressApp
  );
} else {
  serverApp = expressApp;
}
try {
  const googleConfiguration = JSON.parse(
    fs.readFileSync("./.credentials/google-auth-config.json")
  );
  passport.use(
    new GoogleStrategy(googleConfiguration, function(
      accessToken,
      refreshToken,
      profile,
      cb
    ) {
      cb(null, profile);
    })
  );
} catch (e) {
  utils.error(
    "./.credentials/google-auth-config.json file not found! Players will be unable to log in!"
  );
}

const setCacheHeaders = utils.setCacheHeaders;

expressServer = expressApp
  .all("/", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://play.soulforged.net");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  })
  .use(
    express.static("client", {
      setHeaders(res, req) {
        setCacheHeaders(res, req);
      }
    })
  )
  .use(
    "/node_modules",
    express.static("node_modules", {
      setHeaders(res, req) {
        setCacheHeaders(res, req);
      }
    })
  )
  .use("/status", debug)
  .use("/qres", (req, res) => {
    const player = getPlayerFromCookies(req.headers.cookie);

    const return404 = () => {
      res.status(404);
      res.send();
    };

    if (!player && !program.dev) {
      return return404();
    }

    const attemptResponse = () => {
      const requestPath = "/qres" + req.path;
      const icon = (global.keyToPath || {})[requestPath];

      if (!program.dev && (!icon || !player.httpResources[requestPath])) {
        return false;
      }
      const fullPath = path.join(__dirname, "../../resources/" + icon);
      if (!resourcesAvailable[icon]) {
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          resourcesAvailable[icon] = stats.size > 0;
        }
      }
      if (resourcesAvailable[icon]) {
        setCacheHeaders(res, req);
        res.sendFile(fullPath, { etag: false });
        return true;
      }
      return false;
    };

    if (!attemptResponse()) {
      let repeats = 5 * 30;
      const interval = setInterval(() => {
        repeats -= 1;
        const result = attemptResponse();
        if (result || !repeats) {
          clearInterval(interval);
        }
        if (result) {
          return;
        }
        if (!repeats) {
          clearInterval(interval);
          const icon = (global.keyToPath || {})["/qres" + req.path];
          if (!icon) {
            utils.error(
              `Unknown resource key`,
              player.email,
              "/qres" + req.path
            );
          }
          return return404();
        }
      }, 200);
    }
  })
  .post("/api/createAvatar", (req, res) => {
    utils
      .getPostData(req)
      .then(params => {
        const player = validateSession(req, res);
        utils
          .clusterRequest("new-avatar", {
            params,
            player
          })
          .then(response => {
            res.status(response.status);
            if (response.message) {
              res.send(response.message);
            }
            if (response.status === 200) {
              res.redirect("/#/main");
            }
          });
      })
      .catch(e => {
        utils.error(e);
        res.status(400);
      });
  })
  .get(
    "/api/login",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )
  .get("/api/login/callback", (req, res, next) => {
    passport.authenticate("google", (err, profile, info) => {
      if (err) {
        utils.error(err);
        res.status(400);
        res.send();
        return;
      }

      const token = utils.md5(
        profile + "soulforged-game" + JSON.stringify(process.hrtime())
      );
      utils
        .clusterRequest("new-token", {
          token,
          profile
        })
        .then(response => {
          res.cookie("authToken", token, {
            maxAge: 100000000000,
            httpOnly: true
          });
          const player = response.player;
          switch (true) {
            case !player.hasAcceptedLegalTerms:
              return res.redirect("/#/register");
            case !player.creature:
              return res.redirect("/#/avatar-creator");
            default:
              return res.redirect("/#/main");
          }
        });
    })(req, res, next);
  })
  .use("/api/ws", wsProxy)
  .use(passport.initialize())
  .use(passport.session())
  .use((err, req, res, next) => {
    if (!err) return next();
    return res.status(404).send();
  });

serverApp.listen(port).on("upgrade", wsProxy.upgrade);

global.expressServer = expressServer;

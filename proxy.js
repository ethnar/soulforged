const proxy = require("http-proxy-middleware");
const express = require("express");
const https = require("https");
const fs = require("fs");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const wsProxy = proxy("https://80.85.87.183:8443/", {
  rejectUnauthorized: false,
  changeOrigin: true,
  logLevel: "warn",
  secure: false
});
const wsProxy2 = proxy("ws://80.85.87.183:8020/", {
  rejectUnauthorized: false,
  changeOrigin: true,
  logLevel: "warn",
  secure: false
});

const expressApp = express();
expressApp
  .use("/api/ws", wsProxy2)
  .use("/", wsProxy)
  .use((err, req, res, next) => {
    if (!err) return next();
    return res.status(404).send();
  });

const serverApp = https.createServer(
  {
    key: fs.readFileSync("./ssl/privatekey.pem"),
    cert: fs.readFileSync("./ssl/certificate.pem")
  },
  expressApp
);

serverApp.listen(8443).on("upgrade", wsProxy.upgrade);

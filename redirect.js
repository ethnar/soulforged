const https = require("https");
const express = require("express");
const fs = require("fs");

const targetUrl = "https://soulforged.westeurope.cloudapp.azure.com/";

const expressApp = express();

const serverApp = https.createServer(
  {
    key: fs.readFileSync("./ssl/privatekey.pem"),
    cert: fs.readFileSync("./ssl/certificate.pem")
  },
  expressApp
);

function handleRedirect(req, res) {
  res.redirect(targetUrl);
}

expressApp.get("*", handleRedirect);
const port = process.env.port || 8443;
serverApp.listen(port);

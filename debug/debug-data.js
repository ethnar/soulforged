const fs = require("fs");

let passphrase;
try {
  passphrase = fs
    .readFileSync("./.credentials/debug-passphrase")
    .toString()
    .replace(/[^a-zA-Z0-9]/g, "");
} catch (e) {
  passphrase = null;
}

module.exports = (req, res) => {
  if (!passphrase || req.query.pass !== passphrase) {
    res.status(404);
    res.send();
    return;
  }

  let html = fs.readFileSync("./debug/debug.html").toString();

  utils.clusterRequest("debug-data").then(data => {
    html = html.replace("/*GAME_DATA*/", JSON.stringify(data));

    res.set("content-type", "text/html");
    res.send(html);
  });
};

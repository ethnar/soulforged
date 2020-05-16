const Connection = require("./.connection");

class Path extends Connection {}
module.exports = global.Path = Path;

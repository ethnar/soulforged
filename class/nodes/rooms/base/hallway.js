const Room = require("../../room");

class Base_Hallway extends Room {}
Object.assign(Base_Hallway.prototype, {
  name: "Hallway"
});

module.exports = global.Base_Hallway = Base_Hallway;

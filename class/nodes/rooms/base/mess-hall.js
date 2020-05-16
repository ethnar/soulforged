const Room = require("../../room");

class Base_MessHall extends Room {}
Object.assign(Base_MessHall.prototype, {
  name: "Mess Hall",
  unlisted: true,
  mapGraphic: {
    5: `tiles/dungeon/rooms/mess-hall00.png`
  }
});

module.exports = global.Base_MessHall = Base_MessHall;

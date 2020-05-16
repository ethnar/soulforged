const Room = require("../../room");

class Base_Garden extends Room {}
Object.assign(Base_Garden.prototype, {
  name: "Garden",
  unlisted: true,
  mapGraphic: {
    5: `tiles/dungeon/rooms/garden.png`
  }
});

module.exports = global.Base_Garden = Base_Garden;

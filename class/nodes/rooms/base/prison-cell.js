const Room = require("../../room");

class Base_PrisonCell extends Room {}
Object.assign(Base_PrisonCell.prototype, {
  name: "Prison Cell",
  mapGraphic: {
    1: `tiles/dungeon/rooms/prison-cell00.png`
  }
});

module.exports = global.Base_PrisonCell = Base_PrisonCell;

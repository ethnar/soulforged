const Doors = require("./.doors");

class WallDoors extends Doors {}
Object.assign(WallDoors.prototype, {
  name: "Hidden passage",
  unlisted: true,
  locked: true,
  mapGraphic: (node, structure, tilesBase) => {
    const isOpen = !structure.isClosed();
    const dir = Doors.getDirection(structure, node);
    return isOpen
      ? {}
      : {
          5: `tiles/dungeon/${tilesBase}/${dir}_wall_door.png`
        };
  }
});

module.exports = global.WallDoors = WallDoors;

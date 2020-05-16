const LockableDoors = require("./.lockable-doors");

class WoodenDoors extends LockableDoors {}
Object.assign(WoodenDoors.prototype, {
  name: "Wooden Door",
  icon: `/${ICONS_PATH}/structures/dungeon/doors/wooden_door.png`,
  lockLevel: 14,
  mapGraphic: (node, structure, tilesBase) => {
    const isOpen = !structure.isClosed();
    const dir = Doors.getDirection(structure, node);
    return {
      5: `tiles/dungeon/${tilesBase}/${dir}_wooden_door${
        isOpen ? "_open" : ""
      }.png`
    };
  }
});

module.exports = global.WoodenDoors = WoodenDoors;

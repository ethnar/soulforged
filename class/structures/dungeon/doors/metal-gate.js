const Doors = require("./.doors");

class MetalGate extends Doors {
  isBlockingVision() {
    return false;
  }
}
Object.assign(MetalGate.prototype, {
  name: "Metal Gate",
  icon: `/${ICONS_PATH}/structures/dungeon/doors/metal_gate.png`,
  locked: true,
  mapGraphic: (node, structure, tilesBase) => {
    const isOpen = !structure.isClosed();
    const dir = Doors.getDirection(structure, node);
    return {
      5: `tiles/dungeon/${tilesBase}/${dir}_metal_grate${
        isOpen ? "_open" : ""
      }.png`
    };
  }
});

module.exports = global.MetalGate = MetalGate;

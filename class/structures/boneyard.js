const Structure = require("./.structure");

class Boneyard extends Structure {
  getDescription() {
    return `A countless number of massive bones.`;
  }
}
Object.assign(Boneyard.prototype, {
  name: "Boneyard",
  cannotBeOccupied: true,
  icon: `tiles/custom/bones_icon.png`,
  mapGraphic: {
    5: "tiles/custom/bones.png"
  }
});
module.exports = global.Boneyard = Boneyard;

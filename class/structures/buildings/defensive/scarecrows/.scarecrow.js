const Building = require("../../.building");

class Scarecrow extends Building {
  static getDescription() {
    return `A small totem, likely to scare away any ${this.prototype.scaresMonsters.getName()} that may roam around.`;
  }
}
Object.assign(Scarecrow.prototype, {
  name: "?Scarecrow?",
  baseTime: 5 * MINUTES
});

module.exports = global.Scarecrow = Scarecrow;

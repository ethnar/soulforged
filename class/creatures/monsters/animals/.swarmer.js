const Predator = require("./.predator");

class Swarmer extends Predator {
  setNode(node) {
    super.setNode(node);
    if (!this.swarmerTriggered) {
      this.swarmerTriggered = true;
      const swarmerCount = this.swarmerCount();
      for (let i = 0; i < swarmerCount - 1; i++) {
        const spawn = new this.constructor({
          swarmerTriggered: true,
          dungeonCreep: this.dungeonCreep
        });
        node.addCreature(spawn);
        spawn.move(node);
      }
    }
  }
}
Object.assign(Swarmer.prototype, {
  swarmerCount: () => 4
});
module.exports = global.Swarmer = Swarmer;

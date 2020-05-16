const Predator = require("./.predator");

class Spider extends Predator {
  cycle(seconds) {
    super.cycle(seconds);

    if (!this.isDead() && TimeCheck.atHour(4, seconds)) {
      this.spawnWebs();
    }
  }

  spawnWebs() {
    const websMultiplier =
      1 + PetTrainingSystem.getTrainingLevel(this, "moreWebs") * 0.5;
    const websToMake = Math.round(
      websMultiplier * utils.random(...this.websCounts)
    );

    const ownerHome = PetTrainingSystem.getTrainingLevel(this, "websInTheHouse")
      ? this.tamed &&
        this.tamed.owner &&
        this.tamed.owner.getHome(this.getNode())
      : null;
    const container = ownerHome || this.getNode();

    container.addItemByType(Webs, websToMake);
  }
}
Object.assign(Spider.prototype, {
  websCounts: [1, 1]
});
module.exports = global.Spider = Spider;

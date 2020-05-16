const Building = require("./.building");

class Ruins extends Building {
  constructor(args) {
    super(args);
    if (this.persistentRuin) {
      this.deteriorationRate = Infinity;
    }
    this.complete = true;
  }

  setNode(node) {
    if (this.blocking && this.getNode()) {
      this.getNode().buildingsDisallowed = false;
    }
    super.setNode(node);
    if (this.blocking) {
      this.getNode().buildingsDisallowed = true;
    }
  }

  destroy(noRuin = true) {
    if (this.blocking && this.getNode()) {
      this.getNode().buildingsDisallowed = false;
    }
    super.destroy(true);
  }

  demolishCondition() {
    return true;
  }
}
Object.assign(Ruins.prototype, {
  name: "Ruins",
  baseTime: 2 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/n_up_10_b.png`,
  deteriorationRate: 60 * DAYS,
  noRuins: true,
  toolUtility: null,
  noDemolish: true,
  materials: {},
  buffs: {
    [BUFFS.MOOD]: -3
  },
  repair: {
    materials: {}
  }
});
module.exports = global.Ruins = Ruins;

const Road = require("./.road");

class AymarRoad extends Road {
  isComplete() {
    return true;
  }

  getDescription() {
    return `Aymar's power helps you traverse this island with extreme speeds.`;
  }

  deteriorate() {}
}

Entity.factory(AymarRoad, {
  name: `Aymar's Waystone`,
  icon: `/${ICONS_PATH}/creatures/blue_01.png`,
  deteriorationRate: Infinity,
  noDemolish: true,
  buffs: {
    [BUFFS.TRAVEL_TIME]: -90
  },
  obsoletes: ["DirtRoad", "GravelRoad", "PavedRoad"]
});
module.exports = global.AymarRoad = AymarRoad;

const Road = require("./.road");

class DirtRoad extends Road {
  isComplete() {
    return true;
  }

  getDescription() {
    return `Frequent travels through this land appear to have left a mark. It makes it easier to navigate.`;
  }

  deteriorate() {}
}

Building.buildingFactory(DirtRoad, {
  name: "Dirt Road",
  icon: `/${ICONS_PATH}/structures/greenland_sgi_152_road.png`,
  deteriorationRate: Infinity,
  noDemolish: true,
  mapGraphic: (node, structure) =>
    Road.SHOW_ROAD[node.getType()]
      ? {
          1: `tiles/structures/roads/hexroad-${structure.roadPattern ||
            "000000"}-00.png`
        }
      : {},
  buffs: {
    [BUFFS.TRAVEL_DIFFICULTY_OVERWORLD]: -0.7,
    [BUFFS.TRAVEL_TIME]: -20
  }
});
module.exports = global.DirtRoad = DirtRoad;

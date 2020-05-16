const Building = require("../.building");

//   0  1
// 5      2
//   4  3

const SHOW_ROAD = {
  [NODE_TYPES.TROPICAL_PLAINS]: true,
  [NODE_TYPES.DESERT_GRASS]: true,
  [NODE_TYPES.DESERT_SAND]: true,
  [NODE_TYPES.BOG]: true,
  [NODE_TYPES.PLAINS]: true,
  [NODE_TYPES.SCRUB_LAND]: true,
  [NODE_TYPES.SNOW_FIELDS]: true,
  [NODE_TYPES.PLAINS_SNOW]: true,
  [NODE_TYPES.COLD_DIRT]: true,
  [NODE_TYPES.CACTI]: true
};

const getDirection = utils.getDirection;

class Road extends Building {
  setNode(args) {
    super.setNode(args);
    setTimeout(() => this.roadStatusUpdated());
  }

  destroy() {
    super.destroy();
    setTimeout(() => this.roadStatusUpdated());
  }

  constructionFinished() {
    const result = super.constructionFinished();
    setTimeout(() => this.roadStatusUpdated());
    return result;
  }

  getValidRoadConnections() {
    const node = this.getNode();
    return node.getConnectedNodes().filter(c => node.zLevel === c.zLevel);
  }

  roadStatusUpdated() {
    this.recalculateConnections();
    this.getValidRoadConnections()
      .map(n => Road.getRoad(n))
      .filter(s => !!s)
      .forEach(s => s.recalculateConnections());
  }

  recalculateConnections() {
    const connectedNodes = this.getValidRoadConnections();

    const roadPresence = connectedNodes
      .filter(n => !!Road.getRoad(n))
      .map(node => ({
        dirPosition: getDirection(this.getNode(), node),
        hasRoad: true
      }))
      .toObject(
        v => v.dirPosition,
        v => true
      );

    this.roadPattern = [
      roadPresence[0] ? 1 : 0,
      roadPresence[1] ? 1 : 0,
      roadPresence[2] ? 1 : 0,
      roadPresence[3] ? 1 : 0,
      roadPresence[4] ? 1 : 0,
      roadPresence[5] ? 1 : 0
    ].join("");
  }

  static getRoad(node) {
    return node.getCompleteStructures().find(s => s instanceof Road);
  }
}

Object.assign(Road.prototype, {
  name: "?Road?",
  order: 75,
  icon: `/${ICONS_PATH}/structures/greenland_sgi_152_road.png`,
  noRuins: true
});

Road.SHOW_ROAD = SHOW_ROAD;
module.exports = global.Road = Road;

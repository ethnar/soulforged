const Structure = require("../.structure");
const Action = require("../../action");
const server = require("../../../singletons/server");

const actions = Action.groupById([
  new Action({
    name: "Exit",
    icon: "/actions/icons8-treasure-map-100.png",
    repeatable: false,
    notification: false,
    quickAction: true,
    available(entity, creature) {
      if (creature.isOverburdened()) {
        return "You are overburdened!";
      }
      return true;
    },
    run(entity, creature, seconds) {
      FollowSystem.stopFollowing(creature);
      const targetNode = entity.getExitNode();
      // if (creature.getNode() === entity.getNode()) {
      //   creature.move(targetNode);
      //   return;
      // }
      const travelAction = targetNode.getActionById("Travel");
      creature.startAction(targetNode, travelAction);
      creature.currentAction.context = {
        skipUnknowns: true,
        assault: true,
        disregard: true
      };
      return true;
    }
  })
]);

class DungeonExit extends Structure {
  static actions() {
    return actions;
  }

  getExitNode() {
    return this.dungeonExitNode;
  }

  setExitNode(node) {
    this.dungeonExitNode = node;
  }
}
Object.assign(DungeonExit.prototype, {
  name: "Stairs Up",
  icon: `/${ICONS_PATH}/structures/sgi_140.png`,
  cannotBeOccupied: true,
  mapGraphic: (node, structure, tilesBase) => {
    if (!(node instanceof Room)) {
      return {};
    }
    return {
      2: `tiles/dungeon/${tilesBase}/stairs_up.png`
    };
  }
});

module.exports = global.DungeonExit = DungeonExit;

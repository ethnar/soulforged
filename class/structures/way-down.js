const Structure = require("./.structure");
const Action = require("../action");
const server = require("../../singletons/server");

const actions = Action.groupById([
  new Action({
    name: "EnterDown",
    dynamicLabel: () => "Enter",
    icon: "/actions/icons8-treasure-map-100.png",
    difficulty: (entity, creature) =>
      entity
        .getNode()
        .getLevelDown()
        .getDifficultyLabel(creature),
    repeatable: false,
    notification: false,
    run(entity, creature, seconds) {
      FollowSystem.stopFollowing(creature);
      const targetNode = entity.getNode().getLevelDown();
      const travelAction = targetNode.getActionById("Travel");
      creature.startAction(targetNode, travelAction);
      return true;
    }
  })
]);

class WayDown extends Structure {
  static actions() {
    return actions;
  }
}
Object.assign(WayDown.prototype, {
  name: "Underground entrance",
  icon: `/${ICONS_PATH}/structures/sgi_140.png`,
  cannotBeOccupied: true
});

module.exports = global.WayDown = WayDown;

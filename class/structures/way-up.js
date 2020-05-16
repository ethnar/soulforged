const Structure = require("./.structure");
const Action = require("../action");

const actions = Action.groupById([
  new Action({
    name: "EnterUp",
    dynamicLabel: () => "Enter",
    icon: "/actions/icons8-treasure-map-100.png",
    difficulty: (entity, creature) =>
      entity
        .getNode()
        .getLevelUp()
        .getDifficultyLabel(creature),
    repeatable: false,
    notification: false,
    run(entity, creature, seconds) {
      FollowSystem.stopFollowing(creature);
      const targetNode = entity.getNode().getLevelUp();
      const travelAction = targetNode.getActionById("Travel");
      creature.startAction(targetNode, travelAction);
      return true;
    }
  })
]);

class WayUp extends Structure {
  static actions() {
    return actions;
  }
}
Object.assign(WayUp.prototype, {
  name: "Exit to surface",
  icon: `/${ICONS_PATH}/structures/sgi_160_recolor.png`,
  cannotBeOccupied: true
});

module.exports = global.WayUp = WayUp;

module.exports = new Action({
  name: "Occupy",
  icon: "/actions/icons8-battle-100.png",
  notification: false,
  repeatable: false,
  secondaryAction: true,
  valid(entity, creature) {
    const player = creature.getPlayer();
    if (player && player.onRookIsland) {
      return false;
    }
    if (entity.cannotBeOccupied) {
      return false;
    }
    return true;
  },
  runCheck(entity, creature) {
    if (creature.currentAction.extra) {
      const blocked = creature.accessErrorMessage(entity);
      if (blocked) return blocked;
    }
    return true;
  },
  run(entity, creature, seconds) {
    creature.lastTravel = null;
    creature.occupyEntity(entity, creature.currentAction.extra);
    return false;
  },
  ...utils.jsAction("/js/actions/occupy")
});

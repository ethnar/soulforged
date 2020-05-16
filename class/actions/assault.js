module.exports = new Action({
  name: "Assault",
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
    const blocked = creature.accessErrorMessage(entity);
    if (!blocked) return "No one is stopping you from using this";
    return true;
  },
  run(entity, creature) {
    const blockedBy = creature.getBlockingCreatures(entity);
    blockedBy.forEach(b => {
      const duel = new Duel({
        startedBy: creature,
        challenged: b
      });
      duel.markAccepted(creature);
      duel.markAccepted(b);
    });
    return false;
  }
});

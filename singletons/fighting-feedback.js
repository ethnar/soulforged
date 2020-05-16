const formatDamages = (damages, creature) => {
  const grouped = damages
    .map(buff => buff.getPayload(creature))
    .map(buff => ({
      icon: buff.icon,
      stacks: buff.stacks
    }))
    .reduce(
      (acc, buff) => ({
        ...acc,
        [buff.icon]: (acc[buff.icon] || 0) + buff.stacks
      }),
      {}
    );
  return {
    damages: Object.keys(grouped).map(icon => ({
      icon,
      stacks: grouped[icon]
    }))
  };
};

module.exports = global.fightingFeedback = {
  reportFleeMiss(who, whom) {
    this.reportMessage(who, whom, "fleeMiss");
  },

  reportDodge(who, whom) {
    this.reportMessage(who, whom, "dodge");
  },

  reportHidden(who, whom) {
    this.reportMessage(who, whom, "hidden");
  },

  reportMiss(who, whom) {
    this.reportMessage(who, whom, "miss");
  },

  reportMessage(who, whom, prop) {
    const node = who.getNode();
    this.report(node, () => ({
      who,
      whom,
      [prop]: true
    }));
  },

  reportGraze(who, whom, damages) {
    if (damages) {
      const node = who.getNode();
      this.report(node, creature => ({
        who,
        whom,
        graze: true,
        ...formatDamages(damages, creature)
      }));
    }
  },

  reportHit(who, whom, damages) {
    if (damages) {
      const node = who.getNode();
      this.report(node, creature => ({
        who,
        whom,
        ...formatDamages(damages, creature)
      }));
    }
  },

  report(node, callback) {
    node
      .getCreatures()
      .filter(creature => !!creature.getPlayer())
      .forEach(creature => {
        const player = creature.getPlayer();
        const data = callback(creature);
        server.sendToPlayer(player, "fightingFeedback", {
          ...data,
          who: data.who.getEntityId(),
          whom: data.whom.getEntityId()
        });
      });
  }
};

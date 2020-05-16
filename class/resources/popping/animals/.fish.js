class Fish extends PoppingResource {}
Object.assign(Fish.prototype, {
  nameable: true,
  gatherActionLabel: "Fish",
  toolUtility: TOOL_UTILS.FISHING,
  failMessageGenerator(entity, creature) {
    return `The ${entity.getProduce(creature, true).getName()} has escaped.`;
  }
});

module.exports = global.Fish = Fish;

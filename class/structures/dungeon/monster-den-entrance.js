class MonsterDenEntrance extends DungeonEntrance {
  setDungeonEntranceNode(node) {
    super.setDungeonEntranceNode(node);
    node.buildingsDisallowed = false;
  }

  getSimplePayload(creature) {
    if (!this.dungeon.creatureCanSeeDen(creature)) {
      return null;
    }
    return super.getSimplePayload(creature);
  }

  getPayload(creature) {
    if (!this.dungeon.creatureCanSeeDen(creature)) {
      return null;
    }
    return super.getPayload(creature);
  }
}
Object.assign(MonsterDenEntrance.prototype, {
  name: "Den Entrance",
  icon: `/${ICONS_PATH}/structures/sgi_39.png`,
  mapGraphic: () => ({})
});

module.exports = global.MonsterDenEntrance = MonsterDenEntrance;

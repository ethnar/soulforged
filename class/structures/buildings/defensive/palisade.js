const Building = require("../.building");

class Palisade extends Building {
  cycle(seconds) {
    super.cycle(seconds);

    this.registeredDefenders = this.registeredDefenders || {};

    this.getNode()
      .getCreatures()
      .forEach(creature => {
        if (
          !this.registeredDefenders[creature.getEntityId()] &&
          !creature.hasEnemies()
        ) {
          this.registeredDefenders[creature.getEntityId()] = true;
        }
      });

    const presentCreatures = this.getNode()
      .getCreatures()
      .toObject(c => c.getEntityId());

    Object.keys(this.registeredDefenders).forEach(creatureId => {
      if (!presentCreatures[creatureId]) {
        delete this.registeredDefenders[creatureId];
      }
    });
  }

  getBuffs(creature) {
    this.registeredDefenders = this.registeredDefenders || {};
    if (creature && !this.registeredDefenders[creature.getEntityId()]) {
      return {};
    }
    return super.getBuffs(creature);
  }
}
Building.buildingFactory(Palisade, {
  name: "Palisade",
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/defensive/sgi_96.png`,
  research: {
    materials: {
      HardwoodShaft: 0,
      HardwoodPlank: 0
    }
  },
  toolUtility: TOOL_UTILS.WOODCUTTING,
  materials: {
    HardwoodShaft: 80,
    HardwoodPlank: 20
  },
  buffs: {
    [BUFFS.HIDING_TIME]: 1100,
    [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: 8,
    [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 8,
    [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 8
  },
  mapGraphic: (node, structure, homeLevel) => ({
    5: `tiles/custom/palisade-top.png`,
    6: `tiles/custom/palisade-bottom.png`
  })
});

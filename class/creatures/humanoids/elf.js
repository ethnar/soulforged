const Humanoid = require("./.humanoid");

class Elf extends Humanoid {
  spawn() {
    this.isOnMainland = true;
    let startNode = Entity.getById(685);
    const corpses = Entity.getEntities(Elf)
      .filter(c => c.isDead())
      .sort((a, b) => b.deterioration - a.deterioration);
    if (corpses.length) {
      const corpse = corpses[0];
      startNode = corpse.getNode();
      corpse.destroy();
    }
    startNode.addCreature(this);
    return true;
  }
}

Creature.factory(Elf, {
  name: "Elf",
  faction: Faction.getByName("Elf"),
  maxAge: 500,
  butcherable: {
    ...Humanoid.prototype.butcherable,
    nameable: "Elf",
    corpseName: () => Nameable.getName("Elf"),
    butcherName: () => `Butcher ${Nameable.getName("Elf")}`
  },
  agingTiers: {
    0: {
      [STATS.STRENGTH]: 30,
      [STATS.DEXTERITY]: 30,
      [STATS.ENDURANCE]: 50,
      [STATS.PERCEPTION]: 30,
      [STATS.INTELLIGENCE]: 35
    },
    75: {
      [STATS.STRENGTH]: 35,
      [STATS.DEXTERITY]: 60,
      [STATS.ENDURANCE]: 40,
      [STATS.PERCEPTION]: 60,
      [STATS.INTELLIGENCE]: 55
    },
    400: {
      [STATS.STRENGTH]: 35,
      [STATS.DEXTERITY]: 60,
      [STATS.ENDURANCE]: 40,
      [STATS.PERCEPTION]: 60,
      [STATS.INTELLIGENCE]: 55
    },
    500: {
      [STATS.STRENGTH]: 10,
      [STATS.DEXTERITY]: 35,
      [STATS.ENDURANCE]: 5,
      [STATS.PERCEPTION]: 30,
      [STATS.INTELLIGENCE]: 55
    }
  }
});

module.exports = global.Elf = Elf;

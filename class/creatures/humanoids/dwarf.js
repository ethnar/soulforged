const Humanoid = require("./.humanoid");

class Dwarf extends Humanoid {
  spawn() {
    this.isOnMainland = true;
    const startNode = Entity.getById(492);
    startNode.addCreature(this);
    return true;
  }
}

Creature.factory(Dwarf, {
  name: "Dwarf",
  faction: Faction.getByName("Dwarf"),
  maxAge: 320,
  butcherable: {
    ...Humanoid.prototype.butcherable,
    nameable: "Dwarf",
    corpseName: () => Nameable.getName("Dwarf"),
    butcherName: () => `Butcher ${Nameable.getName("Dwarf")}`
  },
  agingTiers: {
    0: {
      [STATS.STRENGTH]: 30,
      [STATS.DEXTERITY]: 30,
      [STATS.ENDURANCE]: 45,
      [STATS.PERCEPTION]: 30,
      [STATS.INTELLIGENCE]: 30
    },
    35: {
      [STATS.STRENGTH]: 55,
      [STATS.DEXTERITY]: 40,
      [STATS.ENDURANCE]: 65,
      [STATS.PERCEPTION]: 40,
      [STATS.INTELLIGENCE]: 50
    },
    260: {
      [STATS.STRENGTH]: 55,
      [STATS.DEXTERITY]: 40,
      [STATS.ENDURANCE]: 65,
      [STATS.PERCEPTION]: 40,
      [STATS.INTELLIGENCE]: 50
    },
    300: {
      [STATS.STRENGTH]: 30,
      [STATS.DEXTERITY]: 20,
      [STATS.ENDURANCE]: 15,
      [STATS.PERCEPTION]: 20,
      [STATS.INTELLIGENCE]: 50
    }
  },
  thermalRange: {
    min: -2.5,
    max: 0.5
  }
});

module.exports = global.Dwarf = Dwarf;

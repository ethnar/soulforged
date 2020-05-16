const Humanoid = require("./.humanoid");

class Orc extends Humanoid {
  dieOfOldAge() {
    if (
      this.getNode() instanceof Underground &&
      !this.getNode()
        .getCompleteStructures()
        .some(s => s instanceof GreenEggs) &&
      utils.chance(5)
    ) {
      this.getNode().addStructure(new GreenEggs());
    }
    super.dieOfOldAge();
  }

  spawn() {
    this.isOnMainland = true;
    const eggs = Entity.getEntities(GreenEggs);
    if (!eggs.length) {
      return false;
    }
    const startNode = utils.randomItem(eggs).getNode();
    startNode.addCreature(this);
    return true;
  }
}

Creature.factory(Orc, {
  name: "Orc",
  faction: Faction.getByName("Orc"),
  maxAge: 60,
  butcherable: {
    ...Humanoid.prototype.butcherable,
    nameable: "Orc",
    corpseName: () => Nameable.getName("Orc"),
    butcherName: () => `Butcher ${Nameable.getName("Orc")}`
  },
  agingTiers: {
    0: {
      [STATS.STRENGTH]: 25,
      [STATS.DEXTERITY]: 25,
      [STATS.ENDURANCE]: 35,
      [STATS.PERCEPTION]: 30,
      [STATS.INTELLIGENCE]: 10
    },
    9: {
      [STATS.STRENGTH]: 60,
      [STATS.DEXTERITY]: 60,
      [STATS.ENDURANCE]: 45,
      [STATS.PERCEPTION]: 50,
      [STATS.INTELLIGENCE]: 30
    },
    50: {
      [STATS.STRENGTH]: 60,
      [STATS.DEXTERITY]: 60,
      [STATS.ENDURANCE]: 45,
      [STATS.PERCEPTION]: 50,
      [STATS.INTELLIGENCE]: 30
    },
    60: {
      [STATS.STRENGTH]: 30,
      [STATS.DEXTERITY]: 10,
      [STATS.ENDURANCE]: 5,
      [STATS.PERCEPTION]: 5,
      [STATS.INTELLIGENCE]: 30
    }
  },
  thermalRange: {
    min: -1.5,
    max: 1.5
  }
});

module.exports = global.Orc = Orc;

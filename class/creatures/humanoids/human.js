const Humanoid = require("./.humanoid");

class Human extends Humanoid {
  spawn() {
    let startNode;
    const player = this.getPlayer();
    if (player && player.onRookIsland) {
      startNode = Entity.getById(2836);
      startNode.addResourceByType(Twigs, 15);
      startNode.addResourceByType(Pebbles, 20);
      this.satiated = 50;
      this.energy = 70;
      this.addBuff(BuffTutorialBlessing);
    } else {
      if (!player.isQuestFinished(QUESTS.TUTORIAL_5)) {
        player.mapData = {};
      }
      this.isOnMainland = true;
      const menhirNode = null; //Entity.getById(405);
      const lastCorpse = Entity.getEntities(Creature).find(
        c => c.lastPlayer === player && c.isDead()
      );
      if (lastCorpse) {
        lastCorpse.lastPlayer = null;
        startNode = lastCorpse.getNode();
      } else {
        startNode =
          menhirNode ||
          Entity.getEntities(Node).find(n => n.isType(NODE_TYPES.PLAINS));
      }

      const nearestNodeWithHealthyAdultHuman = startNode.findNearest(
        node =>
          node
            .getCreatures()
            .some(
              creature =>
                creature instanceof Human &&
                creature.getAge() > 15 &&
                creature.getAge() < 120 &&
                creature.moodTiered >= 75 &&
                !creature.isDead() &&
                !creature.hasEnemies()
            ),
        node => !node.isWater()
      );
      if (nearestNodeWithHealthyAdultHuman) {
        startNode = nearestNodeWithHealthyAdultHuman;
      } else {
        startNode = menhirNode;
      }
    }
    startNode.addCreature(this);
    return true;
  }
}

Creature.factory(Human, {
  name: "Human",
  faction: Faction.getByName("Human"),
  maxAge: 150,
  butcherable: {
    ...Humanoid.prototype.butcherable,
    nameable: "Human",
    corpseName: () => Nameable.getName("Human"),
    butcherName: () => `Butcher ${Nameable.getName("Human")}`
  },
  agingTiers: {
    0: {
      [STATS.STRENGTH]: 30,
      [STATS.DEXTERITY]: 30,
      [STATS.ENDURANCE]: 35,
      [STATS.PERCEPTION]: 30,
      [STATS.INTELLIGENCE]: 30
    },
    14: {
      [STATS.STRENGTH]: 50,
      [STATS.DEXTERITY]: 50,
      [STATS.ENDURANCE]: 50,
      [STATS.PERCEPTION]: 50,
      [STATS.INTELLIGENCE]: 50
    },
    120: {
      [STATS.STRENGTH]: 50,
      [STATS.DEXTERITY]: 50,
      [STATS.ENDURANCE]: 50,
      [STATS.PERCEPTION]: 50,
      [STATS.INTELLIGENCE]: 50
    },
    150: {
      [STATS.STRENGTH]: 25,
      [STATS.DEXTERITY]: 20,
      [STATS.ENDURANCE]: 10,
      [STATS.PERCEPTION]: 20,
      [STATS.INTELLIGENCE]: 50
    }
  }
});

module.exports = global.Human = Human;

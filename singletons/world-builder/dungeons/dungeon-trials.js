module.exports = {
  combat: require("./dungeon-trial-combat"),
  wisdom: require("./dungeon-trial-wisdom"),
  isTrialInProgress() {
    return !!world.trialDungeonRun;
  },
  startTrial(trialType, who) {
    const { dungeon, elements } = DungeonTrials[trialType].place();
    world.trialDungeonRun = {
      dungeon,
      dungeonElements: elements,
      entrance: elements.entrance,
      chaserSpawn: elements["start-location"],
      treasury: elements[""],
      testedCharacter: who,
      nextChaserIn: 12 * MINUTES,
      nextChaserTime: 12 * MINUTES
    };
    if (DungeonTrials[trialType].afterPlace) {
      DungeonTrials[trialType].afterPlace();
    }
    who.move(elements.entrance);
  },
  finishTrial() {
    world.trialDungeonRun.dungeon.roomNodes.forEach(room => {
      [...room.getItems()].forEach(item => {
        room.removeItem(item);
        world.trialDungeon.treasury.addItem(item);
      });
      [...room.getCreatures()].forEach(c => {
        c.annihilate();
      });
    });

    world.trialDungeonRun.dungeon.destroy();
    delete world.trialDungeonRun;
  },

  cycle(seconds) {
    if (DungeonTrials.isTrialInProgress()) {
      DungeonTrials.manageChasers(seconds);
      DungeonTrials.checkDead();
    }
  },

  manageChasers(seconds) {
    world.trialDungeonRun.nextChaserIn -= seconds;
    if (world.trialDungeonRun.nextChaserIn <= 0) {
      utils.log("Dungeon Trial - Spawned Venom Snake");
      const chaser = world.trialDungeonRun.chaserSpawn.spawnCreature(
        VenomSnake
      );
      chaser.dungeonCreep = true;
      chaser.dungeonChaser = true;
      chaser.chasingEnemy = world.trialDungeonRun.testedCharacter;

      world.trialDungeonRun.nextChaserTime = Math.max(
        world.trialDungeonRun.nextChaserTime - 1 * MINUTES,
        2 * MINUTES
      );
      world.trialDungeonRun.nextChaserIn +=
        world.trialDungeonRun.nextChaserTime;
    }
  },

  checkDead() {
    if (world.trialDungeonRun.testedCharacter.isDead()) {
      DungeonTrials.finishTrial();
    }
  }
};

const actions = Action.groupById([
  new Action({
    name: "TouchRune2",
    dynamicLabel: () => "Touch",
    icon: "/actions/icons8-so-so-100.png",
    notification: false,
    repeatable: false,
    notAllowedInCombat: true,
    valid(entity, creature) {
      const player = creature.getPlayer();
      if (!player) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (entity.getNode() !== creature.getNode()) {
        return "You must be in the same location to do that";
      }
      return true;
    },
    run(entity, creature) {
      creature.move(world.trialDungeon.treasury);
      utils.log(
        "Dungeon Trial - Finished",
        creature.getName(),
        creature.getPlayer().email
      );
      creature.logging(
        `The rune is warm to the touch. It causes you to briefly black out and you find yourself in a different room.`
      );
      DungeonTrials.finishTrial();
      return ACTION.FINISHED;
    }
  })
]);

class DungeonTrialExitRune extends Structure {
  static actions() {
    return actions;
  }

  getIcon(creature) {
    return this.constructor.getIcon(creature);
  }

  static getIcon(creature) {
    const icon = DungeonTrials.isTrialInProgress()
      ? "violet_21_red.png"
      : "violet_21_red_off.png";
    return server.getImage(creature, `/${ICONS_PATH}/structures/${icon}`);
  }
}
Entity.factory(DungeonTrialExitRune, {
  name: "Rune"
});

// TODO: finish on death
// TODO: spawn snakes

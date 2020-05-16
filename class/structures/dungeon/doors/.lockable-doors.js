const Doors = require("./.doors");

const actions = Action.groupById([
  new Action({
    name: "Unlock",
    icon: "/actions/icons8-key-2-100.png",
    quickAction: true,
    notification: false,
    repeatable: false,
    valid(entity, creature) {
      if (!entity.getPath()) {
        return false;
      }
      if (!entity.getPath().hasNode(creature.getNode())) {
        return false;
      }
      if (!entity.isClosed()) {
        return false;
      }
      if (!entity.locked) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (
        !entity.keyId ||
        !creature
          .getItems()
          .some(i => i instanceof Key && entity.keyId === i.keyId)
      ) {
        return `You don't have the right key.`;
      }
      return true;
    },
    run(entity, creature, seconds) {
      entity.locked = false;
      const key = creature
        .getItems()
        .find(i => i instanceof Key && entity.keyId === i.keyId);
      creature.logging(
        `You used the ${key.getName()} and the door is now unlocked.`,
        LOGGING.GOOD,
        false
      );
      return false;
    }
  }),
  new Action({
    name: "Pick the lock",
    icon: "/actions/icons8-padlock-100.png",
    quickAction: true,
    notification: false,
    repeatable: false,
    valid(entity, creature) {
      if (!entity.getPath()) {
        return false;
      }
      if (!entity.getPath().hasNode(creature.getNode())) {
        return false;
      }
      if (!entity.isClosed()) {
        return false;
      }
      if (!entity.locked) {
        return false;
      }
      if (
        !creature.knowsItem("BasicLockpicks") &&
        !creature.knowsItem("NormalLockpicks")
      ) {
        return false;
      }
      return true;
    },
    available(entity, creature) {
      if (!creature.getToolLevel(TOOL_UTILS.LOCKPICKING)) {
        return `You need the right tool equipped.`;
      }
      return true;
    },
    difficulty: (entity, creature) =>
      creature.getDifficultyLabel(SKILLS.LOCKPICKING, entity.lockLevel),
    run(entity, creature, seconds) {
      if (
        creature.progressingAction(
          seconds,
          20 * SECONDS,
          SKILLS.LOCKPICKING,
          TOOL_UTILS.LOCKPICKING,
          1
        )
      ) {
        let skillExperience = 5 * MINUTES;
        const skillExperienceMultiplier = creature.getSkillGainDifficultyMultiplier(
          SKILLS.LOCKPICKING,
          entity.lockLevel
        );

        const successChance = creature.getSkillSuccessChance(
          SKILLS.LOCKPICKING,
          entity.lockLevel
        );

        if (utils.chance(successChance)) {
          entity.locked = false;
          creature.gainSkill(
            SKILLS.LOCKPICKING,
            skillExperience,
            skillExperienceMultiplier
          );
          creature.gainStatsFromSkill(
            SKILLS.LOCKPICKING,
            creature.getTimeSpentOnAction() * 5
          );
          creature.logging(
            `The lock clicked gently and the door is unlocked.`,
            LOGGING.GOOD,
            false
          );
        } else {
          const injuryChance = 100 - successChance;
          const accidentMessage = creature.accidentChance(
            injuryChance / 2,
            entity.skill,
            entity.toolUtility
          );

          creature.logging(
            `The lock didn't click. ` + accidentMessage,
            LOGGING.WARN,
            false
          );
          creature.gainSkill(
            SKILLS.LOCKPICKING,
            skillExperience / 2,
            skillExperienceMultiplier
          );
          creature.gainStatsFromSkill(
            SKILLS.LOCKPICKING,
            creature.getTimeSpentOnAction() * 5
          );
        }

        return ACTION.CONTINUE;
      }

      return ACTION.CONTINUE;
    }
  })
]);

class LockableDoors extends Doors {
  static actions() {
    return { ...actions, ...Doors.actions() };
  }

  setLocked(locked, keyId, lockLevel) {
    this.wasLocked = true;
    this.locked = locked;
    this.keyId = keyId;
    this.lockLevel = lockLevel;
  }

  dungeonReset() {
    super.dungeonReset();
    if (this.wasLocked) {
      this.locked = true;
    }
  }
}

module.exports = global.LockableDoors = LockableDoors;

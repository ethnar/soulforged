const Item = require("../../.item");

const actions = Action.groupById([
  new Action({
    name: "Tend wounds",
    icon: "/actions/icons8-heart-outline-100.png",
    notAllowedInCombat: true,
    quickAction: true,
    dynamicLabel(entity) {
      let name = `Tend wounds`;
      if (entity.sourceBuff) {
        name += ` (${global[entity.sourceBuff].prototype.name})`;
      }
      return name;
    },
    difficulty: (entity, creature) =>
      creature.getDifficultyLabel(SKILLS.DOCTORING, entity.skillLevel),
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    onStarted(entity, creature) {
      creature.currentAction.context = "TendWounds";
      creature.currentAction.extra = creature.currentAction.extra || {};
      creature.currentAction.extra.medicalItem = entity.constructor.name;
    },
    runCheck(item, creature, context, repetitions, extra) {
      const tendingTo = Entity.getById(extra && extra.creatureId);

      if (!tendingTo) {
        return "Tending wounds was interrupted.";
      }

      if (tendingTo.isHostile(creature)) {
        return "You cannot tend wounds of hostile creatures.";
      }

      if (tendingTo.getNode() !== creature.getNode()) {
        return "You must be in the same location as the target to tend wounds.";
      }

      if (!item.canApplyMedication(tendingTo)) {
        return "No wounds to be tended with the selected item.";
      }
      return true;
    },
    run(item, creature, seconds) {
      const tendingTo = Entity.getById(
        creature.currentAction.extra && creature.currentAction.extra.creatureId
      );

      const efficiency = creature.getEfficiency(SKILLS.DOCTORING, null);

      creature.actionProgress +=
        (seconds * efficiency * 100) / (item.applicationTime / 2);

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        const successChance = creature.getSkillSuccessChance(
          SKILLS.DOCTORING,
          item.skillLevel
        );
        const successLevel = Math.min(
          100,
          successChance + utils.random(1, 100)
        );

        item.applyMedication(tendingTo, successLevel, creature, item);

        let skillExperience = item.applicationTime * item.skillGainMultiplier;

        creature.gainSkill(
          SKILLS.DOCTORING,
          skillExperience,
          creature.getSkillGainDifficultyMultiplier(
            SKILLS.DOCTORING,
            item.skillLevel
          )
        );
        creature.gainStatsFromSkill(
          SKILLS.DOCTORING,
          creature.getTimeSpentOnAction() * 5
        );

        const removed = item.useUpItem();
        if (removed) {
          creature.actionOnSimilarItem(item);
        }

        return false;
      }
      return true;
    },
    ...utils.jsAction("/js/actions/tend-wounds")
  })
]);

class MedicalItem extends Item {
  static actions() {
    return { ...actions, ...Item.actions() };
  }

  canApplyMedication(target) {
    return target.hasBuff(this.sourceBuff);
  }

  getPayload(creature) {
    const result = super.getPayload(creature);
    if (result && this.sourceBuff) {
      result.tendingEffect = global[this.sourceBuff].prototype.name;
    }
    return result;
  }

  applyMedication(target, successLevel, physician, item) {
    const relevantBuffs = target
      .getBuffs()
      .filter(b => b instanceof global[this.sourceBuff]);

    relevantBuffs.sort((a, b) => b.duration - a.duration);

    let remainingBatch = Math.round((this.maxBatch * successLevel) / 100);
    let totalCouldHeal = remainingBatch;

    physician.triggerQuestEvent(
      "tendWounds",
      item,
      remainingBatch,
      this.sourceBuff
    );

    while (remainingBatch && relevantBuffs.length) {
      const nextBuff = relevantBuffs.shift();
      const reducing = Math.min(remainingBatch, nextBuff.stacks);
      remainingBatch -= reducing;
      const remainingOldStacks = nextBuff.stacks - reducing;

      this.transformBuff(target, reducing, nextBuff, physician);
      target.removeBuff(nextBuff);

      if (remainingOldStacks && this.sourceBuff) {
        switch (this.sourceBuff) {
          case "BuffCut":
            target.damageCut(remainingOldStacks, nextBuff.duration, false);
            break;
          case "BuffBruise":
            target.damageBruised(remainingOldStacks, nextBuff.duration);
            break;
          case "BuffBurn":
            target.damageBurn(remainingOldStacks, nextBuff.duration);
            break;
        }
      }
    }

    const healed = totalCouldHeal - remainingBatch;
    const targetName =
      physician === target
        ? "your"
        : `${target.getName()}'s`.replace(/s's$/, `s'`);
    const buffName = global[this.sourceBuff].prototype.name;
    if (healed === 0) {
      physician.logging(`You failed to tend any wounds.`, LOGGING.FAIL, false);
    } else {
      physician.logging(
        `You have tended ${targetName} wounds: ${
          healed > 1 ? healed : "a"
        } ${buffName}${healed > 1 ? "s" : ""}`,
        LOGGING.NORMAL,
        false
      );
      if (physician !== target) {
        target.logging(
          `${physician.getName()} has tended your wounds: ${
            healed > 1 ? healed : "a"
          } ${buffName}${healed > 1 ? "s" : ""}`,
          LOGGING.NORMAL,
          false
        );
      }
    }
  }
}
Object.assign(MedicalItem.prototype, {
  applicationTime: 1 * MINUTES,
  skillGainMultiplier: 1
});
Action.registerContextualAction("TendWounds", (targetId, context, creature) => {
  const target = Entity.getById(targetId);
  if (target) {
    return target;
  }
  if (
    creature &&
    creature.currentAction &&
    creature.currentAction.extra &&
    creature.currentAction.extra.medicalItem
  ) {
    const medicalItem = creature.currentAction.extra.medicalItem;
    const item = creature
      .getAllAvailableItems(true, false)
      .find(item => item instanceof global[medicalItem]);
    if (item) {
      creature.currentAction.entityId = item.getEntityId();
    }
    return item;
  }
});

module.exports = global.MedicalItem = MedicalItem;

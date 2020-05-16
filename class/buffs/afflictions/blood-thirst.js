const afflictionFactory = require("./.affliction");

const name = "Bloodthirst";
const { incubation, symptomatic, immune } = afflictionFactory(name, {
  icon: `/${ICONS_PATH}/buffs/afflictions/red_31.png`,
  incubationPeriod: [2 * DAYS, 2.5 * DAYS],
  symptomaticPeriod: [2 * DAYS, 2.5 * DAYS],
  immunePeriod: [20 * DAYS, 30 * DAYS],
  symptomaticLevels: true,
  hidden: true,
  effects: {
    [BUFFS.STATS.STRENGTH]: -24,
    [BUFFS.STATS.DEXTERITY]: -24,
    [BUFFS.STATS.ENDURANCE]: -24,
    [BUFFS.STATS.PERCEPTION]: -24,
    [BUFFS.STATS.INTELLIGENCE]: -24,
    [BUFFS.INTERNAL_DAMAGE]: 20
  }
});

const BuffNeckPuncture = utils.newClassExtending(`BuffNeckPuncture`, Buff);
Object.assign(BuffNeckPuncture.prototype, {
  name: "Puncture Wound",
  icon: `/${ICONS_PATH}/buffs/afflictions/scifi_skill_p_22_recolor.png`,
  duration: 8 * HOURS,
  visible: true,
  effects: {
    [BUFFS.MOOD]: -2
  }
});

const BuffBloodFed = utils.newClassExtending(`BuffBloodFed`, Buff);
Object.assign(BuffBloodFed.prototype, {
  name: "Bloodthirst satisfied",
  icon: `/${ICONS_PATH}/buffs/afflictions/scifi_skill_r_21.png`,
  duration: 2 * DAYS,
  category: Buff.CATEGORIES.AFFLICTION,
  effects: {
    [BUFFS.MOOD]: +2,
    [BUFFS.STATS.DEXTERITY]: +5,
    [BUFFS.STATS.PERCEPTION]: +8,
    [BUFFS.STATS.INTELLIGENCE]: +5
  }
});

const NUTRITION = 5;

Humanoid.addAction(
  new Action({
    name: "Suck blood",
    icon: "/actions/icons8-restaurant-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    secondaryAction: true,
    valid(target, creature) {
      if (creature === target) {
        return false;
      }
      if (!creature.hasBuff(symptomatic)) {
        return false;
      }
      if (creature.isHostile(target)) {
        return false;
      }
      if (target.isDead()) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to interact";
      }
      if (target.blood <= 95) {
        return "Target does not have enough blood";
      }
      if (creature.satiated >= 100 - NUTRITION) {
        return "You are too full to do this right now";
      }
      if (
        target.hasBuff(incubation) ||
        target.hasBuff(symptomatic) ||
        target.hasBuff(immune)
      ) {
        return `Target's blood is not suitable`;
      }
      return true;
    },
    run(target, creature) {
      target.blood -= 35;
      target.addBuff(BuffNeckPuncture);
      if (utils.chance(5)) {
        incubation.applyBuff(target);
      }

      creature.modifyMaxAge(0.5);

      const symptom = creature.buffs.find(b => b instanceof symptomatic);
      creature.removeBuff(symptom);
      incubation.applyBuff(creature);
      BuffBloodFed.applyBuff(creature);
      creature.satiated += NUTRITION;

      return false;
    }
  })
);

/****** CURES *******/

class BloodthirstCure extends MedicalItem {
  canApplyMedication() {
    return true;
  }

  applyMedication(target, successLevel, physician) {
    let targetName, targetAdj;
    if (target === physician) {
      targetName = `yourself`;
      targetAdj = `you`;
    } else {
      targetName = target.getName();
      targetAdj = `they`;
    }

    if (
      target.hasBuff(`${name}Incubation`) ||
      target.hasBuff(`${name}Symptomatic`)
    ) {
      // cure
      target.removeBuff(`${name}Incubation`, false);
      target.removeBuff(`${name}Symptomatic`, false);
      target.removeBuff(`BuffBloodFeds`);
      curedBuff.applyBuff(target);
      global[`${name}Immune`].applyBuff(target);
      physician.logging(
        `As you splash ${targetName} with the substance ${targetAdj} release a high-pitched shriek and shake uncontrollably for a moment.`
      );
      if (target !== physician) {
        target.logging(
          `${physician.getName()} splashed you with some substance causing you to release a high-pitched shriek and shake uncontrollably for a moment.`
        );
      }
    } else {
      // backfire
      const bruise = utils.random(15, 30);
      const cut = utils.random(20, 40);
      const internal = utils.random(10, 15);
      const injuries = [
        `bruise ${bruise}`,
        `cut ${cut}`,
        `internal damage ${internal}`
      ].join(", ");
      physician.logging(
        `As you splash ${targetName} with the substance ${targetAdj} seem to be filled with uncontrollable rage ${
          target === physician
            ? "and thrash around violently"
            : "and assault you"
        }. You suffered injuries: ${injuries}.`
      );
      if (target !== physician) {
        target.logging(
          `${physician.getName()} splashed you with some substance which filled with uncontrollable rage and made you to assault them.`
        );
      }
      physician.damageBruised(bruise);
      physician.damageCut(cut);
      physician.damageInternal(internal);
    }
  }
}
Item.itemFactory(BloodthirstCure, {
  name: `${name} Cure`,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_2_pink.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.25,
  containerItemType: ClayFlask,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BatWing: 2,
      AlchemyIng3_1: 2,
      ClayFlask: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 4,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 20 * MINUTES
  },
  maxBatch: 1,
  skillLevel: 0,
  applicationTime: 3 * SECONDS,
  skillGainMultiplier: 10
});

const curedBuff = utils.newClassExtending(`Buff${name}Cured`, Buff);
Object.assign(curedBuff.prototype, {
  name: `${name} Cured`,
  icon: `/${ICONS_PATH}/buffs/afflictions/red_31_healed.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true,
  duration: 4 * DAYS,
  effects: {
    [BUFFS.MOOD]: -8,
    [BUFFS.PAIN]: 10,
    [BUFFS.STATS.DEXTERITY]: -3,
    [BUFFS.STATS.PERCEPTION]: -7,
    [BUFFS.STATS.INTELLIGENCE]: -10
  }
});

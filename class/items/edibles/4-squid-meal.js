const ClayPotMeal = require("./.clay-pot-meal");

class SquidMeal extends ClayPotMeal {}
Edible.itemFactory(SquidMeal, {
  name: "Lemon Squid",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/prehistoricicon_152_b_recolor.png`,
  timeToEat: 3,
  nutrition: 12,
  expiresIn: 3 * DAYS,
  calculateEffects: 4,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      FireSquid: 2,
      Lemon: 2,
      Bladewort: 1,
      ClayPot: 1
    },
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.CUTTING
  }
});

const Edible = require("./.edible");

class FriedTrout extends Edible {}
Edible.itemFactory(FriedTrout, {
  name: "Fried Trout",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/fs_01.png`,
  timeToEat: 3,
  nutrition: 10,
  expiresIn: 15 * DAYS,
  calculateEffects: 2,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Trout: 1,
      Flour: 2,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 1
  }
});
module.exports = global.FriedTrout = FriedTrout;

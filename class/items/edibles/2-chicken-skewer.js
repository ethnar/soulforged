const Edible = require("./.edible");

class FowlSkewer extends Edible {}
Edible.itemFactory(FowlSkewer, {
  name: "Fowl Skewer",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/food_15_t.png`,
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
      FowlMeat: 1,
      Carrot: 2,
      Twig: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 20 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 2
  }
});

module.exports = global.FowlSkewer = FowlSkewer;
Item.backwardCompatibility("ChickenSkewer", "FowlSkewer");

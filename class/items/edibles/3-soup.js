const ClayPotMeal = require("./.clay-pot-meal");

class MushroomSoup extends ClayPotMeal {}
Edible.itemFactory(MushroomSoup, {
  name: "Mushroom Soup",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/prehistoricicon_162_b.png`,
  timeToEat: 3,
  nutrition: 12,
  expiresIn: 5 * DAYS,
  calculateEffects: 3,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Mushroom: 3,
      Carrot: 1,
      TenderMeat: 1,
      ClayPot: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 3
  }
});

module.exports = global.MushroomSoup = MushroomSoup;

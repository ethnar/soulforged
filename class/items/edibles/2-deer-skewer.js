const Edible = require("./.edible");

class DeerSkewer extends Edible {}
Edible.itemFactory(DeerSkewer, {
  name: "Hearty Skewer",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/meat_08.png`,
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
      HeartyMeat: 1,
      Onion: 2,
      Twig: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 2
  }
});

module.exports = global.DeerSkewer = DeerSkewer;

const Edible = require("./.edible");

class Jerky extends Edible {}
Edible.itemFactory(Jerky, {
  name: "Jerky",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/jerky.png`,
  timeToEat: 3,
  nutrition: 8,
  weight: 0.3,
  expiresIn: 120 * DAYS,
  calculateEffects: 1,
  buffs: {
    [BUFFS.MOOD]: 2
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    result: {
      Jerky: 3
    },
    materials: {
      HeartyMeat: 3,
      Coal: 1
    },
    building: ["Kiln"],
    baseTime: 45 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 1
  }
});
module.exports = global.Jerky = Jerky;

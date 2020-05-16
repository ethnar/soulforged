const Edible = require("./.edible");

class FriedMuckEgg extends Edible {}
Edible.itemFactory(FriedMuckEgg, {
  name: "Fried Muck Egg",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/food_44_t_recolor.png`,
  timeToEat: 3,
  nutrition: 10,
  expiresIn: 8 * DAYS,
  calculateEffects: 3,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      MuckEgg: 1,
      Nightshade: 2,
      CoconutOpen: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 15 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 3
  }
});

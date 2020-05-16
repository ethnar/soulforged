class MushroomChicken extends ClayPotMeal {}
Edible.itemFactory(MushroomChicken, {
  name: "Sizzling Chicken",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/barbarian_icons_103_b.png`,
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
      FowlMeat: 1,
      Mushroom: 2,
      Bitterweed: 1,
      ClayPot: 1,
      Firewood: 1
    },
    building: ["Kiln"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 3
  }
});

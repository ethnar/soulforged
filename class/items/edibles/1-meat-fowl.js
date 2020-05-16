class FowlMeat extends Edible {}
Edible.itemFactory(FowlMeat, {
  nameable: true,
  name: "Fowl Meat",
  icon: `/${ICONS_PATH}/resources/popping/animals/wild_meat.png`,
  weight: 1,
  timeToEat: 3,
  nutrition: 10,
  calculateEffects: 1,
  buffs: {
    [BUFFS.MOOD]: -35
  }
});

Edible.makeCookedVersion(FowlMeat);

module.exports = global.FowlMeat = FowlMeat;
Item.backwardCompatibility("ChickenMeat", "FowlMeat");
Item.backwardCompatibility("CookedChickenMeat", "CookedFowlMeat");

class ToughMeat extends Edible {}
Edible.itemFactory(ToughMeat, {
  nameable: true,
  name: "Tough Meat",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_24.png`,
  weight: 1,
  timeToEat: 3,
  nutrition: 10,
  calculateEffects: 1,
  buffs: {
    [BUFFS.MOOD]: -35
  }
});
module.exports = global.ToughMeat = ToughMeat;

Edible.makeCookedVersion(ToughMeat, 1);
Item.backwardCompatibility("BearMeat", "ToughMeat");
Item.backwardCompatibility("CookedBearMeat", "CookedToughMeat");

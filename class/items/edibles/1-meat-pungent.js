class PungentMeat extends Edible {}
Edible.itemFactory(PungentMeat, {
  nameable: true,
  name: "Pungent Meat",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_122_b.png`,
  weight: 1,
  timeToEat: 3,
  nutrition: 8,
  calculateEffects: 1,
  buffs: {
    [BUFFS.MOOD]: -45
  }
});
module.exports = global.PungentMeat = PungentMeat;

Edible.makeCookedVersion(PungentMeat, 1);
Item.backwardCompatibility("WolfMeat", "PungentMeat");
Item.backwardCompatibility("CookedWolfMeat", "CookedPungentMeat");

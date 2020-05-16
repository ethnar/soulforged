class HeartyMeat extends Edible {}
Edible.itemFactory(HeartyMeat, {
  nameable: true,
  name: "Hearty Meat",
  icon: `/${ICONS_PATH}/resources/popping/animals/huntingicons_108_b.png`,
  weight: 1,
  timeToEat: 3,
  nutrition: 10,
  calculateEffects: 1,
  buffs: {
    [BUFFS.MOOD]: -15
  }
});
module.exports = global.HeartyMeat = HeartyMeat;

Edible.makeCookedVersion(HeartyMeat);
Item.backwardCompatibility("DeerMeat", "HeartyMeat");
Item.backwardCompatibility("CookedDeerMeat", "CookedHeartyMeat");

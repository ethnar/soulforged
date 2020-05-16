class TenderMeat extends Edible {}
Edible.itemFactory(TenderMeat, {
  nameable: true,
  name: "Tender Meat",
  icon: `/${ICONS_PATH}/resources/popping/animals/huntingicons_121_b.png`,
  weight: 1,
  timeToEat: 3,
  nutrition: 10,
  calculateEffects: 1,
  buffs: {
    [BUFFS.MOOD]: -25
  }
});
module.exports = global.TenderMeat = TenderMeat;

Edible.makeCookedVersion(TenderMeat);
Item.backwardCompatibility("RabbitMeat", "TenderMeat");
Item.backwardCompatibility("CookedRabbitMeat", "CookedTenderMeat");

const Edible = require("./.edible");

class VileMeat extends Edible {}
Edible.itemFactory(VileMeat, {
  nameable: true,
  name: "Vile Meat",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/huntingicons_84.png`,
  timeToEat: 3,
  nutrition: 10,
  weight: 1,
  buffs: {
    [BUFFS.MOOD]: -80
  }
});

Edible.makeCookedVersion(VileMeat, -1);

Object.assign(CookedVileMeat.prototype, {
  buffs: {
    [BUFFS.MOOD]: -30
  }
});

module.exports = global.VileMeat = VileMeat;

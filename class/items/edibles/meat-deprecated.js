const Edible = require("./.edible");

class Meat extends Edible {}
Object.assign(Meat.prototype, {
  name: "MeatDeprecated",
  icon: `/${ICONS_PATH}/items/edibles/prehistoricicon_97_b.png`,
  timeToEat: 3,
  nutrition: 1,
  weight: 3,
  buffs: {
    [BUFFS.MOOD]: -100
  }
});
module.exports = global.Meat = Meat;

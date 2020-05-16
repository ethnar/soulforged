const Edible = require("./.edible");
const ClayPot = require("../clay-pot");

class ClayPotMeal extends Edible {}
Object.assign(ClayPotMeal.prototype, {
  containerItemType: ClayPot
});
module.exports = global.ClayPotMeal = ClayPotMeal;

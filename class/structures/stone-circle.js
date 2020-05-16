const Structure = require("./.structure");

const fibonnaci = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

function unfibbonaci(number) {
  return fibonnaci.findIndex(n => number <= n);
}

class StoneCircle extends Structure {
  static getDescription() {
    return `A large number of massive stone slabs rest here. There is something particular about their arrangement.`;
  }
  getDescription() {
    let message = this.constructor.getDescription();
    switch (true) {
      case world.hasEvent(Sunrise): {
        const daysToNextFullMoon = FullMoon.timeToNextFullMoon();
        const number = unfibbonaci(daysToNextFullMoon + 1);
        const numberText = utils.numberToText(number);
        message += ` As the sun rises, you can't help but notice ${numberText} ${utils.pluralize(
          "shadow",
          number
        )} surrounding a flat stone with a circle etched into it.`;
        break;
      }
      case world.hasEvent(Sunset): {
        const daysToNextLongNight = Night.timeToNextLongNight();
        const number = unfibbonaci(daysToNextLongNight + 1);
        const numberText = utils.numberToText(number);
        message += ` As the sun rises, you can't help but notice ${numberText} ${utils.pluralize(
          "shadow",
          number
        )} that converge on the darkest spot in the stone circle.`;
        break;
      }
    }
    return message;
  }
}
Object.assign(StoneCircle.prototype, {
  name: "Stone Circle",
  cannotBeOccupied: true,
  icon: `tiles/structures/hexplainshenge00_mossyicon.png`,
  mapGraphic: {
    5: "tiles/structures/standingStonesMossy_small.png"
  }
});
module.exports = global.StoneCircle = StoneCircle;

const Resource = require("./.resource");
const Item = require("../items/.item");

class Twig extends Item {}
Object.assign(Twig.prototype, {
  name: "Twig",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/wd_b_05.png`,
  weight: 0.5
});

class Twigs extends Resource {}
Object.assign(Twigs.prototype, {
  name: "Twigs",
  skill: SKILLS.FORAGING,
  skillLevel: 0,
  produces: Twig,
  baseTime: 9 * SECONDS,
  sizeRange: [1, 50]
});

module.exports = global.Twig = Twig;
module.exports = global.Twigs = Twigs;

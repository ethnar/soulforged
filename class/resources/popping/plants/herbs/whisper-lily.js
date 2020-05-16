const Herbs = require("./.herbs");
const Item = require("../../../../items/.item");

class WhisperLily extends Item {}
Object.assign(WhisperLily.prototype, {
  dynamicName: () => `${Nameable.getName("WhisperLilies")}`,
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/lily_b.png`,
  weight: 0.05,
  order: ITEMS_ORDER.PLANTS
});

class WhisperLilies extends Herbs {}
Entity.factory(WhisperLilies, {
  name: "Whisper Lily",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: WhisperLily,
  skillLevel: 3,
  sizeRange: [20, 30],
  placement: {
    [NODE_TYPES.BOG]: 40
  },
  baseTime: 8 * MINUTES,
  activeFor: 7 * DAYS
});
module.exports = global.WhisperLily = WhisperLily;
module.exports = global.WhisperLilies = WhisperLilies;

const Drink = require("./.drink");
const LeatherPouch = require("../leather/leather-pouch");

class AntidotePowder extends Drink {}
Item.itemFactory(AntidotePowder, {
  name: "Antidote Powder",
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/pouch_b_antidote.png`,
  timeToDrink: 1,
  weight: 0.1,
  buffs: {
    [BUFFS.VENOM]: -30
  },
  containerItemType: LeatherPouch,
  timedBuff: [
    {
      duration: 30 * MINUTES,
      diminishingReturn: 0.8,
      effects: {
        [BUFFS.MOOD]: -15
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bonemeal: 4,
      SpiderIchor: 2,
      LeatherPouch: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 2,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 15 * MINUTES
  }
});
module.exports = global.AntidotePowder = AntidotePowder;

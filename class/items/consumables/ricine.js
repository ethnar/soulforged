const Drink = require("./.drink");
const ClayFlask = require("../clay-flask");
require("../../resources/popping/plants/herbs/acorn");
require("../../resources/popping/plants/herbs/muckroot");

class Ricine extends Drink {}
Item.itemFactory(Ricine, {
  name: "Ricine",
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_grey.png`,
  timeToDrink: 1,
  autoCalculateWeight: true,
  buffs: {
    [BUFFS.SATIATION]: -40
  },
  containerItemType: ClayFlask,
  timedBuff: [
    {
      duration: 30 * MINUTES,
      diminishingReturn: 0.8,
      effects: {
        [BUFFS.MOOD]: -5
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Acorn: 4,
      Muckroot: 2,
      ClayFlask: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 0,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 15 * MINUTES
  }
});

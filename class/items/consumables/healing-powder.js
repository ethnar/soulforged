const DrinkAddictive = require("./.drink-addictive");
const LeatherPouch = require("../leather/leather-pouch");

class HealingPowder extends DrinkAddictive {}
Item.itemFactory(HealingPowder, {
  name: "Sedative Powder",
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/pouch_b_heal.png`,
  timeToDrink: 1,
  weight: 0.1,
  containerItemType: LeatherPouch,
  timedBuff: [
    {
      duration: 5 * HOURS,
      diminishingReturn: 0.8,
      effects: {
        [BUFFS.PAIN]: -15
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bonemeal: 8,
      Bitterweed: 2,
      LeatherPouch: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 1,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 15 * MINUTES
  }
});

HealingPowder.makeAddictive({
  addictiveness: 4, // % chance to get addicted per doses taken in addictivenessTime
  addictivenessTime: 6 * DAYS,
  levelDownTime: 3 * DAYS, // time it takes to drop off 1 dependence level
  withdrawalEffect: {
    // maximum withdrawal effects
    [BUFFS.MOOD]: -4,
    [BUFFS.PAIN]: +28
  },
  withdrawalKickInTime: 2 * DAYS // what time withdrawal kicks in
});

module.exports = global.HealingPowder = HealingPowder;

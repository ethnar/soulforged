const DrinkAddictive = require("./.drink-addictive");
const LeatherPouch = require("../leather/leather-pouch");

class SpeedUp extends DrinkAddictive {}
Item.itemFactory(SpeedUp, {
  name: "Blaze",
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/pouch_b_orange.png`,
  timeToDrink: 1,
  weight: 0.1,
  containerItemType: LeatherPouch,
  timedBuff: [
    {
      duration: 2 * HOURS,
      diminishingReturn: 0.5,
      effects: {
        [BUFFS.TRAVEL_SPEED]: +10
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bladewort: 1,
      DuskCrowFeather: 2,
      LeatherPouch: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 3,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 20 * MINUTES
  }
});

SpeedUp.makeAddictive({
  addictiveness: 6, // % chance to get addicted per doses taken in addictivenessTime
  addictivenessTime: 6 * DAYS,
  levelDownTime: 1.5 * DAYS, // time it takes to drop off 1 dependence level
  withdrawalEffect: {
    // maximum withdrawal effects
    [BUFFS.TRAVEL_SPEED]: -15,
    [BUFFS.MOOD]: -15
  },
  withdrawalKickInTime: 2 * DAYS // what time withdrawal kicks in
});

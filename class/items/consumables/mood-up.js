const DrinkAddictive = require("./.drink-addictive");
const ClayPot = require("../clay-pot");

class MoodUp extends DrinkAddictive {}
Item.itemFactory(MoodUp, {
  name: "Fizz",
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/essence_02_b.png`,
  timeToDrink: 1,
  weight: 0.22,
  containerItemType: ClayPot,
  timedBuff: [
    {
      duration: 1 * HOURS,
      diminishingReturn: 0.8,
      effects: {
        [BUFFS.MOOD]: +10
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BatWing: 1,
      WhisperLily: 2,
      ClayPot: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 2,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 20 * MINUTES
  }
});

MoodUp.makeAddictive({
  addictiveness: 15, // % chance to get addicted per doses taken in addictivenessTime
  addictivenessTime: 4 * DAYS,
  levelDownTime: 8 * DAYS, // time it takes to drop off 1 dependence level
  withdrawalEffect: {
    // maximum withdrawal effects
    [BUFFS.MOOD]: -30,
    [BUFFS.STATS.INTELLIGENCE]: -25
  },
  withdrawalKickInTime: 3 * DAYS // what time withdrawal kicks in
});

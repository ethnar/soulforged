const DrinkAddictive = require("./.drink-addictive");

const duration = 2 * HOURS;
const container = "ClayFlask";

class StrengthUp1 extends DrinkAddictive {}
Item.itemFactory(StrengthUp1, {
  name: `Mule's Strength`,
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_blue.png`,
  timeToDrink: 1,
  weight: 0.3,
  containerItemType: global[container],
  timedBuff: [
    {
      duration: duration,
      diminishingReturn: 0.5,
      effects: {
        [BUFFS.STATS.STRENGTH]: +8,
        [BUFFS.STATS.DEXTERITY]: -3,
        [BUFFS.STATS.ENDURANCE]: -3
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AlchemyIng1_1: 2,
      AlchemyIng1_2: 2,
      [container]: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 3,
    baseTime: 30 * MINUTES
  }
});

StrengthUp1.makeAddictive({
  addictiveness: 2, // % chance to get addicted per doses taken in addictivenessTime
  addictivenessTime: 21 * DAYS,
  levelDownTime: 5 * DAYS, // time it takes to drop off 1 dependence level
  withdrawalEffect: {
    // maximum withdrawal effects
    [BUFFS.STRENGTH]: -8,
    [BUFFS.DEXTERITY]: -3,
    [BUFFS.ENDURANCE]: -3
  },
  withdrawalKickInTime: 3 * DAYS // what time withdrawal kicks in
});

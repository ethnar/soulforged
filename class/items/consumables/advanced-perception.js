const DrinkAddictive = require("./.drink-addictive");

const duration = 2 * HOURS;
const container = "ClayFlask";

class PerceptionUp1 extends DrinkAddictive {}
Item.itemFactory(PerceptionUp1, {
  name: `Eagle's sight`,
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_green.png`,
  timeToDrink: 1,
  weight: 0.3,
  containerItemType: global[container],
  timedBuff: [
    {
      duration: duration,
      diminishingReturn: 0.5,
      effects: {
        [BUFFS.STATS.PERCEPTION]: +8
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AlchemyIng1_1: 2,
      AlchemyIng1_3: 2,
      [container]: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 3,
    baseTime: 30 * MINUTES
  }
});

PerceptionUp1.makeAddictive({
  addictiveness: 4, // % chance to get addicted per doses taken in addictivenessTime
  addictivenessTime: 21 * DAYS,
  levelDownTime: 5 * DAYS, // time it takes to drop off 1 dependence level
  withdrawalEffect: {
    // maximum withdrawal effects
    [BUFFS.PERCEPTION]: -10
  },
  withdrawalKickInTime: 3 * DAYS // what time withdrawal kicks in
});

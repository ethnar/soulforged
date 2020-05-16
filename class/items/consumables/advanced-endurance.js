const DrinkAddictive = require("./.drink-addictive");

const duration = 1 * HOURS;
const container = "ClayFlask";

class EnduranceUp1 extends DrinkAddictive {}
Item.itemFactory(EnduranceUp1, {
  name: `Bull's resilience`,
  nameable: true,
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_yellow.png`,
  timeToDrink: 1,
  weight: 0.3,
  containerItemType: global[container],
  buffs: {
    [BUFFS.ENERGY]: -30
  },
  timedBuff: [
    {
      duration: duration,
      diminishingReturn: 0,
      effects: {
        [BUFFS.STATS.ENDURANCE]: +15,
        [BUFFS.ENERGY]: +30
      }
    }
  ],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AlchemyIng1_2: 2,
      AlchemyIng1_4: 2,
      [container]: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 4,
    baseTime: 30 * MINUTES
  }
});

EnduranceUp1.makeAddictive({
  addictiveness: 1, // % chance to get addicted per doses taken in addictivenessTime
  addictivenessTime: 21 * DAYS,
  levelDownTime: 5 * DAYS, // time it takes to drop off 1 dependence level
  withdrawalEffect: {
    // maximum withdrawal effects
    [BUFFS.MOOD]: -12,
    [BUFFS.ENDURANCE]: -8
  },
  withdrawalKickInTime: 3 * DAYS // what time withdrawal kicks in
});

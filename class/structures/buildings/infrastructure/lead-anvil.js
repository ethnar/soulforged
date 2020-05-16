const Building = require("../.building");

class Anvil extends Building {}
Building.buildingFactory(Anvil, {
  dynamicName: () => `${Nameable.getName("MeltedLead")} Anvil`,
  deteriorationRate: 8 * MONTHS,
  baseTime: 30 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/infrastructure/anvil_b_01.png`,
  research: {
    sameAsCrafting: true
  },
  materials: {
    LeadIngot: 80,
    LeadWire: 20
    // DONE
  },
  buffs: {
    [BUFFS.SKILL_SPEED[SKILLS.SMITHING]]: 50
  }
});

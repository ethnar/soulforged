const Item = require("../../.item");

class CaveSpiderTamingTool extends Item {}
Item.itemFactory(CaveSpiderTamingTool, {
  dynamicName: () => `${Nameable.getName("CaveSpider")} Taming Collar`,
  icon: `/${ICONS_PATH}/items/equipment/taming/96_b_iron.png`,
  order: ITEMS_ORDER.TOOLS,
  weight: 1.2,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.TAMING]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Taming: 0,
      VileMeat: 1
    }
  },
  crafting: {
    materials: {
      RatTail: 6,
      SpiderIchor: 2,
      AcaciaWood: 1,
      LeatherRope: 1,
      IronIngot: 1
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 3,
    baseTime: 30 * MINUTES
  },
  buffs: {
    ["Allows Taming (requires having Vile Meat)"]: 1
  }
});
global.DISCRETE_BUFFS["Allows Taming (requires having Vile Meat)"] = true;
module.exports = global.CaveSpiderTamingTool = CaveSpiderTamingTool;

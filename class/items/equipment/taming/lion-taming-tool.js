const Item = require("../../.item");

class LionTamingTool extends Item {}
Item.itemFactory(LionTamingTool, {
  dynamicName: () => `${Nameable.getName("Lion")} Taming Collar`,
  icon: `/${ICONS_PATH}/items/equipment/taming/foresticons_50_b.png`,
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
      ToughMeat: 1
    }
  },
  crafting: {
    materials: {
      LionSkin: 1,
      IronBuckle: 1,
      LeatherStraps: 4,
      LeatherRope: 2
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 30 * MINUTES
  },
  buffs: {
    ["Allows Taming (requires having Tough Meat)"]: 1
  }
});
global.DISCRETE_BUFFS["Allows Taming (requires having Tough Meat)"] = true;
module.exports = global.LionTamingTool = LionTamingTool;

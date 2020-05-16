const Item = require("../../.item");

class BearTamingTool extends Item {}
Item.itemFactory(BearTamingTool, {
  dynamicName: () => `${Nameable.getName("Bear")} Taming Collar`,
  icon: `/${ICONS_PATH}/items/equipment/taming/foresticons_50_b_recolor.png`,
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
      TenderMeat: 1
    }
  },
  crafting: {
    materials: {
      BearHide: 1,
      CopperBuckle: 1,
      LeatherStraps: 4,
      LeatherRope: 2
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 30 * MINUTES
  },
  buffs: {
    ["Allows Taming (requires having Tender Meat)"]: 1
  }
});
global.DISCRETE_BUFFS["Allows Taming (requires having Tender Meat)"] = true;
module.exports = global.BearTamingTool = BearTamingTool;

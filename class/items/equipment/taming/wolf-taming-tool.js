const Item = require("../../.item");

class WolfTamingTool extends Item {}
Item.itemFactory(WolfTamingTool, {
  dynamicName: () => `${Nameable.getName("Wolf")} Taming Collar`,
  icon: `/${ICONS_PATH}/items/equipment/taming/tradingicons_80.png`,
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
      HeartyMeat: 1
    }
  },
  crafting: {
    materials: {
      WolfHide: 1,
      LeatherStraps: 2,
      LeatherRope: 1
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 30 * MINUTES
  },
  buffs: {
    ["Allows Taming (requires having Hearty Meat)"]: 1
  }
});
global.DISCRETE_BUFFS["Allows Taming (requires having Hearty Meat)"] = true;
module.exports = global.WolfTamingTool = WolfTamingTool;

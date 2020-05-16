const Item = require("../../.item");

class DirewolfTamingTool extends Item {}
Item.itemFactory(DirewolfTamingTool, {
  dynamicName: () => `${Nameable.getName("Wolf")} Taming Collar`,
  icon: `/${ICONS_PATH}/items/equipment/taming/tradingicons_80_2.png`,
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
      WolfHide: 3,
      LeatherStraps: 2,
      BronzeBuckle: 1
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 30 * MINUTES
  },
  buffs: {
    ["Allows Taming (requires having Hearty Meat)"]: 1
  }
});
global.DISCRETE_BUFFS["Allows Taming (requires having Hearty Meat)"] = true;
module.exports = global.DirewolfTamingTool = DirewolfTamingTool;

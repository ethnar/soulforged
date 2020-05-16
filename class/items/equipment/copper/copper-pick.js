const Item = require("../../.item");

const COPPER_RATIO = 4;

class CopperPickHead extends Item {}
Item.itemFactory(CopperPickHead, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Pick Head`,
  order: ITEMS_ORDER.OTHER,
  weight: COPPER_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/copper/pick_b_02_copper_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      PickHeadMold: 1,
      MeltedCopper: COPPER_RATIO
    },
    result: {
      CopperPickHead: 1,
      PickHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 0,
    baseTime: 15 * MINUTES
  }
});

class CopperPick extends CopperEquipment {}
Item.itemFactory(CopperPick, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Pick`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/copper/pick_b_02_copper.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MINING]: 1.2,
    [TOOL_UTILS.CARVING]: 0.25
  },
  crafting: {
    autoLearn: true,
    materials: {
      CopperPickHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.CopperPick = CopperPick;

const Item = require("../../.item");

const COPPER_RATIO = 4;

class CopperHoeHead extends Item {}
Item.itemFactory(CopperHoeHead, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Hoe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: COPPER_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/copper/195_b_copper_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HoeHeadMold: 1,
      MeltedCopper: COPPER_RATIO
    },
    result: {
      CopperHoeHead: 1,
      HoeHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});

class CopperHoe extends CopperEquipment {}
Item.itemFactory(CopperHoe, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Hoe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/copper/195_b_copper.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.HOE]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      CopperHoeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.CopperHoe = CopperHoe;

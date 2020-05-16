const Item = require("../../.item");

const TIN_RATIO = 4;

class TinHoeHead extends Item {}
Item.itemFactory(TinHoeHead, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Hoe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: TIN_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/tin/195_b_tin_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HoeHeadMold: 1,
      MeltedTin: TIN_RATIO
    },
    result: {
      TinHoeHead: 1,
      HoeHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    baseTime: 15 * MINUTES
  }
});

class TinHoe extends TinEquipment {}
Item.itemFactory(TinHoe, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Hoe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/tin/195_b_tin.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.HOE]: 1
  },
  crafting: {
    autoLearn: true,
    materials: {
      TinHoeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.TinHoe = TinHoe;

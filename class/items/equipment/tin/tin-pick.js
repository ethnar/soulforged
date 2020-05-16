const Item = require("../../.item");

const TIN_RATIO = 4;

class TinPickHead extends Item {}
Item.itemFactory(TinPickHead, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Pick Head`,
  order: ITEMS_ORDER.OTHER,
  weight: TIN_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/tin/pick_b_02_tin_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      PickHeadMold: 1,
      MeltedTin: TIN_RATIO
    },
    result: {
      TinPickHead: 1,
      PickHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});

class TinPick extends TinEquipment {}
Item.itemFactory(TinPick, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Pick`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/tin/pick_b_02_tin.png`,
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
      TinPickHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.TinPick = TinPick;

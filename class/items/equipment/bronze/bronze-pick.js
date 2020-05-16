const Item = require("../../.item");

const BRONZE_RATIO = 4;

class BronzePickHead extends Item {}
Item.itemFactory(BronzePickHead, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Pick Head`,
  order: ITEMS_ORDER.OTHER,
  weight: BRONZE_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/bronze/pick_b_02_bronze_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      PickHeadMold: 1,
      MeltedBronze: BRONZE_RATIO
    },
    result: {
      BronzePickHead: 1,
      PickHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    baseTime: 15 * MINUTES
  }
});

class BronzePick extends BronzeEquipment {}
Item.itemFactory(BronzePick, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Pick`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/bronze/pick_b_02_bronze.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MINING]: 1.4,
    [TOOL_UTILS.CARVING]: 0.35
  },
  crafting: {
    autoLearn: true,
    materials: {
      BronzePickHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.BronzePick = BronzePick;

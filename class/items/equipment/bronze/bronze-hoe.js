const Item = require("../../.item");

const BRONZE_RATIO = 4;

class BronzeHoeHead extends Item {}
Item.itemFactory(BronzeHoeHead, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Hoe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: BRONZE_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/bronze/195_b_bronze_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HoeHeadMold: 1,
      MeltedBronze: BRONZE_RATIO
    },
    result: {
      BronzeHoeHead: 1,
      HoeHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 3,
    baseTime: 15 * MINUTES
  }
});

class BronzeHoe extends BronzeEquipment {}
Item.itemFactory(BronzeHoe, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Hoe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  icon: `/${ICONS_PATH}/items/equipment/bronze/195_b_bronze.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.HOE]: 1.2
  },
  crafting: {
    autoLearn: true,
    materials: {
      BronzeHoeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.BronzeHoe = BronzeHoe;

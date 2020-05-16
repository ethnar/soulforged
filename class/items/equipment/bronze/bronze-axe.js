const BronzeEquipment = require("./.bronze-equipment");

const BRONZE_RATIO = 3;

class BronzeAxeHead extends Item {}
Item.itemFactory(BronzeAxeHead, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Axe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: BRONZE_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/bronze/nw_b_03_bronze_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AxeHeadMold: 1,
      MeltedBronze: BRONZE_RATIO
    },
    result: {
      BronzeAxeHead: 1,
      AxeHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    baseTime: 15 * MINUTES
  }
});

class BronzeAxe extends BronzeEquipment {}
Item.itemFactory(BronzeAxe, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Axe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.SLICE]: 15,
    [DAMAGE_TYPES.PIERCE]: 9
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/bronze/nw_b_03_bronze.png`,
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1.4
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      BronzeAxeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.BronzeAxe = BronzeAxe;
module.exports = global.BronzeAxeHead = BronzeAxeHead;

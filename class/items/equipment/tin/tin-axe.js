const TinEquipment = require("./.tin-equipment");

const TIN_RATIO = 3;

class TinAxeHead extends Item {}
Item.itemFactory(TinAxeHead, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Axe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: TIN_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/tin/nw_b_03_tin_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AxeHeadMold: 1,
      MeltedTin: TIN_RATIO
    },
    result: {
      TinAxeHead: 1,
      AxeHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});

class TinAxe extends TinEquipment {}
Item.itemFactory(TinAxe, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Axe`,
  order: ITEMS_ORDER.TOOLS,
  weight: TIN_RATIO + 0.4,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 2,
    [DAMAGE_TYPES.SLICE]: 13,
    [DAMAGE_TYPES.PIERCE]: 7
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/tin/nw_b_03_tin.png`,
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1.2
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      TinAxeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.TinAxe = TinAxe;
module.exports = global.TinAxeHead = TinAxeHead;

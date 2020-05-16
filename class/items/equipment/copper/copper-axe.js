const CopperEquipment = require("./.copper-equipment");

const COPPER_RATIO = 3;

class CopperAxeHead extends Item {}
Item.itemFactory(CopperAxeHead, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Axe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: COPPER_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/copper/nw_b_03_copper_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AxeHeadMold: 1,
      MeltedCopper: COPPER_RATIO
    },
    result: {
      CopperAxeHead: 1,
      AxeHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 0,
    baseTime: 15 * MINUTES
  }
});

class CopperAxe extends CopperEquipment {}
Item.itemFactory(CopperAxe, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Axe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 2,
    [DAMAGE_TYPES.SLICE]: 13,
    [DAMAGE_TYPES.PIERCE]: 7
  },
  hitChance: WeaponSystem.BASE_HIT.SWORD,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/copper/nw_b_03_copper.png`,
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
      CopperAxeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.CopperAxe = CopperAxe;
module.exports = global.CopperAxeHead = CopperAxeHead;

const SteelEquipment = require("./.steel-equipment");

class SteelAxeHead extends Item {}
Item.itemFactory(SteelAxeHead, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Axe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 3,
  icon: `/${ICONS_PATH}/items/equipment/steel/nw_b_03_steel_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelIngot: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class SteelAxe extends SteelEquipment {}
Item.itemFactory(SteelAxe, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Axe`,
  order: ITEMS_ORDER.TOOLS,
  weight: 3.5,
  damage: {
    [DAMAGE_TYPES.SLICE]: 22,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/steel/nw_b_03_steel.png`,
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1.8
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      SteelAxeHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.SteelAxe = SteelAxe;
module.exports = global.SteelAxeHead = SteelAxeHead;

const IronEquipment = require("./.iron-equipment");

class IronAxeHead extends Item {}
Item.itemFactory(IronAxeHead, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Axe Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 2,
  icon: `/${ICONS_PATH}/items/equipment/iron/nw_b_03_iron_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronIngot: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class IronAxe extends IronEquipment {}
Item.itemFactory(IronAxe, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Axe`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.SLICE]: 18,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/iron/nw_b_03_iron.png`,
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1.6
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      IronAxeHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.IronAxe = IronAxe;
module.exports = global.IronAxeHead = IronAxeHead;

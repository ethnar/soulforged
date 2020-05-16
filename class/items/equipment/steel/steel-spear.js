const Item = require("../../.item");

class SteelSpearHead extends Item {}
Item.itemFactory(SteelSpearHead, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Spear Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.75,
  icon: `/${ICONS_PATH}/items/equipment/steel/nw_b_04_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelRod: 1
    },
    result: {
      SteelSpearHead: 2
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class SteelSpear extends SteelEquipment {}
Item.itemFactory(SteelSpear, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Spear`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 10,
    [DAMAGE_TYPES.PIERCE]: 20
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.3
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/steel/nw_b_04.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 1.7,
    [TOOL_UTILS.FISHING]: 0.9
  },
  crafting: {
    autoLearn: true,
    materials: {
      SteelSpearHead: 1,
      LeatherRope: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.SteelSpear = SteelSpear;

const Item = require("../../.item");

class SteelKnife extends SteelEquipment {}
Item.itemFactory(SteelKnife, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Knife`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 24,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/steel/kn_b_11_steel.png`,
  weight: 1.5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1.8,
    [TOOL_UTILS.SAWING]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelIngot: 1
    },
    result: {
      SteelKnife: 2
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});
module.exports = global.SteelKnife = SteelKnife;

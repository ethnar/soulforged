const Item = require("../../.item");

class IronKnife extends IronEquipment {}
Item.itemFactory(IronKnife, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Knife`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 18,
    [DAMAGE_TYPES.PIERCE]: 6
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/iron/kn_b_11_iron.png`,
  weight: 1.5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1.6,
    [TOOL_UTILS.SAWING]: 0.4
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronIngot: 1
    },
    result: {
      IronKnife: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});
module.exports = global.IronKnife = IronKnife;

const Item = require("../../.item");

class Axe211 extends IronEquipment {}
Item.itemFactory(Axe211, {
  nameable: true,
  checkWeapon: true,
  name: "Battleaxe",
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 22,
    [DAMAGE_TYPES.PIERCE]: 13
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 1.1,
      [DAMAGE_TYPES.PIERCE]: 0.5
    }
  },
  hitChance: WeaponSystem.BASE_HIT.AXE - 5,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/nw_b_07.png`,
  weight: 5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperPlate: 2,
      IronIngot: 2,
      WoodenShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

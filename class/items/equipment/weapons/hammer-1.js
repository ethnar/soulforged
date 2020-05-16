const Item = require("../../.item");

class Hammer31 extends CopperEquipment {}
Item.itemFactory(Hammer31, {
  checkWeapon: true,
  name: "Plain Sledgehammer",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 23,
    [DAMAGE_TYPES.PIERCE]: 8
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.BLUNT]: 1.3
    }
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER - 5,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/weapons/hm_b_12.png`,
  weight: 6,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HAMMER]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperIngot: 4,
      CopperMetalRing: 2,
      WoodenShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

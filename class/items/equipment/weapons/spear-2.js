const Item = require("../../.item");

class Spear727 extends SteelEquipment {}
Item.itemFactory(Spear727, {
  checkWeapon: true,
  name: "Jagged Spear",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 13,
    [DAMAGE_TYPES.PIERCE]: 14
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 0.6,
      [DAMAGE_TYPES.PIERCE]: 2
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5,
    [BUFFS.DODGE_MULTIPLIER]: 105
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/weapons/sp_b_01.png`,
  weight: 3,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 0.5,
    [TOOL_UTILS.FISHING]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TinRod: 3,
      SteelRod: 2,
      WoodenShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 6,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 120 * MINUTES
  }
});

const Item = require("../../.item");

class Sword335 extends CopperEquipment {}
Item.itemFactory(Sword335, {
  checkWeapon: true,
  name: "Plain Sword",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 14,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 0.8,
      [DAMAGE_TYPES.PIERCE]: 1
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5,
    [BUFFS.DODGE_MULTIPLIER]: 105
  },
  hitChance: WeaponSystem.BASE_HIT.SWORD,
  weaponSkill: SKILLS.FIGHTING_SWORD,
  icon: `/${ICONS_PATH}/items/equipment/weapons/108_b_copper.png`,
  weight: 4,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.CUTTING]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperRod: 2,
      CopperIngot: 2,
      WoodenShaft: 1,
      LeatherStraps: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

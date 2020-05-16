const Item = require("../../.item");

class Sword420 extends SteelEquipment {}
Item.itemFactory(Sword420, {
  checkWeapon: true,
  name: "Curved Sword",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 10,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  skillCoefficients: {
    hitChance: 2,
    damage: {
      [DAMAGE_TYPES.SLICE]: 3.8,
      [DAMAGE_TYPES.PIERCE]: -1
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5,
    [BUFFS.DODGE_MULTIPLIER]: 105
  },
  hitChance: WeaponSystem.BASE_HIT.SWORD - 5,
  weaponSkill: SKILLS.FIGHTING_SWORD,
  icon: `/${ICONS_PATH}/items/equipment/weapons/sword_b_08_steel.png`,
  weight: 3.5,
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
      SteelRod: 3,
      CopperMetalRing: 1,
      Emerald: 1,
      PalmWood: 1,
      BearLeather: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 7,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 160 * MINUTES
  }
});

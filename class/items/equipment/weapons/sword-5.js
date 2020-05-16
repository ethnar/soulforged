const Item = require("../../.item");

class Sword638 extends SteelEquipment {}
Item.itemFactory(Sword638, {
  checkWeapon: true,
  // name: "Curved Sword",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 10,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 3.5,
      [DAMAGE_TYPES.PIERCE]: 3.5
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.8,
    [BUFFS.DODGE_MULTIPLIER]: 110
  },
  hitChance: WeaponSystem.BASE_HIT.SWORD,
  weaponSkill: SKILLS.FIGHTING_SWORD,
  icon: `/${ICONS_PATH}/items/equipment/weapons/nw_b_08.png`,
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
      SteelRod: 4,
      AncientBone: 1,
      CutDiamond: 1,
      MahoganyWood: 1,
      ElephantSkin: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 7,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 300 * MINUTES
  }
});

const Item = require("../../.item");

class Knife883 extends SteelEquipment {}
Item.itemFactory(Knife883, {
  checkWeapon: true,
  name: "Decorative Knife",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 18,
    [DAMAGE_TYPES.PIERCE]: 2
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 1.6
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 1,
    [BUFFS.DODGE_MULTIPLIER]: 120
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/sv_b_15.png`,
  weight: 1,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelIngot: 1,
      CopperMetalRing: 1,
      SnakeSkin: 1,
      LeatherStraps: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 120 * MINUTES
  }
});

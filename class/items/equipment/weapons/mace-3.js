const Item = require("../../.item");

class Mace442 extends LeadEquipment {}
Item.itemFactory(Mace442, {
  checkWeapon: true,
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 10,
    [DAMAGE_TYPES.PIERCE]: 8,
    [DAMAGE_TYPES.SLICE]: 8
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.BLUNT]: 2.1,
      [DAMAGE_TYPES.SLICE]: 1.2,
      [DAMAGE_TYPES.PIERCE]: 1.2
    }
  },
  hitChance: WeaponSystem.BASE_HIT.MACE,
  weaponSkill: SKILLS.FIGHTING_MACE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/9255_b.png`,
  weight: 6,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AcaciaWood: 1,
      HardwoodShaft: 1,
      CutRuby: 1,
      SteelMetalRing: 3,
      AncientBone: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 7,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 180 * MINUTES
  }
});

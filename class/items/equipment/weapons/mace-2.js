const Item = require("../../.item");

class Mace252 extends LeadEquipment {}
Item.itemFactory(Mace252, {
  checkWeapon: true,
  name: "Morningstar",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 13,
    [DAMAGE_TYPES.SLICE]: 2,
    [DAMAGE_TYPES.PIERCE]: 6
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.BLUNT]: 1.5,
      [DAMAGE_TYPES.SLICE]: 1.1,
      [DAMAGE_TYPES.PIERCE]: 1
    }
  },
  hitChance: WeaponSystem.BASE_HIT.MACE,
  weaponSkill: SKILLS.FIGHTING_MACE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/bl_b_07x.png`,
  weight: 5,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeadRod: 3,
      LeadMetalRing: 1,
      HardwoodShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 6,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 90 * MINUTES
  }
});

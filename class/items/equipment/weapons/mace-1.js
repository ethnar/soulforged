const Item = require("../../.item");

class Mace521 extends IronEquipment {}
Item.itemFactory(Mace521, {
  checkWeapon: true,
  name: "Spiked Mace",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 16,
    [DAMAGE_TYPES.SLICE]: 8,
    [DAMAGE_TYPES.PIERCE]: 12
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.BLUNT]: 0.8,
      [DAMAGE_TYPES.PIERCE]: 0.5
    }
  },
  hitChance: WeaponSystem.BASE_HIT.MACE,
  weaponSkill: SKILLS.FIGHTING_MACE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/bl_b_01x.png`,
  weight: 5,
  slots: {
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronNails: 12,
      OakWood: 1,
      LeatherStraps: 4
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 4,
    baseTime: 60 * MINUTES
  }
});

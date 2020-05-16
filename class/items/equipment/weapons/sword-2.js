const Item = require("../../.item");

class Sword839 extends IronEquipment {}
Item.itemFactory(Sword839, {
  checkWeapon: true,
  name: "Broadsword",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 13,
    [DAMAGE_TYPES.PIERCE]: 12
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 2.1,
      [DAMAGE_TYPES.PIERCE]: 1.3
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.75,
    [BUFFS.DODGE_MULTIPLIER]: 105
  },
  hitChance: WeaponSystem.BASE_HIT.SWORD,
  weaponSkill: SKILLS.FIGHTING_SWORD,
  icon: `/${ICONS_PATH}/items/equipment/weapons/155_b.png`,
  weight: 5,
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
      IronRod: 3,
      IronIngot: 2,
      WoodenShaft: 1,
      LeatherStraps: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 80 * MINUTES
  }
});

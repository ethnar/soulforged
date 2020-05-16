const Item = require("../../.item");

class Sword840 extends IronEquipment {}
Item.itemFactory(Sword840, {
  checkWeapon: true,
  name: "Runed Sword",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 8,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 3.5,
      [DAMAGE_TYPES.PIERCE]: 2.2
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.75,
    [BUFFS.DODGE_MULTIPLIER]: 110
  },
  hitChance: WeaponSystem.BASE_HIT.SWORD,
  weaponSkill: SKILLS.FIGHTING_SWORD,
  icon: `/${ICONS_PATH}/items/equipment/weapons/sword_b_04.png`,
  weight: 5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.CUTTING]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      TabletWriting14200: 0
    }
  },
  crafting: {
    materials: {
      CopperRod: 1,
      IronRod: 2,
      GoldMetalRing: 1,
      IronIngot: 1,
      HardwoodShaft: 1,
      LeatherStraps: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 6,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 120 * MINUTES
  }
});

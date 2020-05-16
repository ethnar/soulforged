const Item = require("../../.item");

class Spear91 extends IronEquipment {}
Item.itemFactory(Spear91, {
  checkWeapon: true,
  name: "Battle Spear",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 6,
    [DAMAGE_TYPES.PIERCE]: 18
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.PIERCE]: 1.2
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5,
    [BUFFS.DODGE_MULTIPLIER]: 105
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/weapons/02_b_croc.png`,
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
      IronIngot: 3,
      IronMetalRing: 2,
      CrocodileSkin: 1,
      WoodenShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

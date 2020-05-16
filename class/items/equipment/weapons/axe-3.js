const Item = require("../../.item");

class Axe735 extends SteelEquipment {}
Item.itemFactory(Axe735, {
  checkWeapon: true,
  name: "Broad Axe",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 8,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 3.5,
      [DAMAGE_TYPES.PIERCE]: 1.6
    }
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/88_b.png`,
  weight: 4,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.WOODCUTTING]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelRod: 1,
      SteelIngot: 1,
      Amber: 1,
      BronzeRod: 1,
      IronIngot: 1,
      WoodenShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 7,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 160 * MINUTES
  }
});

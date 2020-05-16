const Item = require("../../.item");

class Hammer214 extends IronEquipment {}
Item.itemFactory(Hammer214, {
  checkWeapon: true,
  name: "Rough Warhammer",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 18,
    [DAMAGE_TYPES.PIERCE]: 12
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.BLUNT]: 1.9,
      [DAMAGE_TYPES.PIERCE]: 1.2
    }
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/weapons/bl_b_05.png`,
  weight: 4,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HAMMER]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronIngot: 3,
      IronMetalRing: 2,
      SnakeSkin: 1,
      HardwoodShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 120 * MINUTES
  }
});

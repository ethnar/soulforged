const Item = require("../../.item");

class Axe249 extends SteelEquipment {}
Item.itemFactory(Axe249, {
  checkWeapon: true,
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 10,
    [DAMAGE_TYPES.PIERCE]: 13
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 3.8,
      [DAMAGE_TYPES.PIERCE]: 1.2
    }
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/9246_bl.png`,
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
      SteelRod: 3,
      BronzeMetalRing: 2,
      BisonHide: 1,
      CutEmerald: 1,
      HardwoodShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 7,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 200 * MINUTES
  }
});

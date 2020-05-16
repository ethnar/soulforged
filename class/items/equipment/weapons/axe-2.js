const Item = require("../../.item");

class Axe332 extends IronEquipment {}
Item.itemFactory(Axe332, {
  checkWeapon: true,
  name: "Etched Axe",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 18,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 2,
      [DAMAGE_TYPES.PIERCE]: 1
    }
  },
  hitChance: WeaponSystem.BASE_HIT.AXE,
  weaponSkill: SKILLS.FIGHTING_AXE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/axe_nn02_b.png`,
  weight: 3.5,
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
      CopperPlate: 1,
      IronPlate: 2,
      IronIngot: 1,
      WoodenShaft: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 120 * MINUTES
  }
});

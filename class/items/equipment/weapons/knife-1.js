const Item = require("../../.item");

class Knife467 extends IronEquipment {}
Item.itemFactory(Knife467, {
  checkWeapon: true,
  name: "Sweeping Knife",
  nameable: true,
  order: ITEMS_ORDER.WEAPONS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 21,
    [DAMAGE_TYPES.PIERCE]: 6
  },
  skillCoefficients: {
    damage: {
      [DAMAGE_TYPES.SLICE]: 1
    }
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.8,
    [BUFFS.DODGE_MULTIPLIER]: 115
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/weapons/swnb_02.png`,
  weight: 1,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      TabletWriting14200: 0
    }
  },
  crafting: {
    materials: {
      IronIngot: 1,
      LeadIngot: 1,
      LeatherStraps: 2
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

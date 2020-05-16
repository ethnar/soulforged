const Item = require("../../.item");

const COPPER_RATIO = 2;

class CopperKnife extends CopperEquipment {}
Item.itemFactory(CopperKnife, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Knife`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 16,
    [DAMAGE_TYPES.PIERCE]: 4
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/copper/kn_b_11.png`,
  weight: 1.5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1.2,
    [TOOL_UTILS.SAWING]: 0.28
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      KnifeMold: 1,
      MeltedCopper: COPPER_RATIO,
      BarkRope: 1
    },
    result: {
      CopperKnife: 1,
      KnifeMold: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 0,
    baseTime: 15 * MINUTES
  }
});
module.exports = global.CopperKnife = CopperKnife;

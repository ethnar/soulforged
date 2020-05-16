const Item = require("../../.item");

const BRONZE_RATIO = 2;

class BronzeKnife extends BronzeEquipment {}
Item.itemFactory(BronzeKnife, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Knife`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 17,
    [DAMAGE_TYPES.PIERCE]: 5
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/bronze/kn_b_11_bronze.png`,
  weight: 1.5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1,
    [TOOL_UTILS.CUTTING]: 1.4,
    [TOOL_UTILS.SAWING]: 0.35
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      KnifeMold: 1,
      MeltedBronze: BRONZE_RATIO,
      BarkRope: 1
    },
    result: {
      BronzeKnife: 1,
      KnifeMold: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    baseTime: 15 * MINUTES
  }
});
module.exports = global.BronzeKnife = BronzeKnife;

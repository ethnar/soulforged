const Item = require("../../.item");

const TIN_RATIO = 2;

class TinKnife extends TinEquipment {}
Item.itemFactory(TinKnife, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Knife`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 15,
    [DAMAGE_TYPES.PIERCE]: 4
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.5
  },
  hitChance: WeaponSystem.BASE_HIT.KNIFE,
  weaponSkill: SKILLS.FIGHTING_KNIFE,
  icon: `/${ICONS_PATH}/items/equipment/tin/kn_b_11_tin.png`,
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
      MeltedTin: TIN_RATIO,
      BarkRope: 1
    },
    result: {
      TinKnife: 1,
      KnifeMold: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});
module.exports = global.TinKnife = TinKnife;

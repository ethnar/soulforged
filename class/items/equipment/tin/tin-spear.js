const Item = require("../../.item");

const TIN_RATIO = 2;

class TinSpearHead extends Item {}
Item.itemFactory(TinSpearHead, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Spear Head`,
  order: ITEMS_ORDER.OTHER,
  weight: TIN_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/tin/nw_b_04_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SpearHeadMold: 1,
      MeltedTin: TIN_RATIO
    },
    result: {
      TinSpearHead: 1,
      SpearHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});

class TinSpear extends TinEquipment {}
Item.itemFactory(TinSpear, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Spear`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 7,
    [DAMAGE_TYPES.PIERCE]: 13
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.3
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/tin/nw_b_04.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 1.2,
    [TOOL_UTILS.FISHING]: 0.5
  },
  crafting: {
    autoLearn: true,
    materials: {
      TinSpearHead: 1,
      BarkRope: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.TinSpear = TinSpear;

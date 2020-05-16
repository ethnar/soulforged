const Item = require("../../.item");

const BRONZE_RATIO = 2;

class BronzeSpearHead extends Item {}
Item.itemFactory(BronzeSpearHead, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Spear Head`,
  order: ITEMS_ORDER.OTHER,
  weight: BRONZE_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/bronze/nw_b_04_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SpearHeadMold: 1,
      MeltedBronze: BRONZE_RATIO
    },
    result: {
      BronzeSpearHead: 1,
      SpearHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    baseTime: 15 * MINUTES
  }
});

class BronzeSpear extends BronzeEquipment {}
Item.itemFactory(BronzeSpear, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Spear`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 8,
    [DAMAGE_TYPES.PIERCE]: 15
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.3
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/bronze/nw_b_04.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 1.4,
    [TOOL_UTILS.FISHING]: 0.8
  },
  crafting: {
    autoLearn: true,
    materials: {
      BronzeSpearHead: 1,
      BarkRope: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.BronzeSpear = BronzeSpear;

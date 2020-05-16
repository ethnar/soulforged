const Item = require("../../.item");

class IronSpearHead extends Item {}
Item.itemFactory(IronSpearHead, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Spear Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 1,
  icon: `/${ICONS_PATH}/items/equipment/iron/nw_b_04_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronRod: 1
    },
    result: {
      IronSpearHead: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class IronSpear extends IronEquipment {}
Item.itemFactory(IronSpear, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Spear`,
  order: ITEMS_ORDER.TOOLS,
  damage: {
    [DAMAGE_TYPES.SLICE]: 8,
    [DAMAGE_TYPES.PIERCE]: 18
  },
  buffs: {
    [BUFFS.SKILLS.FIGHTING_DODGE]: 0.3
  },
  hitChance: WeaponSystem.BASE_HIT.POLEARM,
  weight: 1.5,
  weaponSkill: SKILLS.FIGHTING_POLEARM,
  icon: `/${ICONS_PATH}/items/equipment/iron/nw_b_04.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  utility: {
    [TOOL_UTILS.HUNTING]: 1.6,
    [TOOL_UTILS.FISHING]: 0.9
  },
  crafting: {
    autoLearn: true,
    materials: {
      IronSpearHead: 1,
      BarkRope: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.IronSpear = IronSpear;

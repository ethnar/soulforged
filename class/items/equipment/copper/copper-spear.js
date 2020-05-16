const Item = require("../../.item");

const COPPER_RATIO = 2;

class CopperSpearHead extends Item {}
Item.itemFactory(CopperSpearHead, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Spear Head`,
  order: ITEMS_ORDER.OTHER,
  weight: COPPER_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/copper/nw_b_04_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SpearHeadMold: 1,
      MeltedCopper: COPPER_RATIO
    },
    result: {
      CopperSpearHead: 1,
      SpearHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 0,
    baseTime: 15 * MINUTES
  }
});

class CopperSpear extends CopperEquipment {}
Item.itemFactory(CopperSpear, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Spear`,
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
  icon: `/${ICONS_PATH}/items/equipment/copper/nw_b_04.png`,
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
      CopperSpearHead: 1,
      BarkRope: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    baseTime: 15 * SECONDS
  }
});
module.exports = global.CopperSpear = CopperSpear;

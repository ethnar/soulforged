const TinEquipment = require("./.tin-equipment");

const TIN_RATIO = 3;

class TinHammerHead extends Item {}
Item.itemFactory(TinHammerHead, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Hammer Head`,
  order: ITEMS_ORDER.OTHER,
  weight: TIN_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/tin/ni_b_03_tin_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HammerHeadMold: 1,
      MeltedTin: TIN_RATIO
    },
    result: {
      TinHammerHead: 1,
      HammerHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});

class TinHammer extends TinEquipment {}
Item.itemFactory(TinHammer, {
  dynamicName: () => `${Nameable.getName("MeltedTin")} Hammer`,
  order: ITEMS_ORDER.TOOLS,
  weight: TIN_RATIO + 0.4,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 18,
    [DAMAGE_TYPES.SLICE]: 2,
    [DAMAGE_TYPES.PIERCE]: 3
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/tin/ni_b_03_tin.png`,
  utility: {
    [TOOL_UTILS.HAMMER]: 1.2
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      TinHammerHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.TinHammer = TinHammer;
module.exports = global.TinHammerHead = TinHammerHead;

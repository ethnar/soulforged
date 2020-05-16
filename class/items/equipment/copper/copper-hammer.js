const CopperEquipment = require("./.copper-equipment");

const COPPER_RATIO = 3;

class CopperHammerHead extends Item {}
Item.itemFactory(CopperHammerHead, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Hammer Head`,
  order: ITEMS_ORDER.OTHER,
  weight: COPPER_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/copper/ni_b_03_copper_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HammerHeadMold: 1,
      MeltedCopper: COPPER_RATIO
    },
    result: {
      CopperHammerHead: 1,
      HammerHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 0,
    baseTime: 15 * MINUTES
  }
});

class CopperHammer extends CopperEquipment {}
Item.itemFactory(CopperHammer, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Hammer`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 18,
    [DAMAGE_TYPES.SLICE]: 2
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/copper/ni_b_03_copper.png`,
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
      CopperHammerHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.CopperHammer = CopperHammer;
module.exports = global.CopperHammerHead = CopperHammerHead;

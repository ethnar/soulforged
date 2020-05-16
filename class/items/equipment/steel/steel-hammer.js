const SteelEquipment = require("./.steel-equipment");

class SteelHammerHead extends Item {}
Item.itemFactory(SteelHammerHead, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Hammer Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 3,
  icon: `/${ICONS_PATH}/items/equipment/steel/ni_b_03_steel_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelIngot: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class SteelHammer extends SteelEquipment {}
Item.itemFactory(SteelHammer, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Hammer`,
  order: ITEMS_ORDER.TOOLS,
  weight: 3.5,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 25
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/steel/ni_b_03_steel.png`,
  utility: {
    [TOOL_UTILS.HAMMER]: 1.8
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      SteelHammerHead: 1,
      HardwoodShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.SteelHammer = SteelHammer;
module.exports = global.SteelHammerHead = SteelHammerHead;

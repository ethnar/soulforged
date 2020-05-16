const IronEquipment = require("./.iron-equipment");

class IronHammerHead extends Item {}
Item.itemFactory(IronHammerHead, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Hammer Head`,
  order: ITEMS_ORDER.OTHER,
  weight: 2,
  icon: `/${ICONS_PATH}/items/equipment/iron/ni_b_03_iron_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronIngot: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

class IronHammer extends IronEquipment {}
Item.itemFactory(IronHammer, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Hammer`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 23
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/iron/ni_b_03_iron.png`,
  utility: {
    [TOOL_UTILS.HAMMER]: 1.6
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      IronHammerHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.IronHammer = IronHammer;
module.exports = global.IronHammerHead = IronHammerHead;

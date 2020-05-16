const BronzeEquipment = require("./.bronze-equipment");

const BRONZE_RATIO = 3;

class BronzeHammerHead extends Item {}
Item.itemFactory(BronzeHammerHead, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Hammer Head`,
  order: ITEMS_ORDER.OTHER,
  weight: BRONZE_RATIO,
  icon: `/${ICONS_PATH}/items/equipment/bronze/ni_b_03_bronze_head.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HammerHeadMold: 1,
      MeltedBronze: BRONZE_RATIO
    },
    result: {
      BronzeHammerHead: 1,
      HammerHeadMold: 1
    },
    building: ["Kiln"],
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    baseTime: 15 * MINUTES
  }
});

class BronzeHammer extends BronzeEquipment {}
Item.itemFactory(BronzeHammer, {
  dynamicName: () => `${Nameable.getName("MeltedBronze")} Hammer`,
  order: ITEMS_ORDER.TOOLS,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 1,
  damage: {
    [DAMAGE_TYPES.BLUNT]: 20
  },
  hitChance: WeaponSystem.BASE_HIT.HAMMER,
  weaponSkill: SKILLS.FIGHTING_HAMMER,
  icon: `/${ICONS_PATH}/items/equipment/bronze/ni_b_03_bronze.png`,
  utility: {
    [TOOL_UTILS.HAMMER]: 1.4
  },
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1,
    [EQUIPMENT_SLOTS.WEAPON]: 2
  },
  crafting: {
    autoLearn: true,
    materials: {
      BronzeHammerHead: 1,
      WoodenShaft: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15 * SECONDS
  }
});

module.exports = global.BronzeHammer = BronzeHammer;
module.exports = global.BronzeHammerHead = BronzeHammerHead;

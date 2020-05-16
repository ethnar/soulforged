const ExpirableItem = require("../.expirable-item");
const Item = require("../.item");
require("./bronze.js");
require("./copper.js");
require("./gold.js");
require("./iron.js");
require("./lead.js");
require("./melted-metal.js");
require("./silver.js");
require("./steel.js");
require("./tin.js");

[
  {
    name: "Copper",
    dynamicName: () => `${Nameable.getName("MeltedCopper")}`,
    building: "Kiln",
    ingotRatio: 2,
    baseSkill: 2,
    baseWorkTime: 5
  },
  {
    name: "Tin",
    dynamicName: () => `${Nameable.getName("MeltedTin")}`,
    building: "Kiln",
    ingotRatio: 2,
    baseSkill: 2,
    baseWorkTime: 5
  },
  {
    name: "Bronze",
    dynamicName: () => `${Nameable.getName("MeltedBronze")}`,
    building: "Kiln",
    ingotRatio: 2,
    baseSkill: 3,
    baseWorkTime: 6
  },
  {
    name: "Lead",
    dynamicName: () => `${Nameable.getName("MeltedLead")}`,
    building: "Furnace",
    ingotRatio: 4,
    baseSkill: 4,
    baseWorkTime: 6
  },
  {
    name: "Iron",
    dynamicName: () => `${Nameable.getName("MeltedIron")}`,
    building: "Furnace",
    ingotRatio: 2,
    baseSkill: 5,
    baseWorkTime: 8
  },
  {
    name: "Silver",
    dynamicName: () => `${Nameable.getName("MeltedSilver")}`,
    building: "Furnace",
    ingotRatio: 2,
    baseSkill: 4,
    baseWorkTime: 8
  },
  {
    name: "Gold",
    dynamicName: () => `${Nameable.getName("MeltedGold")}`,
    building: "Furnace",
    ingotRatio: 3,
    baseSkill: 6,
    baseWorkTime: 6
  },
  {
    name: "Steel",
    dynamicName: () => `${Nameable.getName("MeltedSteel")}`,
    building: "Furnace",
    ingotRatio: 3,
    baseSkill: 6,
    baseWorkTime: 12
  }
].forEach(metal => {
  const name = metal.name;
  const dynamicName = metal.dynamicName;
  const nameLowercase = name.toLowerCase();

  utils.newClassExtending(`${name}InCrucible`, Item);
  Item.itemFactory(global[`${name}InCrucible`], {
    dynamicName: () => `${dynamicName()} In Crucible`,
    icon: `/${ICONS_PATH}/items/metal/146_b_crucible_${nameLowercase}_cold.png`,
    order: ITEMS_ORDER.OTHER,
    weight: 2.2
  });

  new Recipe({
    id: `Salvage${name}InCrucible`,
    dynamicName: () => `Salvage ${dynamicName()} from Crucible`,
    icon: `/${ICONS_PATH}/items/metal/146_b_crucible_${nameLowercase}.png`,
    result: {
      [`Melted${name}`]: 1
    },
    autoLearn: true,
    materials: {
      [`${name}InCrucible`]: 1,
      Crucible: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: global[`Melted${name}`].prototype.crafting.skillLevel + 0.4,
    toolUtility: TOOL_UTILS.HAMMER,
    building: [metal.building],
    baseTime: 8 * MINUTES
  });

  const ingotIcon = `/${ICONS_PATH}/items/metal/in_b_06_${nameLowercase}.png`;
  utils.newClassExtending(`${name}Ingot`, Item);
  Item.itemFactory(global[`${name}Ingot`], {
    dynamicName: () => `${dynamicName()} Ingot`,
    icon: ingotIcon,
    order: ITEMS_ORDER.OTHER,
    weight: metal.ingotRatio,
    research: {
      sameAsCrafting: true
    },
    crafting: {
      materials: {
        IngotMold: 1,
        [`Melted${name}`]: metal.ingotRatio
      },
      result: {
        [`${name}Ingot`]: 1,
        IngotMold: 1
      },
      skill: SKILLS.SMELTING,
      skillLevel: global[`Melted${name}`].prototype.crafting.skillLevel - 0.2,
      baseTime: 2 * MINUTES,
      skillGainMultiplier: 0
    }
  });

  new Recipe({
    id: `Smelt${name}Ingot`,
    dynamicName: () => `Smelt ${dynamicName()} Ingot`,
    icon: `/${ICONS_PATH}/items/metal/146_b_crucible_${nameLowercase}.png`,
    autoLearn: true,
    materials: {
      [`${name}Ingot`]: 1,
      Crucible: metal.ingotRatio
    },
    result: {
      [`Melted${name}`]: metal.ingotRatio
    },
    building: [metal.building],
    baseTime: 15 * MINUTES,
    // skill: SKILLS.SMELTING,
    // skillLevel: metal.baseSkill - 2,
    skillGainMultiplier: 0
  });

  const coinIcon = `/${ICONS_PATH}/items/metal/coins_${nameLowercase}.png`;
  new Recipe({
    id: `Smelt${name}Coins`,
    dynamicName: () => `Smelt ${dynamicName()} Coins`,
    icon: `/${ICONS_PATH}/items/metal/146_b_crucible_${nameLowercase}.png`,
    autoLearn: true,
    materials: {
      [`${name}Coins`]: 100,
      Crucible: 1
    },
    result: {
      [`Melted${name}`]: 1
    },
    building: [metal.building],
    baseTime: 2 * MINUTES,
    skill: SKILLS.SMELTING,
    skillLevel: metal.baseSkill - 1,
    skillGainMultiplier: 0
  });

  utils.newClassExtending(`${name}Coins`, Item);
  Item.itemFactory(global[`${name}Coins`], {
    dynamicName: () => `${dynamicName()} Coins`,
    icon: coinIcon,
    weight: 0.01,
    order: ITEMS_ORDER.COINS,
    research: {
      sameAsCrafting: true,
      materials: {
        ResearchConcept_Trading: 0
      }
    },
    crafting: {
      materials: {
        [`Melted${name}`]: 1
      },
      result: {
        [`${name}Coins`]: 100
      },
      building: ["Mint"],
      baseTime: 10 * MINUTES,
      skillGainMultiplier: 0
    }
  });

  const plateQty = 1;
  utils.newClassExtending(`${name}Plate`, Item);
  Item.itemFactory(global[`${name}Plate`], {
    dynamicName: () => `${dynamicName()} Plate`,
    icon: `/${ICONS_PATH}/items/metal/metal_plate_${nameLowercase}.png`,
    weight: metal.ingotRatio / plateQty,
    order: ITEMS_ORDER.OTHER,
    research: {
      sameAsCrafting: true
    },
    crafting: {
      materials: {
        [`${name}Ingot`]: 1
      },
      result: {
        [`${name}Plate`]: plateQty
      },
      building: ["Forge"],
      skill: SKILLS.SMITHING,
      skillLevel: metal.baseSkill - 1,
      toolUtility: TOOL_UTILS.HAMMER,
      baseTime: metal.baseWorkTime * 10 * MINUTES
    }
  });

  const rodQty = 2;
  utils.newClassExtending(`${name}Rod`, Item);
  Item.itemFactory(global[`${name}Rod`], {
    dynamicName: () => `${dynamicName()} Rod`,
    icon: `/${ICONS_PATH}/items/metal/metal_rod_${nameLowercase}.png`,
    weight: metal.ingotRatio / rodQty,
    order: ITEMS_ORDER.OTHER,
    research: {
      sameAsCrafting: true
    },
    crafting: {
      materials: {
        [`${name}Ingot`]: 1
      },
      result: {
        [`${name}Rod`]: rodQty
      },
      building: ["Forge"],
      skill: SKILLS.SMITHING,
      skillLevel: metal.baseSkill,
      toolUtility: TOOL_UTILS.HAMMER,
      baseTime: metal.baseWorkTime * 8 * MINUTES
    }
  });

  const wireQty = 5;
  utils.newClassExtending(`${name}Wire`, Item);
  Item.itemFactory(global[`${name}Wire`], {
    dynamicName: () => `${dynamicName()} Wire`,
    icon: `/${ICONS_PATH}/items/metal/metal_wire_${nameLowercase}.png`,
    weight: global[`${name}Rod`].prototype.weight / wireQty,
    order: ITEMS_ORDER.OTHER,
    research: {
      sameAsCrafting: true
    },
    crafting: {
      materials: {
        [`${name}Rod`]: 1
      },
      result: {
        [`${name}Wire`]: wireQty
      },
      building: [
        "Forge" // TODO: different?
      ],
      skill: SKILLS.SMITHING,
      skillLevel: metal.baseSkill + 1.5,
      toolUtility: TOOL_UTILS.HAMMER, // TODO: tongs?
      baseTime: metal.baseWorkTime * 12 * MINUTES
    }
  });

  const ringQty = 4;
  utils.newClassExtending(`${name}MetalRing`, Item);
  Item.itemFactory(global[`${name}MetalRing`], {
    dynamicName: () => `${dynamicName()} Metal Ring`,
    icon: `/${ICONS_PATH}/items/metal/metal_ring_${nameLowercase}.png`,
    weight: global[`${name}Wire`].prototype.weight / ringQty,
    order: ITEMS_ORDER.OTHER,
    research: {
      sameAsCrafting: true
    },
    crafting: {
      materials: {
        [`${name}Wire`]: 1
      },
      result: {
        [`${name}MetalRing`]: ringQty
      },
      building: [
        "Forge" // TODO: different?
      ],
      skill: SKILLS.SMITHING,
      skillLevel: metal.baseSkill + 1,
      toolUtility: TOOL_UTILS.HAMMER, // TODO: tongs?
      baseTime: metal.baseWorkTime * 4 * MINUTES
    }
  });

  const buckleWiresNeeded = 2;
  const buckleLeatherStrapsNeeded = 2;
  utils.newClassExtending(`${name}Buckle`, Item);
  Item.itemFactory(global[`${name}Buckle`], {
    dynamicName: () => `${dynamicName()} Buckle Strap`,
    icon: `/${ICONS_PATH}/items/metal/pt_b_02_${nameLowercase}${
      nameLowercase === "silver" ? "_up" : ""
    }.png`,
    weight:
      buckleWiresNeeded * global[`${name}Wire`].prototype.weight +
      global[`${name}MetalRing`].prototype.weight +
      LeatherStraps.prototype.weight * buckleLeatherStrapsNeeded,
    order: ITEMS_ORDER.OTHER,
    research: {
      sameAsCrafting: true
    },
    crafting: {
      materials: {
        [`${name}Wire`]: buckleWiresNeeded,
        [`${name}MetalRing`]: 1,
        LeatherStraps: buckleLeatherStrapsNeeded
      },
      skill: SKILLS.CRAFTING,
      skillLevel: metal.baseSkill * 0.4 + 2,
      toolUtility: TOOL_UTILS.HAMMER, // TODO: tongs?
      baseTime: metal.baseWorkTime * 15 * MINUTES
    }
  });
});

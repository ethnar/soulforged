const MeltedMetal = require("./melted-metal");

class MeltedGold extends MeltedMetal {}
Item.itemFactory(MeltedGold, {
  nameable: true,
  name: "Gold",
  dynamicName: () => `Melted ${Nameable.getName("MeltedGold")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_gold.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    GoldInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    dynamicName: () => `Melt ${Nameable.getName("MeltedGold")}`,
    materials: {
      GoldOre: 1,
      Crucible: 1,
      Coal: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 4,
    building: ["Furnace"],
    baseTime: 8 * MINUTES
  }
});

const MeltedMetal = require("./melted-metal");

class MeltedSilver extends MeltedMetal {}
Item.itemFactory(MeltedSilver, {
  nameable: true,
  name: "Silver",
  dynamicName: () => `Melted ${Nameable.getName("MeltedSilver")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_silver.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    SilverInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    dynamicName: () => `Melt ${Nameable.getName("MeltedSilver")}`,
    materials: {
      Galena: 4,
      Crucible: 1,
      Coal: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    building: ["Furnace"],
    baseTime: 8 * MINUTES
  }
});

new Recipe({
  id: "MeltedSilver_Tetrahedrite",
  name: "Melt Silver (tetrahedrite)",
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_silver.png`,
  result: {
    MeltedSilver: 1
  },
  research: {
    sameAsCrafting: true
  },
  materials: {
    Tetrahedrite: 4,
    Crucible: 1,
    Coal: 1
  },
  skill: SKILLS.SMELTING,
  skillLevel: 3,
  building: ["Furnace"],
  baseTime: 8 * MINUTES
});

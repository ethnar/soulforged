const MeltedMetal = require("./melted-metal");

class MeltedIron extends MeltedMetal {}
Item.itemFactory(MeltedIron, {
  nameable: true,
  name: "Iron",
  dynamicName: () => `Melted ${Nameable.getName("MeltedIron")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_iron.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    IronInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    dynamicName: () => `Melt ${Nameable.getName("MeltedIron")}`,
    materials: {
      Magnetite: 2,
      Crucible: 1,
      Coal: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 3,
    building: ["Furnace"],
    baseTime: 8 * MINUTES
  }
});

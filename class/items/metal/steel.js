const MeltedMetal = require("./melted-metal");

class MeltedSteel extends MeltedMetal {}
Item.itemFactory(MeltedSteel, {
  nameable: true,
  name: "Steel",
  dynamicName: () => `Melted ${Nameable.getName("MeltedSteel")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_steel.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    SteelInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    dynamicName: () => `Melt ${Nameable.getName("MeltedSteel")}`,
    materials: {
      Magnetite: 2,
      Crucible: 1,
      Lime: 3,
      Coal: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 3,
    building: ["Furnace"],
    baseTime: 8 * MINUTES
  }
});

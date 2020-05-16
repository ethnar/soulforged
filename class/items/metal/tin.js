const MeltedMetal = require("./melted-metal");

class MeltedTin extends MeltedMetal {}
Item.itemFactory(MeltedTin, {
  nameable: true,
  name: "Tin",
  dynamicName: () => `Melted ${Nameable.getName("MeltedTin")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_tin.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    TinInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    dynamicName: () => `Melt ${Nameable.getName("MeltedTin")}`,
    materials: {
      Cassiterite: 2,
      Crucible: 1,
      Firewood: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    building: ["Kiln"],
    baseTime: 8 * MINUTES
  }
});

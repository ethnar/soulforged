const MeltedMetal = require("./melted-metal");

class MeltedCopper extends MeltedMetal {}
Item.itemFactory(MeltedCopper, {
  nameable: true,
  name: "Copper",
  dynamicName: () => `Melted ${Nameable.getName("MeltedCopper")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_copper.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    CopperInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    name: "Melt Copper (nuggets)",
    materials: {
      Copper: 1,
      Crucible: 1,
      Firewood: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 1,
    building: ["Kiln"],
    baseTime: 6 * MINUTES
  }
});

new Recipe({
  id: "MeltedCopper_Malachite",
  name: "Melt Copper (malachite)",
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_copper.png`,
  result: {
    MeltedCopper: 1
  },
  research: {
    sameAsCrafting: true
  },
  materials: {
    Malachite: 2,
    Crucible: 1,
    Firewood: 1
  },
  skill: SKILLS.SMELTING,
  skillLevel: 2,
  building: ["Kiln"],
  baseTime: 8 * MINUTES
});

new Recipe({
  id: "MeltedCopper_Tetrahedrite",
  name: "Melt Copper (tetrahedrite)",
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_copper.png`,
  result: {
    MeltedCopper: 1
  },
  research: {
    sameAsCrafting: true
  },
  materials: {
    Tetrahedrite: 2,
    Crucible: 1,
    Firewood: 1
  },
  skill: SKILLS.SMELTING,
  skillLevel: 2,
  building: ["Kiln"],
  baseTime: 8 * MINUTES
});

const MeltedMetal = require("./melted-metal");

class MeltedLead extends MeltedMetal {}
Item.itemFactory(MeltedLead, {
  nameable: true,
  name: "Lead",
  dynamicName: () => `Melted ${Nameable.getName("MeltedLead")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_lead.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    LeadInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    dynamicName: () => `Melt ${Nameable.getName("MeltedLead")}`,
    materials: {
      Galena: 2,
      Crucible: 1,
      Firewood: 1
    },
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    building: ["Furnace"],
    baseTime: 8 * MINUTES
  }
});

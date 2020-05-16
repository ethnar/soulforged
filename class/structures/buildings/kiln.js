const Building = require("./.building");
const ResearchConcept = require("../../research-concept");
const Item = require("../../items/.item");

class Kiln extends Building {}
Building.buildingFactory(Kiln, {
  name: "Kiln",
  deteriorationRate: 4 * MONTHS,
  baseTime: 5 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/sgi_addons_175.png`,
  toolUtility: TOOL_UTILS.FIRESTARTER,
  research: {
    materials: {
      WoodenBeam: 0,
      Clay: 0
    }
  },
  materials: {
    WoodenBeam: 30,
    Clay: 200
  }
});

new ResearchConcept({
  name: "Smelting Container",
  className: "ResearchConcept_SmeltingContainer",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    ResearchConcept.knownItem("Clay"),
    ResearchConcept.knownItem("Copper"),
    ResearchConcept.knownBuildingPlan("Kiln")
  ]
});

class Crucible extends Item {}
Item.itemFactory(Crucible, {
  name: "Crucible",
  icon: `/${ICONS_PATH}/structures/buildings/146_b_crucible.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 1.2,
  research: {
    materials: {
      ResearchConcept_SmeltingContainer: 0,
      Clay: 0,
      Sand: 0
    }
  },
  crafting: {
    materials: {
      Clay: 1,
      Sand: 1
    },
    building: ["Kiln"],
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});

new ResearchConcept({
  name: "Metal Casting",
  className: "ResearchConcept_MetalCasting",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    ResearchConcept.knownItem("MeltedCopper"),
    ResearchConcept.knownItem("Clay"),
    ResearchConcept.knownItem("Sand")
  ]
});

module.exports = global.Crucible = Crucible;
module.exports = global.Kiln = Kiln;

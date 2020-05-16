class PrimitiveGemCuttingTools extends Item {}
Item.itemFactory(PrimitiveGemCuttingTools, {
  name: "Primitive Gem Cutting Tools",
  order: ITEMS_ORDER.TOOLS,
  icon: `/${ICONS_PATH}/items/gems/primitive-tools.png`,
  weight: 1.5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.GEMCUTTING]: 0.8
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_GemCutting: 0
    }
  },
  crafting: {
    materials: {
      GraniteBlock: 1,
      Bone: 1,
      BarkRope: 1,
      Clay: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.CARVING,
    baseTime: 40 * MINUTES
  }
});

new ResearchConcept({
  name: "Gem cutting",
  className: "ResearchConcept_GemCutting",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    ResearchConcept.hasSkillLevel(SKILLS.JEWELCRAFTING, 3),
    utils.xOf(
      6,
      ResearchConcept.knownItem("Amber"),
      ResearchConcept.knownItem("Amethyst"),
      ResearchConcept.knownItem("Diamond"),
      ResearchConcept.knownItem("Emerald"),
      ResearchConcept.knownItem("Ruby"),
      ResearchConcept.knownItem("Topaz")
    )
  ]
});

class AStatue14200 extends AncientStatueDecoration {}
Item.itemFactory(AStatue14200, {
  name: "Ancient Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/miningicons_32_b_gold.png`,
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 8,
    [BUFFS.STATS.INTELLIGENCE]: 12
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14200: 0
    }
  },
  crafting: {
    materials: {
      ...AncientStatueDecoration.prototype.crafting.materials,
      CutTopaz: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 11,
    baseTime: 16 * HOURS
  }
});

class AStatue14327 extends AncientStatueDecoration {}
Item.itemFactory(AStatue14327, {
  name: "Ancient Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/149_b_red_eyes_gold.png`,
  buffs: {
    [BUFFS.STATS.STRENGTH]: 15,
    [BUFFS.STATS.ENDURANCE]: 5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14327: 0
    }
  },
  crafting: {
    materials: {
      ...AncientStatueDecoration.prototype.crafting.materials,
      CutRuby: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 11,
    baseTime: 16 * HOURS
  }
});

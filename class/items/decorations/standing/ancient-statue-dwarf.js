class AStatue14338 extends AncientStatueDecoration {}
Item.itemFactory(AStatue14338, {
  name: "Ancient Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/tradingicons_56_gold.png`,
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 12,
    [BUFFS.STATS.STRENGTH]: 4,
    [BUFFS.STATS.INTELLIGENCE]: 4
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14338: 0
    }
  },
  crafting: {
    materials: {
      ...AncientStatueDecoration.prototype.crafting.materials,
      CutDiamond: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 11,
    baseTime: 16 * HOURS
  }
});

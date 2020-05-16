class AStatue14332 extends AncientStatueDecoration {}
Item.itemFactory(AStatue14332, {
  name: "Ancient Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/necromancericons_77_b_green_eyes_gold.png`,
  buffs: {
    [BUFFS.STATS.DEXTERITY]: 8,
    [BUFFS.STATS.PERCEPTION]: 12
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14332: 0
    }
  },
  crafting: {
    materials: {
      ...AncientStatueDecoration.prototype.crafting.materials,
      CutEmerald: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 11,
    baseTime: 16 * HOURS
  }
});

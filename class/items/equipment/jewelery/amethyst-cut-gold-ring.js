class WorldQuestTreasureHuntReward extends Jewelery {}
Item.itemFactory(WorldQuestTreasureHuntReward, {
  name: "Vivacious Amethyst Ring",
  icon: `/${ICONS_PATH}/quests/world-quests/rn_b_02.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.STRENGTH]: 6,
    [BUFFS.STATS.INTELLIGENCE]: 4
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldMetalRing: 1,
      SilverWire: 1,
      CutAmethyst: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 4,
    baseTime: 2 * HOURS
  }
});

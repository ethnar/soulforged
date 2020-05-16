require("../../../quests/.quest");

module.exports = (
  TROPHY_SKILL,
  TROPHY_LEVEL,
  MATERIALS,
  ICON,
  SMALL = false,
  QUEST_DEFINITION
) => {
  const className = `Trophy${TROPHY_SKILL}${TROPHY_LEVEL}`;
  const name = `${SKILL_NAMES[SKILLS[TROPHY_SKILL]]} Trophy`;
  const RCClassName = `ResearchConcept_Trophy_${TROPHY_SKILL}${TROPHY_LEVEL}`;

  const Trophy = utils.newClassExtending(className, Decoration);
  Item.itemFactory(Trophy, {
    name,
    icon: ICON,
    weight: 5,
    order: ITEMS_ORDER.DECOR,
    expiresIn: 150 * DAYS,
    decorationSlots: [
      ...(SMALL ? [DECORATION_SLOTS.SMALL_STANDING_DECOR] : []),
      DECORATION_SLOTS.MEDIUM_STANDING_DECOR,
      DECORATION_SLOTS.LARGE_STANDING_DECOR
    ],
    buffs: {
      [BUFFS.SKILLS[TROPHY_SKILL]]: (2 + TROPHY_LEVEL) / 4
    },
    research: {
      sameAsCrafting: true,
      materials: {
        [RCClassName]: 0
      }
    },
    crafting: {
      materials: MATERIALS,
      skill: SKILLS.JEWELCRAFTING,
      skillLevel: 2 + TROPHY_LEVEL * 1.5,
      toolUtility: TOOL_UTILS.CARVING,
      baseTime: (1.5 + TROPHY_LEVEL * 0.5) * HOURS
    }
  });

  QUEST_DEFINITION.autoAcquireConditions = [
    ResearchConcept.hasSkillLevel(SKILLS[TROPHY_SKILL], 2 + TROPHY_LEVEL)
  ];
  QUEST_DEFINITION.onFinish = player => {
    player.gainSoulXp(500 + 250 * TROPHY_LEVEL);
  };

  const questId = `Quest_${className}`;
  const quest = new Quest((QUESTS[questId] = questId), QUEST_DEFINITION);

  new ResearchConcept({
    name,
    className: RCClassName,
    tier: ResearchConcept.TIERS.PARCHMENT,
    requirements: [creature => creature.getPlayer().isQuestFinished(quest.id)]
  });
};

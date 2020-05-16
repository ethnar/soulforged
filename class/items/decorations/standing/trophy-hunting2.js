const TrophyFactory = require("./.trophy");

TrophyFactory(
  "HUNTING",
  2,
  {
    GoldPlate: 3,
    GoldWire: 5,
    GoldRod: 1,
    GoldMetalRing: 4,
    CutRuby: 3
  },
  `/${ICONS_PATH}/items/decorations/standing/medium_trophyicons_12_b.png`,
  false,
  {
    title: "The Hunter",
    description: `Use your hunting skill to catch numerous prey.`,
    icon: Quest.LIFETIME_QUEST_ICON,
    questEventsHandler: {
      die: Quest.failQuest,
      gatherSuccess: (humanoid, { questData }, resource) => {
        if (resource instanceof Prey) {
          const typesRegister =
            Quest.getCustomProgress("huntDifferentRegister", questData) || {};
          typesRegister[resource.constructor.name] = true;
          Quest.setCustomProgress(
            "huntDifferentRegister",
            questData,
            typesRegister
          );
          Quest.setCustomProgress(
            "huntDifferent",
            questData,
            Object.keys(typesRegister).length
          );
          Quest.updateCustomProgress("huntAnimals", questData, 1);
        }
      },
      trapSuccess: (humanoid, { questData }, resource) => {
        Quest.updateCustomProgress("trapAnimals", questData, 1);
      }
    },
    objectives: [
      {
        label: `Hunt down 300 animals`,
        progress: Quest.customProgressCallback("huntAnimals"),
        target: 300
      },
      {
        label: "Trap 50 animals",
        progress: Quest.customProgressCallback("trapAnimals"),
        target: 50
      },
      {
        label: "Hunt down 6 different types of animals",
        progress: Quest.customProgressCallback("huntDifferent"),
        target: 6
      },
      Quest.objectiveDoNotDie
    ],
    dialogue: {
      init: {
        text: () =>
          `As my hunting skill increases, I am able to stalk and hunt down the more elusive prey. By using the skill I can achieve a new status and celebrate my achievements.`,
        options: []
      },
      initComplete: {
        text: () =>
          `I feel I gained a deeper understanding of the hunting skill.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    }
  }
);

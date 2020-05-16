const TrophyFactory = require("./.trophy");

TrophyFactory(
  "TRACKING",
  1,
  {
    SilverPlate: 3,
    SilverWire: 5,
    SilverRod: 1,
    SilverMetalRing: 4
  },
  `/${ICONS_PATH}/items/decorations/standing/medium_trophyicons_87_b.png`,
  false,
  {
    title: "The Tracker",
    description: `Use your tracking skill to identify various creatures across this world.`,
    icon: Quest.LIFETIME_QUEST_ICON,
    questEventsHandler: {
      die: Quest.failQuest,
      trackedSomeone: (humanoid, { questData }, entity, scouter) => {
        if (scouter === 3) {
          Quest.updateCustomProgress("fullyTracked", questData, 1);
        }
        const knownTracks = Object.values(SCOUTER_MESSAGES).filter(scouter =>
          humanoid.getPlayer().knowsIcon(scouter.icon)
        ).length;
        Quest.setCustomProgress("trackTypes", questData, knownTracks);
      }
    },
    objectives: [
      {
        label: `Use tracking to get 3 additional tracks on 50 creatures`,
        progress: Quest.customProgressCallback("fullyTracked"),
        target: 50
      },
      {
        label: "Identify 25 different types of tracks",
        progress: Quest.customProgressCallback("trackTypes"),
        target: 25
      },
      Quest.objectiveDoNotDie
    ],
    dialogue: {
      init: {
        text: () =>
          `As my tracking skill increases, I can more easily identify different creatures. By using the skill I can achieve a new status and celebrate my achievements.`,
        options: []
      },
      initComplete: {
        text: () =>
          `I feel I gained a deeper understanding of the tracking skill.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    }
  }
);

const TrophyFactory = require("./.trophy");

const material = "Lead";

TrophyFactory(
  "MINING",
  0,
  {
    [`${material}Plate`]: 2,
    [`${material}Wire`]: 3,
    [`${material}Rod`]: 1,
    [`${material}MetalRing`]: 2
  },
  `/${ICONS_PATH}/items/decorations/standing/small_trophyicons_88_b.png`,
  true,
  {
    title: "The Miner",
    description: `Use your mining skill to obtain various ores.`,
    icon: Quest.LIFETIME_QUEST_ICON,
    questEventsHandler: {
      die: Quest.failQuest,
      gatherSuccess: (humanoid, { questData }, resource) => {
        if (resource instanceof QuakingResources) {
          if (!(resource instanceof Pebbles)) {
            const type = resource.constructor.name.replace("Wall", "Deposit");

            const typesRegister =
              Quest.getCustomProgress("mineDifferentRegister", questData) || {};
            typesRegister[type] = true;
            Quest.setCustomProgress(
              "mineDifferentRegister",
              questData,
              typesRegister
            );
            Quest.setCustomProgress(
              "mineDifferent",
              questData,
              Object.keys(typesRegister).length
            );
          }
          if (resource instanceof RockDeposit || resource instanceof RockWall) {
            Quest.updateCustomProgress("mineBoulders", questData, 1);
          }
          if (
            !(resource instanceof RockWall) &&
            !(resource instanceof RockDeposit) &&
            !(resource instanceof GoldVein) &&
            !(resource instanceof Pebbles)
          ) {
            Quest.updateCustomProgress("mineOre", questData, 1);
          }
          if (resource instanceof GoldVein) {
            Quest.updateCustomProgress("mineGoldOre", questData, 1);
          }
        }
      }
    },
    objectives: [
      {
        label: "Mine 9 different materials",
        progress: Quest.customProgressCallback("mineDifferent"),
        target: 9
      },
      {
        label: `Mine 100 boulders`,
        progress: Quest.customProgressCallback("mineBoulders"),
        target: 100
      },
      {
        label: "Mine 200 metal ores",
        progress: Quest.customProgressCallback("mineOre"),
        target: 200
      },
      {
        label: "Mine 30 gold nuggets",
        progress: Quest.customProgressCallback("mineGoldOre"),
        target: 30
      },
      Quest.objectiveDoNotDie
    ],
    dialogue: {
      init: {
        text: () =>
          `As my mining skill increases, I can reliably mine more difficult ores and minerals. By using the skill I can achieve a new status and celebrate my achievements.`,
        options: []
      },
      initComplete: {
        text: () =>
          `I feel I gained a deeper understanding of the mining skill.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    }
  }
);

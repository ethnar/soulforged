const TrophyFactory = require("./.trophy");

const material = "Bronze";

function checkTamedAnimals(humanoid, questData) {
  const count = humanoid
    .getNode()
    .getCreatures()
    .filter(c => c.tamed && c.tamed.owner === humanoid).length;
  Quest.setCustomProgress("tamedAtTheSameTime", questData, count);
}
TrophyFactory(
  "TAMING",
  0,
  {
    [`${material}Plate`]: 2,
    [`${material}Wire`]: 3,
    [`${material}Rod`]: 1,
    [`${material}MetalRing`]: 2
  },
  `/${ICONS_PATH}/items/decorations/standing/small_trophyicons_93_b.png`,
  true,
  {
    title: "The Tamer",
    description: `Use your taming skill to befriend various beasts of this world.`,
    icon: Quest.LIFETIME_QUEST_ICON,
    questEventsHandler: {
      die: Quest.failQuest,
      moved: (humanoid, { questData }) => {
        checkTamedAnimals(humanoid, questData);
      },
      someoneArrived: (humanoid, { questData }) => {
        checkTamedAnimals(humanoid, questData);
      },
      animalTamed: (humanoid, { questData }, tamedAnimal) => {
        checkTamedAnimals(humanoid, questData);
        Quest.updateCustomProgress("totalTame", questData, 1);

        const typesRegister =
          Quest.getCustomProgress("differentAnimalsRegister", questData) || {};
        typesRegister[tamedAnimal.constructor.name] = true;
        Quest.setCustomProgress(
          "differentAnimalsRegister",
          questData,
          typesRegister
        );
        Quest.setCustomProgress(
          "differentAnimals",
          questData,
          Object.keys(typesRegister).length
        );
      }
    },
    objectives: [
      {
        label: `Tame 3 different animals`,
        progress: Quest.customProgressCallback("differentAnimals"),
        target: 3
      },
      {
        label: "Tame 30 animals",
        progress: Quest.customProgressCallback("totalTame"),
        target: 30
      },
      {
        label: "Have 6 tamed animals with you",
        progress: Quest.customProgressCallback("tamedAtTheSameTime"),
        target: 6
      },
      Quest.objectiveDoNotDie
    ],
    dialogue: {
      init: {
        text: () =>
          `As my taming skill increases, I can tame more dangerous creatures. By using the skill I can achieve a new status and celebrate my achievements.`,
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

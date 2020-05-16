const TrophyFactory = require("./.trophy");

TrophyFactory(
  "DOCTORING",
  2,
  {
    GoldPlate: 3,
    GoldWire: 5,
    GoldRod: 1,
    GoldMetalRing: 4,
    CutAmber: 5
  },
  `/${ICONS_PATH}/items/decorations/standing/medium_trophyicons_21_b.png`,
  false,
  {
    title: "The Physician",
    description: `Use your doctoring skill to tend to the wounds of those around you.`,
    icon: Quest.LIFETIME_QUEST_ICON,
    questEventsHandler: {
      die: Quest.failQuest,
      tendWounds: (
        humanoid,
        { questDetails, questData },
        itemUsed,
        stackCured,
        injuryCured
      ) => {
        if (
          itemUsed instanceof SimpleBandage &&
          stackCured === SimpleBandage.prototype.maxBatch
        ) {
          Quest.updateCustomProgress("useBandages", questData, 1);
        }
        if (injuryCured === "BuffCut") {
          Quest.updateCustomProgress("tendCuts", questData, stackCured);
        }
        if (injuryCured === "BuffBruise") {
          Quest.updateCustomProgress("tendBruises", questData, stackCured);
        }
      },
      craftFinished: (humanoid, { questData }, recipe) => {
        if (recipe.id.includes(`Butcher_`)) {
          Quest.updateCustomProgress("creaturesButchered", questData, 1);
        }
      },
      craftSuccess: (humanoid, { questData }, recipe) => {
        if (recipe.id === "SimpleBandage") {
          const count =
            SimpleBandage.prototype.crafting &&
            SimpleBandage.prototype.crafting.result &&
            SimpleBandage.prototype.crafting.result.SimpleBandage;
          Quest.updateCustomProgress("makeBandages", questData, count);
        }
      }
    },
    objectives: [
      {
        label: "Use Bandages to their maximum potential 20 times",
        progress: Quest.customProgressCallback("useBandages"),
        target: 20
      },
      {
        label: "Make 90 bandages",
        progress: Quest.customProgressCallback("makeBandages"),
        target: 90
      },
      {
        label: "Tend 5000 cuts",
        progress: Quest.customProgressCallback("tendCuts"),
        target: 5000
      },
      {
        label: "Tend 500 bruises",
        progress: Quest.customProgressCallback("tendBruises"),
        target: 500
      },
      {
        label: `Perform 100 "autopsies"`,
        progress: Quest.customProgressCallback("creaturesButchered"),
        target: 100
      },
      Quest.objectiveDoNotDie
    ],
    dialogue: {
      init: {
        text: () =>
          `With great power comes great responsibility. As my doctoring skill increases, I understand the anatomy and can tend wounds better. By using the skill I can achieve a new status and celebrate my achievements.`,
        options: []
      },
      initComplete: {
        text: () =>
          `I feel I gained a deeper understanding of the doctoring skill.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    }
  }
);

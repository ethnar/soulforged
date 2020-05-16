// const TrophyFactory = require("./.trophy");
//
// const material = "Copper";
//
// TrophyFactory(
//   "SMELTING",
//   0,
//   {
//     [`${material}Plate`]: 2,
//     [`${material}Wire`]: 3,
//     [`${material}Rod`]: 1,
//     [`${material}MetalRing`]: 2
//   },
//   `/${ICONS_PATH}/items/decorations/standing/small_trophyicons_05_b.png`,
//   true,
//   {
//     title: "The Smelter",
//     description: `Use your mining skill to obtain various ores.`,
//     icon: Quest.LIFETIME_QUEST_ICON,
//     questEventsHandler: {
//       die: Quest.failQuest
//       // TODO: actual progress
//     },
//     objectives: [
//       {
//         label: `Mine 200 boulders`,
//         progress: Quest.customProgressCallback("mineBoulders"),
//         target: 200
//       },
//       {
//         label: "Mine 300 metal ores",
//         progress: Quest.customProgressCallback("mineOre"),
//         target: 300
//       },
//       {
//         label: "Mine 50 precious metal ores",
//         progress: Quest.customProgressCallback("minePreciousOre"),
//         target: 50
//       }
//     ],
//     dialogue: {
//       init: {
//         text: () =>
//           `As my mining skill increases, I gain better understanding of the minerals of this world. By using the skill I can achieve a new status and celebrate my achievements.`,
//         options: []
//       },
//       initComplete: {
//         text: () =>
//           `I feel I gained a deeper understanding of the mining skill.`,
//         options: [],
//         onTrigger: (quest, creature) => {
//           quest.complete(creature);
//         }
//       }
//     }
//   }
// );

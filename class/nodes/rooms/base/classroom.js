const Base_Storage = require("./storage");

class Base_Classroom extends Base_Storage {
  static getLootTable(tier, base = 100, mult = 0.66) {
    return () => {
      const chances = {
        13: {},
        25: {},
        36: {},
        46: {},
        55: {},
        63: {},
        70: {},
        78: {},
        85: {},
        91: {},
        96: {},
        98: {},
        100: {}
      };

      const list = {
        ClayPot: "2-4",
        Bonemeal: "20-40",
        Crucible: "1-3",
        WoodenPlank: "4-8", // tier 2
        BarkCloth: "3-6",
        FishingRod: "1",
        MortarPestle: "1", // tier 3
        GlassFlask: "1-6",
        ResearchConcept_SparringWeapons_Axe: "3-6",
        ResearchConcept_SmeltingContainer: "3-6", // tier 4
        LeatherPouch: "2-5",
        Parchment: "1-3",
        ResearchConcept_SparringWeapons_Knife: "3-6",
        SoothingBalm: "1-4",
        Ricine: "2-3",
        ResearchConcept_MetalCasting: "3-5",
        HealingPowder: "2-3",
        SimpleBandage: "2-3",
        ResearchConcept_AdvancedAlchemy: "4-10",
        ResearchConcept_Smelting2: "3-6",
        AlchemyIng1_1: "4-12",
        AlchemyIng1_2: "4-12",
        AlchemyIng1_3: "4-12"
      };

      const tierList = Object.keys(list).slice((tier - 1) * 3);

      Object.keys(chances).forEach(c => {
        const item = tierList.shift();
        chances[c] = {
          [item]: list[item]
        };
      });

      const results = {};

      let rollChance = base;
      while (utils.chance(rollChance)) {
        utils.applyTableChance(chances, (item, qty) => {
          results[item] = qty;
        });
        rollChance = rollChance * mult;
      }

      return results;
    };
  }
}
Object.assign(Base_Classroom.prototype, {
  name: "Classroom",
  unlisted: true,
  mapGraphic: {
    5: `tiles/dungeon/rooms/classroom.png`
  }
});

module.exports = global.Base_Classroom = Base_Classroom;

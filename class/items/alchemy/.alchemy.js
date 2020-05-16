require("../../resources/popping/plants/herbs/wildberries");
require("../../resources/popping/plants/herbs/spoolroot");
require("../../resources/popping/plants/herbs/bitterweeds");
require("../../resources/popping/plants/herbs/sungrass");
require("../../resources/popping/plants/herbs/whisper-lily");
require("../../resources/popping/plants/herbs/nightshade");
require("../../resources/popping/plants/herbs/silver-nettle");
require("../../resources/popping/plants/herbs/bladewort");
require("../../resources/popping/plants/herbs/acorn");
require("../../creatures/monsters/animals/swarmer-bat");
require("../../creatures/monsters/animals/rat");
require("../../creatures/monsters/animals/lion");
require("../../creatures/monsters/animals/screech");
require("../../creatures/monsters/animals/dusk-crow");
require("../../creatures/monsters/troll");
require("../../creatures/monsters/plague-beast");
require("../materials/bonemeal");

const Item = require("../.item");

const alchemyItems = [
  {
    tier: 1,
    id: "AlchemyIng1_1",
    name: "Rigid Flakes",
    skillLevel: 1,
    color: "red",
    ingredients: { Wildberry: 4, WhisperLily: 3, Spoolroot: 2 }
  },
  {
    tier: 1,
    id: "AlchemyIng1_2",
    name: "Fright Scrap",
    skillLevel: 1,
    color: "brown",
    ingredients: { Acorn: 3, RatTail: 1, Nightshade: 2 }
  },
  {
    tier: 1,
    id: "AlchemyIng1_3",
    name: "Hefty Scrap",
    skillLevel: 2,
    color: "white",
    ingredients: { Bonemeal: 5, DuskCrowFeather: 2, Sungrass: 3 }
  },
  {
    tier: 1,
    id: "AlchemyIng1_4",
    name: "Glee Flakes",
    skillLevel: 2,
    color: "orange",
    ingredients: { Sungrass: 4, Spoolroot: 3, BatWing: 2 }
  },
  {
    tier: 1,
    id: "AlchemyIng1_5",
    name: "Aged Scrap",
    skillLevel: 3,
    color: "blue",
    ingredients: { SilverNettle: 4, Bladewort: 3, WhisperLily: 2 }
  },
  {
    tier: 1,
    id: "AlchemyIng1_6",
    name: "Noble Pebbles",
    skillLevel: 3,
    color: "purple",
    ingredients: { Bladewort: 4, ScreechFeather: 3, Sungrass: 2 }
  },
  {
    tier: 1,
    id: "AlchemyIng1_7",
    name: "Gaiety Gravel",
    skillLevel: 4,
    color: "green",
    ingredients: { Bitterweed: 4, Nightshade: 2, Acorn: 3 }
  },

  {
    tier: 2,
    id: "AlchemyIng2_1",
    name: "Clear Powder",
    skillLevel: 3,
    color: "blue",
    ingredients: { AlchemyIng1_5: 3, AlchemyIng1_1: 2 }
  },
  {
    tier: 2,
    id: "AlchemyIng2_2",
    name: "Relic Dust",
    skillLevel: 3,
    color: "white",
    ingredients: { AlchemyIng1_3: 3, AlchemyIng1_2: 2, AlchemyIng1_6: 2 }
  },
  {
    tier: 2,
    id: "AlchemyIng2_3",
    name: "Hot Ash",
    skillLevel: 4,
    color: "orange",
    ingredients: { AlchemyIng1_4: 3, AlchemyIng1_3: 2, AlchemyIng1_1: 2 }
  },
  {
    tier: 2,
    id: "AlchemyIng2_4",
    name: "Hoary Paste",
    skillLevel: 4,
    color: "green",
    ingredients: { AlchemyIng1_7: 4, AlchemyIng1_4: 3, AlchemyIng1_3: 3 }
  },
  {
    tier: 2,
    id: "AlchemyIng2_5",
    name: "Staining Residue",
    skillLevel: 5,
    color: "purple",
    ingredients: { AlchemyIng1_6: 4, AlchemyIng1_5: 3, AlchemyIng1_4: 3 }
  },
  {
    tier: 2,
    id: "AlchemyIng2_6",
    name: "Gloomy Residue",
    skillLevel: 6,
    color: "brown",
    ingredients: { AlchemyIng1_2: 3, AlchemyIng1_6: 2 }
  },

  {
    tier: 3,
    id: "AlchemyIng3_1", // cures
    name: "Elder Draught",
    skillLevel: 4,
    color: "red",
    ingredients: { AlchemyIng2_3: 3, AlchemyIng2_5: 2 }
  },
  {
    tier: 3,
    id: "AlchemyIng3_2",
    name: "Dread Tonic",
    skillLevel: 4,
    color: "brown",
    ingredients: { AlchemyIng2_6: 3, AlchemyIng2_2: 2 }
  },
  {
    tier: 3,
    id: "AlchemyIng3_3",
    name: "Slimy Elixir",
    skillLevel: 5,
    color: "green",
    ingredients: { AlchemyIng2_4: 3, AlchemyIng2_1: 2 }
  },
  {
    tier: 3,
    id: "AlchemyIng3_4",
    name: "Imperial Draught",
    skillLevel: 5,
    color: "yellow",
    ingredients: { AlchemyIng2_3: 4, AlchemyIng2_2: 3 }
  },
  {
    tier: 3,
    id: "AlchemyIng3_5",
    name: "Royal Tonic",
    skillLevel: 6,
    color: "purple",
    ingredients: { AlchemyIng2_5: 4, AlchemyIng2_1: 3 }
  }
];

const tierIcons = {
  1: "minced",
  2: "powder",
  3: "pot"
};

const tierMaterials = {
  1: {},
  2: { ClayPot: 1 },
  3: { GlassFlask: 1 }
};

new ResearchConcept({
  name: "Advanced Alchemy",
  className: "ResearchConcept_AdvancedAlchemy",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    utils.xOf(
      7,
      ResearchConcept.knownRecipe("AntidotePowder"),
      ResearchConcept.knownRecipe("HealingPowder"),
      ResearchConcept.knownRecipe("MoodUp"),
      ResearchConcept.knownRecipe("BurnsBalm"),
      ResearchConcept.knownRecipe("SpeedUp"),
      ResearchConcept.knownRecipe("CuringBalm"),
      ResearchConcept.knownRecipe("SoothingBalm"),
      ResearchConcept.knownRecipe("Ricine")
    )
  ]
});

alchemyItems.forEach(itemDef => {
  const colour = itemDef.color;
  const name = itemDef.name;
  const tier = itemDef.tier;

  const skill = SKILLS.ALCHEMY;
  // const toolUtility = tier === 3 ? undefined : TOOL_UTILS.MILLING;
  const toolUtility = undefined;

  const className = itemDef.id;
  const classDef = utils.newClassExtending(className, Item);

  Item.itemFactory(classDef, {
    nameable: true,
    name: name,
    order: ITEMS_ORDER.ALCHEMY + tier,
    icon: `/${ICONS_PATH}/items/alchemy/mats/${colour}_${tierIcons[tier]}.png`,
    weight: 0.3,
    research: {
      sameAsCrafting: true,
      materials: {
        ResearchConcept_AdvancedAlchemy: 1
      }
    },
    crafting: {
      materials: {
        ...tierMaterials[tier],
        ...itemDef.ingredients
      },
      skill,
      skillLevel: itemDef.skillLevel,
      toolUtility,
      baseTime: 700 * Math.pow(1.5, tier - 1)
    }
  });
});

// const ing = [Wildberry, Spoolroot, Bitterweed, Sungrass, WhisperLily, Nightshade, SilverNettle, Bladewort, Acorn, BatWing, RatTail, Bonemeal, ScreechFeather, DuskCrowFeather];
// const names = ['Doom', 'Royal', 'Imperial', 'Noble', 'Hot', 'Rigid', 'Stern', 'Aged', 'Hoary', 'Relic', 'Dread', 'Shudder', 'Torment', 'Elder', 'Hefty', 'Slimy', 'Glee', 'Gaiety', 'Fright'];

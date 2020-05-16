require("./utils");
require("./emojis");

global.ADMIN_EMAIL = "ethnar.dev@gmail.com";

global.SECONDS = 1;
global.MINUTES = 60 * SECONDS;
global.HOURS = 60 * MINUTES;
global.DAYS = 24 * HOURS;
global.MONTHS = 30 * DAYS;
global.YEARS = 12 * MONTHS;
global.IN_MILISECONDS = 1000;

global.DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

global.PERISHING = 6 * MONTHS;

global.CYCLE_RATE = 1000;

global.TOOL_UTIL_BASE_MULT = 1.12;
global.SKILL_BASE_MULT = 1.12;

global.REGION_BOUND_CHANCE = 30;

global.TEMPERATURE_VOLATILITY = 0.2;
global.TEMPERATURE_INTERVAL = 1 * HOURS;
global.TEMPERATURE_STABILITY = 0.001;

global.TERRAFORM_INTERVAL = 15 * HOURS;

global.MAX_RESEARCH_MATERIALS = 10;

global.TILE_HEIGHT_RATIO = 0.76;

global.ICONS_PATH = "icons96";

global.BUILD_TO_REPAIR_RATIO = 4;

global.ENEMY_STATE_TYPES = {
  FIGHTING: 1,
  ANY: 2,
  ATTACKABLE: 3
};

global.ITEM_KNOWLEDGE = {
  KNOWN: 1,
  DEAD_END: 2
};

global.OCCUPY_LEVELS = {
  NONE: 0,
  NO_RIVALS: 1,
  MY_FRIENDS: 2,
  ONLY_ME: 3
};

global.TRADE_TARGETS = {
  EVERYONE: "everyone",
  NO_RIVALS: "no-rivals",
  FRIENDS: "friends"
};

global.SECONDS_NEEDED_FOR_GOOD_SLEEP = 4 * HOURS;

global.LANGUAGES = {
  HUMAN: "human",
  DWARF: "dwarf",
  ELF: "elf",
  ORC: "orc",
  AERIAN: "aerian"
};

global.LANGUAGE_FONTS = {
  [LANGUAGES.HUMAN]: "futhork",
  [LANGUAGES.DWARF]: "intlkarmy",
  [LANGUAGES.ELF]: "wizardspeak",
  [LANGUAGES.ORC]: "mexlar",
  [LANGUAGES.AERIAN]: "drachenklaue"
};

global.DISALLOWED_USERNAME_WORDS = [
  "admin",
  "admln",
  "master",
  "moderator",
  "support",
  "aymar",
  "chur",
  "yarlo",
  "vesna",
  "soulforged"
];

global.PROTECTION_STATUS = {
  IDLE: 1,
  UNPROTECTED: 2,
  PROTECTED: 3
};

global.SKILL_CHANCE = {
  GUARANTEED: 100,
  HIGH: 85,
  LOW: 35,
  TINY: 5,
  NONE: 0
};

global.LOGGING = {
  GOOD: 1,
  WARN: 4,
  FAIL: 5,
  IMMEDIATE_ERROR: 10,
  NORMAL: 0
};

global.DAMAGE_TYPES = {
  BLUNT: 1,
  SLICE: 2,
  PIERCE: 3,
  BURN: 4,
  VENOM: 5
};

global.DAMAGE_TYPE_LEVELS = {
  [DAMAGE_TYPES.BLUNT]: "Bruising",
  [DAMAGE_TYPES.SLICE]: "Cutting",
  [DAMAGE_TYPES.PIERCE]: "Stabbing",
  [DAMAGE_TYPES.BURN]: "Burning",
  [DAMAGE_TYPES.VENOM]: "Venom"
};

global.NODE_TYPES = {
  OCEAN: 300,
  COAST: 301,
  LAKE: 303,
  UNDERGROUND_LAKE: 304,

  // hot
  TROPICAL_PLAINS: 9,
  DESERT_GRASS: 7,
  DESERT_SAND: 12,

  // temp
  BOG: 8,
  PLAINS: 1,
  SCRUB_LAND: 11,

  // cold
  SNOW_FIELDS: 10,
  PLAINS_SNOW: 13,
  COLD_DIRT: 14,

  // hot
  JUNGLE: 15,
  SAVANNAH: 16,
  CACTI: 17,

  // temp
  SWAMP: 18,
  BROADLEAF_FOREST: 6,
  DESERT_PALMS: 19,

  // cold
  CONIFEROUS_FOREST_SNOWED: 20,
  CONIFEROUS_FOREST_COLD: 21,
  CONIFEROUS_FOREST: 22,

  HILLS_REDGRASS: 29,
  HILLS_DIRT: 3,
  HILLS_GRASS: 23,
  HILLS_SNOW: 24,
  HILLS_COLD: 28,

  MOUNTAINS_SNOW: 25,
  MOUNTAINS_COLD: 26,
  MOUNTAINS_DIRT: 27,

  UNDERGROUND_BEDROCK: 101,
  UNDERGROUND_FLOOR: 102,
  UNDERGROUND_CAVE: 103,
  UNDERGROUND_WALL: 104,
  UNDERGROUND_VOLCANO: 105,
  UNDERGROUND_LAVA_PLAINS: 106,

  ROOM_CAVE: 203,
  ROOM_DARK_STONE: 204,
  ROOM_CLAY: 205,
  ROOM_LIGHT_STONE: 206,
  ROOM_DEN: 207,
  ROOM_GREY_STONE: 208
};

global.NODE_TEMPERATURE_INSULATION = {
  [NODE_TYPES.OCEAN]: 1,
  [NODE_TYPES.COAST]: 1,
  [NODE_TYPES.LAKE]: 1,
  [NODE_TYPES.UNDERGROUND_LAKE]: 1,
  [NODE_TYPES.TROPICAL_PLAINS]: 1,
  [NODE_TYPES.DESERT_GRASS]: 1,
  [NODE_TYPES.DESERT_SAND]: 1,
  [NODE_TYPES.BOG]: 1,
  [NODE_TYPES.PLAINS]: 1,
  [NODE_TYPES.SCRUB_LAND]: 1,
  [NODE_TYPES.SNOW_FIELDS]: 1,
  [NODE_TYPES.PLAINS_SNOW]: 1,
  [NODE_TYPES.COLD_DIRT]: 1,
  [NODE_TYPES.JUNGLE]: 2,
  [NODE_TYPES.SAVANNAH]: 2,
  [NODE_TYPES.CACTI]: 2,
  [NODE_TYPES.SWAMP]: 3,
  [NODE_TYPES.BROADLEAF_FOREST]: 3,
  [NODE_TYPES.DESERT_PALMS]: 3,
  [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 3,
  [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 3,
  [NODE_TYPES.CONIFEROUS_FOREST]: 3,
  [NODE_TYPES.HILLS_REDGRASS]: 4,
  [NODE_TYPES.HILLS_DIRT]: 4,
  [NODE_TYPES.HILLS_GRASS]: 4,
  [NODE_TYPES.HILLS_SNOW]: 4,
  [NODE_TYPES.HILLS_COLD]: 4,
  [NODE_TYPES.MOUNTAINS_SNOW]: 9,
  [NODE_TYPES.MOUNTAINS_COLD]: 9,
  [NODE_TYPES.MOUNTAINS_DIRT]: 9,
  [NODE_TYPES.UNDERGROUND_BEDROCK]: 9.8,
  [NODE_TYPES.UNDERGROUND_FLOOR]: 6,
  [NODE_TYPES.UNDERGROUND_CAVE]: 8,
  [NODE_TYPES.UNDERGROUND_WALL]: 9.7,
  [NODE_TYPES.UNDERGROUND_VOLCANO]: 4,
  [NODE_TYPES.UNDERGROUND_LAVA_PLAINS]: 1,
  [NODE_TYPES.ROOM_CAVE]: 8,
  [NODE_TYPES.ROOM_DARK_STONE]: 8,
  [NODE_TYPES.ROOM_CLAY]: 8,
  [NODE_TYPES.ROOM_LIGHT_STONE]: 8,
  [NODE_TYPES.ROOM_DEN]: 8,
  [NODE_TYPES.ROOM_GREY_STONE]: 8
};

global.NODE_NAMES = {
  [NODE_TYPES.COAST]: "Coast Waters",
  [NODE_TYPES.OCEAN]: "Ocean",
  [NODE_TYPES.LAKE]: "Lake",
  [NODE_TYPES.UNDERGROUND_LAKE]: "Lake",
  [NODE_TYPES.TROPICAL_PLAINS]: "Tropical Plains",
  [NODE_TYPES.DESERT_GRASS]: "Plains",
  [NODE_TYPES.DESERT_SAND]: "Desert",
  [NODE_TYPES.BOG]: "Bog",
  [NODE_TYPES.PLAINS]: "Meadow",
  [NODE_TYPES.SCRUB_LAND]: "Scrub Land",
  [NODE_TYPES.SNOW_FIELDS]: "Snow Dunes",
  [NODE_TYPES.PLAINS_SNOW]: "Snowy Plains",
  [NODE_TYPES.COLD_DIRT]: "Tundra",
  [NODE_TYPES.JUNGLE]: "Jungle",
  [NODE_TYPES.SAVANNAH]: "Savannah",
  [NODE_TYPES.CACTI]: "Cacti",
  [NODE_TYPES.SWAMP]: "Swamp",
  [NODE_TYPES.BROADLEAF_FOREST]: "Forest",
  [NODE_TYPES.DESERT_PALMS]: "Palms",
  [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: "Coniferous Forest",
  [NODE_TYPES.CONIFEROUS_FOREST_COLD]: "Coniferous Forest",
  [NODE_TYPES.CONIFEROUS_FOREST]: "Coniferous Forest",
  [NODE_TYPES.HILLS_REDGRASS]: "Hills",
  [NODE_TYPES.HILLS_DIRT]: "Hills",
  [NODE_TYPES.HILLS_GRASS]: "Hills",
  [NODE_TYPES.HILLS_SNOW]: "Hills",
  [NODE_TYPES.HILLS_COLD]: "Hills",
  [NODE_TYPES.MOUNTAINS_DIRT]: "Mountains",
  [NODE_TYPES.MOUNTAINS_COLD]: "Mountains",
  [NODE_TYPES.MOUNTAINS_SNOW]: "Mountains",

  [NODE_TYPES.UNDERGROUND_BEDROCK]: "Bedrock",
  [NODE_TYPES.UNDERGROUND_WALL]: "Cavern Wall",
  [NODE_TYPES.UNDERGROUND_CAVE]: "Cavern",
  [NODE_TYPES.UNDERGROUND_FLOOR]: "Cavern Chamber",

  [NODE_TYPES.ROOM_CAVE]: "Room",
  [NODE_TYPES.ROOM_CLAY]: "Room",
  [NODE_TYPES.ROOM_DARK_STONE]: "Room",
  [NODE_TYPES.ROOM_LIGHT_STONE]: "Room",
  [NODE_TYPES.ROOM_DEN]: "Den",
  [NODE_TYPES.ROOM_GREY_STONE]: "Room"
};

global.TRAVEL_TIMES = {
  "-3": 5 * MINUTES,
  "-2": 5 * MINUTES,
  "-1": 6 * MINUTES,
  0: 9 * MINUTES,
  1: 14 * MINUTES,
  2: 23 * MINUTES,
  3: 35 * MINUTES,
  4: 70 * MINUTES,
  5: 2.5 * HOURS,
  6: 3.5 * HOURS,
  7: 3.5 * HOURS,
  8: 3.5 * HOURS,
  9: 3.5 * HOURS,
  Infinity: Infinity
};

global.NODE_TYPE_TRAVEL_DIFFICULTY = {
  [NODE_TYPES.OCEAN]: Infinity,
  [NODE_TYPES.LAKE]: Infinity,
  [NODE_TYPES.COAST]: Infinity,
  [NODE_TYPES.UNDERGROUND_LAKE]: Infinity,
  [NODE_TYPES.TROPICAL_PLAINS]: 1,
  [NODE_TYPES.DESERT_GRASS]: 0,
  [NODE_TYPES.DESERT_SAND]: 0,
  [NODE_TYPES.BOG]: 3,
  [NODE_TYPES.PLAINS]: 0,
  [NODE_TYPES.SCRUB_LAND]: 0,
  [NODE_TYPES.SNOW_FIELDS]: 2,
  [NODE_TYPES.PLAINS_SNOW]: 1,
  [NODE_TYPES.COLD_DIRT]: 0,
  [NODE_TYPES.JUNGLE]: 4,
  [NODE_TYPES.SAVANNAH]: 1,
  [NODE_TYPES.CACTI]: 0,
  [NODE_TYPES.SWAMP]: 4,
  [NODE_TYPES.BROADLEAF_FOREST]: 0.4,
  [NODE_TYPES.DESERT_PALMS]: 0,
  [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 3,
  [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 2,
  [NODE_TYPES.CONIFEROUS_FOREST]: 2,
  [NODE_TYPES.HILLS_DIRT]: 2,
  [NODE_TYPES.HILLS_REDGRASS]: 2,
  [NODE_TYPES.HILLS_GRASS]: 2,
  [NODE_TYPES.HILLS_SNOW]: 4,
  [NODE_TYPES.HILLS_COLD]: 3,
  [NODE_TYPES.MOUNTAINS_DIRT]: 5,
  [NODE_TYPES.MOUNTAINS_COLD]: 5,
  [NODE_TYPES.MOUNTAINS_SNOW]: 6,

  [NODE_TYPES.UNDERGROUND_BEDROCK]: Infinity,
  [NODE_TYPES.UNDERGROUND_WALL]: Infinity,
  [NODE_TYPES.UNDERGROUND_CAVE]: 2,
  [NODE_TYPES.UNDERGROUND_FLOOR]: 1
};

global.NODE_TYPE_BLOCKS_VISION = {
  [NODE_TYPES.MOUNTAINS_DIRT]: true,
  [NODE_TYPES.MOUNTAINS_SNOW]: true,
  [NODE_TYPES.MOUNTAINS_COLD]: true,
  [NODE_TYPES.UNDERGROUND_WALL]: true,
  [NODE_TYPES.UNDERGROUND_BEDROCK]: true,
  [NODE_TYPES.UNDERGROUND_FLOOR]: true,
  [NODE_TYPES.UNDERGROUND_CAVE]: true
};

global.ITEMS_ORDER = {
  CRITICAL: 10,
  COINS: 10,
  TOOLS: 20,
  WEAPONS: 20,
  ARMOUR: 40,
  JEWELERY: 42,
  MEDICINE: 45,
  USEABLE: 50,
  FOOD: 60,
  GEMS: 70,
  PLANTS: 110,
  OTHER: 120,
  CORPSE: 125,
  DECOR: 130,
  ALCHEMY: 800,
  ALCHEMY2: 900,
  ALCHEMY3: 1000,
  RESEARCH_CONCEPTS: 2000,
  NOTES: 2500,
  KEYS: 3000
};

global.STATS = {
  STRENGTH: 1, // Carry capacity
  DEXTERITY: 2, // Injury chance/severity
  ENDURANCE: 3, // Immunity system
  PERCEPTION: 4, // View range
  INTELLIGENCE: 5 // Skill gains
};

global.STAT_NAMES = {
  [STATS.STRENGTH]: "Strength",
  [STATS.DEXTERITY]: "Dexterity",
  [STATS.ENDURANCE]: "Endurance",
  [STATS.PERCEPTION]: "Perception",
  [STATS.INTELLIGENCE]: "Intelligence"
};

global.SKILLS = {
  CARPENTRY: 1,
  FORAGING: 2,
  MINING: 3,
  SMITHING: 4,
  HUNTING: 6,
  WOODCUTTING: 7,
  PATHFINDING: 8,
  SPELUNKING: 20,
  COOKING: 9,
  CRAFTING: 10,
  FISHING: 11,
  LEATHERWORKING: 12,
  TAILORING: 13,
  FARMING: 14,
  MILLING: 15,
  RESEARCH: 16,
  DOCTORING: 17,
  ALCHEMY: 18,
  SMELTING: 19,
  JEWELCRAFTING: 21,
  TAMING: 22,
  MECHANICS: 23,
  LOCKPICKING: 24,
  TRACKING: 25,
  FIGHTING_UNARMED: 50,
  FIGHTING_IMPROVISED: 51,
  FIGHTING_SWORD: 52,
  FIGHTING_KNIFE: 55,
  FIGHTING_AXE: 53,
  FIGHTING_HAMMER: 54,
  FIGHTING_POLEARM: 56,
  FIGHTING_MACE: 57,
  FIGHTING_DODGE: 80
};

global.SKILL_DESCRIPTIONS = {
  [SKILLS.CARPENTRY]: "",
  [SKILLS.FORAGING]:
    "Foraging skill is used to find and pick up various resources like plants, stones or twigs. Higher foraging skill increases chances to successfully collect the more difficult resources.",
  [SKILLS.MINING]:
    "Mining skill is used to find and dig at various ores and stone boulders. Higher mining skill increases chances to successfully collect the more difficult resources.",
  [SKILLS.SMITHING]: "",
  [SKILLS.HUNTING]:
    "Hunting skill is used to track and kill various non-aggressive animals. Higher hunting skill increases chances to successfully hunt the more difficult animals.",
  [SKILLS.WOODCUTTING]:
    "Wood cutting skill is used to find and chop down various trees. Higher wood cutting skill increases chances to successfully identify suitable trees, meaning greater chances of success gather the more difficult wood types.",
  [SKILLS.PATHFINDING]:
    "Pathfinding skill helps you traverse difficult terrain. Having high pathfinding skill reduces the chances of suffering an injury while navigating to places like hills, forests or mountains.",
  [SKILLS.SPELUNKING]:
    "Spelunking skill helps you traverse underground. Having high spelunking skill reduces the chances of suffering an injury while navigating through caverns.",
  [SKILLS.COOKING]: "",
  [SKILLS.CRAFTING]: "",
  [SKILLS.FISHING]: "",
  [SKILLS.LEATHERWORKING]: "",
  [SKILLS.JEWELCRAFTING]: "",
  [SKILLS.TAMING]: "",
  [SKILLS.TAILORING]: "",
  [SKILLS.FARMING]: "",
  [SKILLS.MILLING]: "",
  [SKILLS.RESEARCH]: "",
  [SKILLS.DOCTORING]:
    "Doctoring skill helps you understand and operate on living organisms, treating their wounds and understanding their anatomy.",
  [SKILLS.ALCHEMY]: "",
  [SKILLS.SMELTING]: "",
  [SKILLS.MECHANICS]: "",
  [SKILLS.LOCKPICKING]: "",
  [SKILLS.TRACKING]:
    "Tracking skill helps you recognise different creatures. Having high tracking skill will reveal more information about the creatures up front and it will also allow you to gather even more information when you track them.",
  [SKILLS.FIGHTING_UNARMED]:
    "Unarmed fighting skill increases chances to successfully strike an oppontent when not using any weapons.",
  [SKILLS.FIGHTING_IMPROVISED]:
    "Improvised fighting skill increases chances to successfully strike an oppontent when using improvised weapons.",
  [SKILLS.FIGHTING_SWORD]:
    "Sword fighting skill increases chances to successfully strike an oppontent when using sword weapons.",
  [SKILLS.FIGHTING_KNIFE]:
    "Knife fighting skill increases chances to successfully strike an oppontent when using knife weapons.",
  [SKILLS.FIGHTING_AXE]:
    "Axe fighting skill increases chances to successfully strike an oppontent when using axe weapons.",
  [SKILLS.FIGHTING_HAMMER]:
    "Hammer fighting skill increases chances to successfully strike an oppontent when using hammer weapons.",
  [SKILLS.FIGHTING_POLEARM]:
    "Pole arm fighting skill increases chances to successfully strike an oppontent when using pole arm weapons.",
  [SKILLS.FIGHTING_MACE]:
    "Mace fighting skill increases chances to successfully strike an oppontent when using various blunt weapons.",
  [SKILLS.FIGHTING_DODGE]:
    "Dodging skills provides you an additional chance to avoid enemy attacks."
};

global.SKILL_NAMES = {
  [SKILLS.CARPENTRY]: "Carpentry",
  [SKILLS.FORAGING]: "Foraging",
  [SKILLS.MINING]: "Mining",
  [SKILLS.WOODCUTTING]: "Wood cutting",
  [SKILLS.SMITHING]: "Smithing",
  [SKILLS.HUNTING]: "Hunting",
  [SKILLS.PATHFINDING]: "Pathfinding",
  [SKILLS.SPELUNKING]: "Spelunking",
  [SKILLS.COOKING]: "Cooking",
  [SKILLS.CRAFTING]: "Crafting",
  [SKILLS.FISHING]: "Fishing",
  [SKILLS.LEATHERWORKING]: "Leatherworking",
  [SKILLS.JEWELCRAFTING]: "Jewelcrafting",
  [SKILLS.TAMING]: "Taming",
  [SKILLS.TAILORING]: "Tailoring",
  [SKILLS.FARMING]: "Farming",
  [SKILLS.MILLING]: "Milling",
  [SKILLS.RESEARCH]: "Research",
  [SKILLS.DOCTORING]: "Doctoring",
  [SKILLS.ALCHEMY]: "Alchemy",
  [SKILLS.SMELTING]: "Smelting",
  [SKILLS.MECHANICS]: "Mechanics",
  [SKILLS.LOCKPICKING]: "Lockpicking",
  [SKILLS.TRACKING]: "Tracking",
  [SKILLS.FIGHTING_UNARMED]: "Combat: Unarmed",
  [SKILLS.FIGHTING_IMPROVISED]: "Combat: Improvised",
  [SKILLS.FIGHTING_SWORD]: "Combat: Sword",
  [SKILLS.FIGHTING_AXE]: "Combat: Axe",
  [SKILLS.FIGHTING_HAMMER]: "Combat: Hammer",
  [SKILLS.FIGHTING_KNIFE]: "Combat: Knife",
  [SKILLS.FIGHTING_POLEARM]: "Combat: Pole arm",
  [SKILLS.FIGHTING_MACE]: "Combat: Mace",
  [SKILLS.FIGHTING_DODGE]: "Combat: Dodge"
};

global.SKILL_STATS = {
  [SKILLS.CARPENTRY]: [STATS.DEXTERITY, STATS.INTELLIGENCE],
  [SKILLS.FORAGING]: [STATS.PERCEPTION],
  [SKILLS.MINING]: [STATS.STRENGTH],
  [SKILLS.WOODCUTTING]: [STATS.STRENGTH, STATS.ENDURANCE],
  [SKILLS.SMITHING]: [STATS.STRENGTH, STATS.DEXTERITY],
  [SKILLS.HUNTING]: [STATS.PERCEPTION, STATS.DEXTERITY],
  [SKILLS.PATHFINDING]: [STATS.PERCEPTION, STATS.ENDURANCE, STATS.DEXTERITY],
  [SKILLS.SPELUNKING]: [STATS.STRENGTH, STATS.ENDURANCE, STATS.DEXTERITY],
  [SKILLS.COOKING]: [STATS.INTELLIGENCE],
  [SKILLS.CRAFTING]: [STATS.DEXTERITY, STATS.INTELLIGENCE],
  [SKILLS.FISHING]: [STATS.DEXTERITY, STATS.ENDURANCE],
  [SKILLS.LEATHERWORKING]: [STATS.DEXTERITY, STATS.INTELLIGENCE],
  [SKILLS.JEWELCRAFTING]: [STATS.INTELLIGENCE],
  [SKILLS.TAMING]: [STATS.INTELLIGENCE],
  [SKILLS.TAILORING]: [STATS.DEXTERITY],
  [SKILLS.FARMING]: [STATS.ENDURANCE],
  [SKILLS.MILLING]: [STATS.STRENGTH, STATS.ENDURANCE],
  [SKILLS.RESEARCH]: [STATS.INTELLIGENCE],
  [SKILLS.DOCTORING]: [STATS.INTELLIGENCE, STATS.DEXTERITY],
  [SKILLS.ALCHEMY]: [STATS.INTELLIGENCE],
  [SKILLS.SMELTING]: [STATS.ENDURANCE],
  [SKILLS.MECHANICS]: [STATS.INTELLIGENCE],
  [SKILLS.LOCKPICKING]: [STATS.INTELLIGENCE, STATS.DEXTERITY],
  [SKILLS.TRACKING]: [STATS.INTELLIGENCE, STATS.PERCEPTION],
  [SKILLS.FIGHTING_UNARMED]: [STATS.STRENGTH, STATS.DEXTERITY],
  [SKILLS.FIGHTING_IMPROVISED]: [
    STATS.STRENGTH,
    STATS.DEXTERITY,
    STATS.INTELLIGENCE
  ],
  [SKILLS.FIGHTING_SWORD]: [STATS.STRENGTH, STATS.DEXTERITY],
  [SKILLS.FIGHTING_AXE]: [STATS.DEXTERITY, STATS.ENDURANCE],
  [SKILLS.FIGHTING_HAMMER]: [STATS.STRENGTH, STATS.ENDURANCE],
  [SKILLS.FIGHTING_MACE]: [STATS.STRENGTH, STATS.ENDURANCE],
  [SKILLS.FIGHTING_KNIFE]: [STATS.DEXTERITY],
  [SKILLS.FIGHTING_POLEARM]: [STATS.DEXTERITY, STATS.INTELLIGENCE],
  [SKILLS.FIGHTING_DODGE]: [STATS.DEXTERITY]
};

// Stats impact speed, skills impact availability

/*
 gather food
 gather wood
 gather ore
 smelt ore
 craft tools (fishing rod)
 smith tools
 smith weapons & armor
 hunt for leather
 hunt for food
 craft leather armor
 cooking meals
 craft shields
 use shields
 dodge
 attack
 craft traps?
 brewing
 craft furniture
 glass?
 mine salt
 bone craft?

 paint?
 paintings?

 buildings:
 houses
 alchemy?

 clay
 pots
 glass containers

 stealthing

 periodic resources? :D
 Like meteor drops
 */

global.EQUIPMENT_SLOTS = {
  TOOL: 932,
  WEAPON: 12,
  OFFHAND: 82,
  HEAD: 332,
  CHEST: 231,
  HANDS: 221,
  TROUSERS: 453,
  FEET: 239,
  FINGER: 922,
  NECK: 924
};

global.DECORATION_SLOTS = {
  FLOOR: 3440,
  SEATS: 3702,
  TABLE: 4330,
  SLEEPING: 4456,
  // STORAGE: 3992,
  SMALL_HANGING_DECOR: 6643,
  MEDIUM_HANGING_DECOR: 1124,
  LARGE_HANGING_DECOR: 5949,
  SMALL_STANDING_DECOR: 5952,
  MEDIUM_STANDING_DECOR: 5955,
  LARGE_STANDING_DECOR: 5950
};

global.DECORATION_SLOT_NAMES = {
  [DECORATION_SLOTS.FLOOR]: "Floor",
  [DECORATION_SLOTS.SEATS]: "Seats",
  [DECORATION_SLOTS.TABLE]: "Table",
  [DECORATION_SLOTS.SLEEPING]: "Sleeping",
  // [DECORATION_SLOTS.STORAGE]: 'Storage',
  [DECORATION_SLOTS.SMALL_HANGING_DECOR]: "Hanging decoration (small)",
  [DECORATION_SLOTS.MEDIUM_HANGING_DECOR]: "Hanging decoration (medium)",
  [DECORATION_SLOTS.LARGE_HANGING_DECOR]: "Hanging decoration (large)",
  [DECORATION_SLOTS.SMALL_STANDING_DECOR]: "Standing decoration (small)",
  [DECORATION_SLOTS.MEDIUM_STANDING_DECOR]: "Standing decoration (medium)",
  [DECORATION_SLOTS.LARGE_STANDING_DECOR]: "Standing decoration (large)"
};

global.EQUIPMENT_SLOT_NAMES = {
  [EQUIPMENT_SLOTS.TOOL]: "Tool",
  [EQUIPMENT_SLOTS.CHEST]: "Chest",
  [EQUIPMENT_SLOTS.HEAD]: "Head",
  [EQUIPMENT_SLOTS.TROUSERS]: "Trousers",
  [EQUIPMENT_SLOTS.FEET]: "Boots",
  [EQUIPMENT_SLOTS.HANDS]: "Gloves",
  [EQUIPMENT_SLOTS.WEAPON]: "Weapon",
  [EQUIPMENT_SLOTS.FINGER]: "Finger",
  [EQUIPMENT_SLOTS.NECK]: "Neck",
  [EQUIPMENT_SLOTS.OFFHAND]: "Offhand"
};

global.TOOL_UTILS = {
  FIRESTARTER: "fire starter",
  TAMING: "taming",
  WOODCUTTING: "wood cutting",
  CUTTING: "cutting",
  HAMMER: "hammering",
  HUNTING: "hunting",
  MINING: "mining",
  FISHING: "fishing",
  MILLING: "milling",
  WEAVING: "weaving",
  HOE: "hoe",
  SEWING: "sewing",
  CARVING: "carving",
  ETCHING: "etching",
  SAWING: "sawing",
  LOCKPICKING: "lockpicking",
  TRANSPORTATION: "transportation",
  WRITING_PARCHMENT: "writing: Parchment",
  GEMCUTTING: "gem cutting"
};

const getSkillBonusId = skillId => `bonus_${skillId}`;
global.getStatGainId = statId => `statGain_${statId}`;

global.BUFFS = {
  ACTION_SPEED: "efficiency",
  COMBAT_STRENGTH: "combatStrength",
  ACTION_STAT_GAINS: "actionStatGain",
  ENERGY: "energy",
  SATIATION: "satiation",
  BUILDING: "building",
  MOOD: "mood",
  FOOD_BONUS: "foodBonus",
  BLOOD: "blood",
  PAIN: "pain",
  LUCK: "luck",
  NAUSEOUS: "nauseous",
  HUNGER_RATE: "hungerRate",
  BLEEDING: "bleeding",
  BLEEDING_MULTIPLIER: "bleedingMult",
  VIEW_RANGE: "viewRange",
  VIEW_RANGE_OVERWORLD: "viewRangeOver",
  TRAVEL_SPEED: "travelSpeed",
  DODGE_MULTIPLIER: "dodgeMultiplier",
  TRAVEL_DIFFICULTY_OVERWORLD: "travelDifficulty",
  TRAVEL_TIME: "travelTime",
  TRAVEL_DIFFICULTY: "travelDifficultyAll",
  CARRY_CAPACITY: "carryCapacity",
  BERSERK: "berserk",
  INVISIBILITY: "invisibility",
  TEMPERATURE_OVERWORLD: "temperature",
  TEMPERATURE_MIN: "cold",
  TEMPERATURE_MAX: "heat",
  INTERNAL_DAMAGE: "internalDamage",
  HIDING_TIME: "hidingTime",
  FLEE_TIME: "fleeTime",
  FLEE_AVOIDANCE: "fleeAvoidance",
  VENOM: "poison",
  ARMOR: {
    [DAMAGE_TYPES.BLUNT]: "blunt",
    [DAMAGE_TYPES.SLICE]: "slice",
    [DAMAGE_TYPES.PIERCE]: "pierce",
    [DAMAGE_TYPES.BURN]: "burn",
    [DAMAGE_TYPES.VENOM]: "poison"
  },
  SKILLS: Object.keys(SKILLS).toObject(
    k => k,
    k => SKILL_NAMES[SKILLS[k]]
  ),
  STATS: Object.keys(STATS).toObject(
    k => k,
    k => STAT_NAMES[STATS[k]]
  ),
  STATS_GAINS: Object.keys(STATS).toObject(
    k => k,
    k => getStatGainId(STATS[k])
  ),
  TOOL_UTILITY: Object.keys(TOOL_UTILS).toObject(
    k => k,
    k => TOOL_UTILS[k]
  ),
  SKILL_SPEED: Object.values(SKILLS).toObject(
    skill => skill,
    skill => getSkillBonusId(skill)
  )
};

global.BUFF_LABELS = {
  [BUFFS.ENERGY]: "Energy",
  [BUFFS.ACTION_SPEED]: "Action Speed",
  [BUFFS.COMBAT_STRENGTH]: "Combat Strength",
  [BUFFS.ACTION_STAT_GAINS]: null,
  [BUFFS.MOOD]: "Mood",
  [BUFFS.FOOD_BONUS]: "Food Effects Gained",
  [BUFFS.PAIN]: "Pain",
  [BUFFS.BLOOD]: "Blood",
  [BUFFS.BUILDING]: "Construction Speed",
  [BUFFS.NAUSEOUS]: null,
  [BUFFS.LUCK]: null,
  [BUFFS.HUNGER_RATE]: "Hunger Rate",
  [BUFFS.BLEEDING]: "Bleeding",
  [BUFFS.BLEEDING_MULTIPLIER]: "Bleeding Multiplier",
  [BUFFS.TRAVEL_SPEED]: "Travel Speed",
  [BUFFS.DODGE_MULTIPLIER]: "Dodge chance Multiplier",
  [BUFFS.TRAVEL_DIFFICULTY_OVERWORLD]: "Pathfinding Difficulty",
  [BUFFS.TRAVEL_DIFFICULTY]: "Travel Difficulty",
  [BUFFS.TRAVEL_TIME]: "Travel Time",
  [BUFFS.CARRY_CAPACITY]: "Carry Capacity",
  [BUFFS.BERSERK]: "Berserk",
  [BUFFS.INVISIBILITY]: "Invisibility",
  [BUFFS.TEMPERATURE_OVERWORLD]: "Temperature",
  [BUFFS.VIEW_RANGE]: "View Range",
  [BUFFS.VIEW_RANGE_OVERWORLD]: "View Range",
  [BUFFS.INTERNAL_DAMAGE]: "Internal Damage",
  [BUFFS.TEMPERATURE_MIN]: "Cold Resistance",
  [BUFFS.TEMPERATURE_MAX]: "Heat Resistance",
  [BUFFS.HIDING_TIME]: "Hiding Time",
  [BUFFS.FLEE_TIME]: "Fleeing Time",
  [BUFFS.FLEE_AVOIDANCE]: "Fleeing Avoidance Chance",
  [BUFFS.VENOM]: "Venom",
  [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: "Blunt Resistance",
  [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: "Cut Resistance",
  [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: "Stab Resistance",
  [BUFFS.ARMOR[DAMAGE_TYPES.BURN]]: "Burn Resistance",
  [BUFFS.ARMOR[DAMAGE_TYPES.VENOM]]: "Venom Resistance",
  ...Object.values(STATS).toObject(
    stat => getStatGainId(stat),
    stat => `${STAT_NAMES[stat]} Gain`
  ),
  ...SKILL_NAMES,
  ...Object.keys(TOOL_UTILS).toObject(
    k => TOOL_UTILS[k],
    k => `Tool: ${utils.ucfirst(TOOL_UTILS[k])}`
  ),
  ...Object.values(SKILLS).toObject(
    skill => getSkillBonusId(skill),
    skill => `Skill Speed: ${SKILL_NAMES[skill]}`
  )
};

global.BUFF_GROUPS = {
  // [BUFFS.ENERGY]: "Energy",
  [BUFFS.ACTION_SPEED]: "1:Status",
  [BUFFS.COMBAT_STRENGTH]: "2:Combat",
  [BUFFS.ACTION_STAT_GAINS]: "1:Status",
  [BUFFS.MOOD]: "1:Status",
  // [BUFFS.FOOD_BONUS]: "Food effects gained",
  [BUFFS.PAIN]: "3:Wounds",
  [BUFFS.BLOOD]: "3:Wounds",
  // [BUFFS.BUILDING]: "Construction speed",
  // [BUFFS.NAUSEOUS]: null,
  // [BUFFS.LUCK]: null,
  // [BUFFS.HUNGER_RATE]: "Hunger Rate",
  [BUFFS.BLEEDING]: "3:Wounds",
  [BUFFS.BLEEDING_MULTIPLIER]: "3:Wounds",
  [BUFFS.TRAVEL_SPEED]: "13:Travel",
  [BUFFS.DODGE_MULTIPLIER]: "2:Combat",
  [BUFFS.TRAVEL_DIFFICULTY_OVERWORLD]: "13:Travel",
  [BUFFS.TRAVEL_DIFFICULTY]: "13:Travel",
  [BUFFS.TRAVEL_TIME]: "13:Travel",
  // [BUFFS.CARRY_CAPACITY]: "Carry Capacity",
  // [BUFFS.BERSERK]: "Berserk",
  // [BUFFS.INVISIBILITY]: "Invisibility",
  // [BUFFS.TEMPERATURE_OVERWORLD]: "Temperature",
  // [BUFFS.VIEW_RANGE]: "View Range",
  // [BUFFS.VIEW_RANGE_OVERWORLD]: "View Range",
  [BUFFS.INTERNAL_DAMAGE]: "3:Wounds",
  [BUFFS.TEMPERATURE_MIN]: "10:Temperature",
  [BUFFS.TEMPERATURE_MAX]: "10:Temperature",
  // [BUFFS.HIDING_TIME]: "Hiding Time",
  // [BUFFS.FLEE_TIME]: "Fleeing Time",
  // [BUFFS.FLEE_AVOIDANCE]: "Fleeing avoidance chance",
  [BUFFS.VENOM]: "3:Wounds",
  [BUFFS.ARMOR[DAMAGE_TYPES.BLUNT]]: "9:Resistances",
  [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: "9:Resistances",
  [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: "9:Resistances",
  [BUFFS.ARMOR[DAMAGE_TYPES.BURN]]: "9:Resistances",
  [BUFFS.ARMOR[DAMAGE_TYPES.VENOM]]: "9:Resistances",
  ...Object.values(SKILL_NAMES).toObject(
    k => k,
    k => "5:Skills"
  ),
  // ...Object.keys(TOOL_UTILS).toObject(
  //   k => TOOL_UTILS[k],
  //   k => `Tool: ${utils.ucfirst(TOOL_UTILS[k])}`
  // ),
  ...Object.values(STAT_NAMES).toObject(
    k => k,
    k => "4:Statistics"
  ),
  ...Object.values(SKILLS).toObject(
    skill => getSkillBonusId(skill),
    skill => `6:Skills speed`
  )
};

global.NEGATIVE_BUFFS = {
  [BUFFS.PAIN]: true,
  [BUFFS.BLEEDING]: true,
  [BUFFS.BLEEDING_MULTIPLIER]: true,
  [BUFFS.HUNGER_RATE]: true,
  [BUFFS.TRAVEL_DIFFICULTY_OVERWORLD]: true,
  [BUFFS.TRAVEL_DIFFICULTY]: true,
  [BUFFS.INTERNAL_DAMAGE]: true,
  [BUFFS.FLEE_TIME]: true,
  [BUFFS.VENOM]: true,
  [BUFFS.TRAVEL_TIME]: true
};

global.DISCRETE_BUFFS = {
  [BUFFS.BERSERK]: true,
  [BUFFS.INVISIBILITY]: true
};

global.PERCENTAGE_BUFFS = {
  [BUFFS.TRAVEL_SPEED]: true,
  [BUFFS.TRAVEL_TIME]: true,
  [BUFFS.ACTION_SPEED]: true,
  [BUFFS.HIDING_TIME]: true,
  [BUFFS.COMBAT_STRENGTH]: true,
  [BUFFS.ACTION_STAT_GAINS]: true,
  [BUFFS.FLEE_AVOIDANCE]: true,
  [BUFFS.BUILDING]: true,
  [BUFFS.HUNGER_RATE]: true,
  [BUFFS.FOOD_BONUS]: true,
  // [BUFFS.HIDING_TIME]: true,
  // [BUFFS.FLEE_TIME]: true,
  ...Object.keys(TOOL_UTILS).toObject(
    k => TOOL_UTILS[k],
    () => true
  ),
  ...Object.keys(TOOL_UTILS).toObject(
    k => getSkillBonusId(TOOL_UTILS[k]),
    () => true
  )
};

global.MULTIPLIER_BUFFS = {
  [BUFFS.ACTION_SPEED]: true,
  [BUFFS.COMBAT_STRENGTH]: true,
  [BUFFS.ACTION_STAT_GAINS]: true,
  [BUFFS.BLEEDING_MULTIPLIER]: true,
  [BUFFS.FLEE_TIME]: true,
  [BUFFS.BUILDING]: true,
  [BUFFS.DODGE_MULTIPLIER]: true,
  [BUFFS.CARRY_CAPACITY]: true,
  ...Object.keys(TOOL_UTILS).toObject(
    k => TOOL_UTILS[k],
    k => true
  )
};

global.SCOUTER_MESSAGES = {
  TINY_POO: {
    text: "There are traces of droppings of a small animal",
    icon: `/${ICONS_PATH}/scouter/huntingicons_09_tiny.png`
  },
  ANIMAL_POO: {
    text: "There are traces of animal excrement",
    icon: `/${ICONS_PATH}/scouter/huntingicons_09.png`
  },

  PAWS_TINY: {
    text: "You found some tiny paw prints",
    icon: `/${ICONS_PATH}/scouter/yellow_06_tiny.png`
  },
  PAWS_REGULAR: {
    text: "You found some animal paw prints",
    icon: `/${ICONS_PATH}/scouter/yellow_06_small.png`
  },
  PAWS_HUGE: {
    text: "You found some massive paw prints",
    icon: `/${ICONS_PATH}/scouter/yellow_06_red.png`
  },
  FOOTPRINTS_TINY: {
    text: "You found some strange, tiny footprints",
    icon: `/${ICONS_PATH}/scouter/scifi_skill_g_24_tiny.png`
  },
  FOOTPRINTS_HUMANOID: {
    text: "You found some average sized footprints",
    icon: `/${ICONS_PATH}/scouter/scifi_skill_g_24.png`
  },
  FOOTPRINTS_HUGE: {
    text: "You found some enormous footprints",
    icon: `/${ICONS_PATH}/scouter/scifi_skill_g_24_big.png`
  },

  HUMANOID_FIGURE: {
    text: "You catch glimpses of a humanoid silhouette",
    icon: `/${ICONS_PATH}/scouter/humanoid.png`
  },

  FUR_GREY: {
    text: "You found traces of some gray fur",
    icon: `/${ICONS_PATH}/scouter/huntingicons_34_grey.png`
  },
  FUR_TAN: {
    text: "You found traces of some tan fur",
    icon: `/${ICONS_PATH}/scouter/huntingicons_34.png`
  },
  FUR_BLACK: {
    text: "You found traces of some black fur",
    icon: `/${ICONS_PATH}/scouter/huntingicons_34_black.png`
  },

  SOUNDS_HOWLING: {
    text: "You can hear howling in the distance",
    icon: `/${ICONS_PATH}/scouter/wave_cyan.png`
  },
  SOUNDS_ROARING: {
    text: "You can hear a wild roar in the distance",
    icon: `/${ICONS_PATH}/scouter/wave_orange.png`
  },
  SOUNDS_HISSING: {
    text: "You notice a hissing sound",
    icon: `/${ICONS_PATH}/scouter/wave_blue.png`
  },
  SOUNDS_SKITTERING: {
    text: "You notice a skittering sound",
    icon: `/${ICONS_PATH}/scouter/wave_yellow.png`
  },
  SOUNDS_SCREECHING: {
    text: "A screech can be heard in the distance",
    icon: `/${ICONS_PATH}/scouter/wave_purple.png`
  },
  SOUNDS_TRUMPETING: {
    text: "You can hear a trumpeting sound in the distance",
    icon: `/${ICONS_PATH}/scouter/wave_grey.png`
  },
  // SOUNDS_CHATTER: {           text: 'You can hear what seems to be chatter',                              icon: `/${ICONS_PATH}/scouter/wave_green.png` },

  CARCASSES_TINY: {
    text: "There are traces of small animal carcases in the area",
    icon: `/${ICONS_PATH}/scouter/sgi_166.png`
  },
  CARCASSES_MEDIUM: {
    text: "There are traces of animal carcases in the area",
    icon: `/${ICONS_PATH}/scouter/addon_01_rotate.png`
  },
  CARCASSES_BONES: {
    text: "You found some piles of gnawed on bones",
    icon: `/${ICONS_PATH}/scouter/necromancericons_31_b_fix.png`
  },

  WEBS_SMALL: {
    text: "There are traces of small webs spread in the area",
    icon: `/${ICONS_PATH}/scouter/violet_15_white.png`
  },
  WEBS_LARGE: {
    text: "There are large webs spread in the area",
    icon: `/${ICONS_PATH}/scouter/violet_15_blue.png`
  },
  WEBS_HUGE: {
    text: "Massive webs cover the area",
    icon: `/${ICONS_PATH}/scouter/violet_15_red.png`
  },

  CLAW_MARKS_REGULAR: {
    text: "You notice some claw marks",
    icon: `/${ICONS_PATH}/scouter/red_23_grey.png`
  },
  CLAW_MARKS_HUGE: {
    text: "You find massive claw marks",
    icon: `/${ICONS_PATH}/scouter/red_23.png`
  },

  INSECT_PIECES: {
    text: "You notice some chitinous fragments",
    icon: `/${ICONS_PATH}/scouter/spellbook01_41_fgm.png`
  },
  FEATHERS: {
    text: "You notice some feathers",
    icon: `/${ICONS_PATH}/scouter/foresticons_14_b.png`
  },
  SCALE_FRAGMENTS: {
    text: "You notice some scale fragments",
    icon: `/${ICONS_PATH}/scouter/fishing_89_b.png`
  },
  SLIME: {
    text: "Strange, slimy substance can be seen",
    icon: `/${ICONS_PATH}/scouter/spellbookpreface_11.png`
  },
  FLYING: {
    text: "You catch glimpses of a shadow of a creature in the sky",
    icon: `/${ICONS_PATH}/scouter/sgi_30_sky.png`
  },
  EGG_SHELLS: {
    text: "You notice some egg shells",
    icon: `/${ICONS_PATH}/scouter/prehistoricicon_07_b_recolor.png`
  },

  NONE: {
    text: "There are no discernible tracks",
    icon: `/${ICONS_PATH}/scouter/gray_11.png`
  },

  EQUIPMENT: {
    textDynamic: creature =>
      creature.hasAnythingEquipped()
        ? "The creature appears to be using some equipment"
        : "The creature appears to not be using any equipment",
    icon: `/${ICONS_PATH}/scouter/bag.png`
  }
};

global.MULTIPLIER_BUFFS_BY_LABEL = Object.keys(MULTIPLIER_BUFFS).toObject(
  k => BUFF_LABELS[k],
  k => MULTIPLIER_BUFFS[k]
);

global.RESOURCE_REROLL_FREQUENCY = 1 * DAYS;

global.FEATURE_BADGES = {
  TRACKING: 1
};

global.ACTION = {
  FINISHED: false,
  CONTINUE: true
};

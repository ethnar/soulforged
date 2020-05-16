const server = require("../server");
require("../../class/buffs/buff");

const requiresSkill = (skill, level) => creature =>
  creature.getSkillLevel(skill) >= level;

const requiresHavingPerk = (perk, level = 1) => creature =>
  PerkSystem.hasPerk(creature, perk, level);

const requiresNotHavingPerk = (perk, level = 1) => creature =>
  !PerkSystem.hasPerk(creature, perk, level);

const requiresKnowingItem = itemClass => creature =>
  creature.knowsItem(itemClass);

const requiresKnowingBuilding = buildingClassName => creature =>
  Plan.getPlanById(buildingClassName) &&
  creature.knowsBuilding(Plan.getPlanById(buildingClassName));

const requiresKnowingCraft = itemClassName => creature =>
  Recipe.getRecipeById(itemClassName) &&
  creature.knowsCraftingRecipe(Recipe.getRecipeById(itemClassName));

global.PERKS = {};

const PERKS_PROPERTIES = [
  /**************************************/
  /*************** LEVEL 1 **************/
  /**************************************/
  {
    icon: `/${ICONS_PATH}/perks/sgi_126.png`,
    name: "Bruiser",
    requiredLevel: 1,
    pointCost: 10,
    effects: {
      [BUFFS.STATS.STRENGTH]: +6,
      [BUFFS.STATS.INTELLIGENCE]: -3,
      [BUFFS.STATS.DEXTERITY]: -3
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_161_mod.png`,
    name: "Nimble",
    requiredLevel: 1,
    pointCost: 10,
    effects: {
      [BUFFS.STATS.DEXTERITY]: +6,
      [BUFFS.STATS.STRENGTH]: -3,
      [BUFFS.STATS.ENDURANCE]: -3
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_97.png`,
    name: "Thinker",
    requiredLevel: 1,
    pointCost: 10,
    effects: {
      [BUFFS.STATS.INTELLIGENCE]: +6,
      [BUFFS.STATS.STRENGTH]: -2,
      [BUFFS.STATS.ENDURANCE]: -2,
      [BUFFS.STATS.DEXTERITY]: -2
    }
  },
  /**************************************/
  /*************** LEVEL 2 **************/
  /**************************************/
  {
    icon: `/${ICONS_PATH}/perks/sgi_12.png`,
    name: "Thick skinned",
    requiredLevel: 2,
    pointCost: 10,
    effects: {
      [BUFFS.STATS.DEXTERITY]: -4,
      [BUFFS.ARMOR[DAMAGE_TYPES.SLICE]]: 2,
      [BUFFS.ARMOR[DAMAGE_TYPES.PIERCE]]: 2
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/blue_04_nobg.png`,
    name: "Cold blooded",
    requiredLevel: 2,
    pointCost: 10,
    effects: {
      [BUFFS.TEMPERATURE_MIN]: 1.5,
      [BUFFS.TEMPERATURE_MAX]: -1.5
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_45.png`,
    name: `Hunter's sight`,
    requiredLevel: Infinity,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.HUNTING]: 0.3
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_45.png`,
    name: `Hunter's focus`,
    requiredLevel: 2,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.HUNTING]: 0.5,
      [BUFFS.SKILLS.FORAGING]: -0.5
    }
  },
  /**************************************/
  /*************** LEVEL 3 **************/
  /**************************************/
  {
    icon: `/${ICONS_PATH}/perks/sgi_85.png`,
    name: "Careful Stride",
    requiredLevel: 3,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.PATHFINDING]: 0.5,
      [BUFFS.SKILLS.SPELUNKING]: 0.5,
      [BUFFS.TRAVEL_SPEED]: -5
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/yellow_39.png`,
    name: "Hot blooded",
    requiredLevel: 3,
    pointCost: 10,
    effects: {
      [BUFFS.TEMPERATURE_MIN]: -1.5,
      [BUFFS.TEMPERATURE_MAX]: 1.5
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_162.png`,
    name: `Farmer`,
    requiredLevel: Infinity,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.FARMING]: 0.3
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_162.png`,
    name: `Green thumb`,
    requiredLevel: 3,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.FARMING]: 0.5,
      [BUFFS.SKILLS.FORAGING]: 0.3,
      [BUFFS.SKILLS.SPELUNKING]: -1
    }
  },
  /**************************************/
  /*************** LEVEL 4 **************/
  /**************************************/
  {
    icon: `/${ICONS_PATH}/perks/spellbookpage09_39.png`,
    name: "Careless Stride",
    requiredLevel: 4,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.PATHFINDING]: -0.5,
      [BUFFS.SKILLS.SPELUNKING]: -0.5,
      [BUFFS.TRAVEL_SPEED]: +5
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_01.png`,
    name: `Forager`,
    requiredLevel: Infinity,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.FORAGING]: 0.3
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_01.png`,
    name: `Gatherer`,
    requiredLevel: 4,
    pointCost: 10,
    effects: {
      [BUFFS.SKILLS.FORAGING]: 0.5,
      [BUFFS.SKILLS.HUNTING]: -0.5
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_141.png`,
    name: `Builder`,
    requiredLevel: Infinity,
    pointCost: 10,
    effects: {
      [BUFFS.BUILDING]: 110
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_141.png`,
    name: `Homebird`,
    requiredLevel: 4,
    pointCost: 10,
    effects: {
      [BUFFS.BUILDING]: 120,
      [BUFFS.SKILLS.PATHFINDING]: -0.2,
      [BUFFS.SKILLS.SPELUNKING]: -0.2,
      [BUFFS.TRAVEL_SPEED]: -5
    }
  },
  /**************************************/
  /*************** LEVEL 5 **************/
  /**************************************/
  {
    icon: `/${ICONS_PATH}/perks/scifi_skill_r_25.png`,
    name: `Pain tolerant`,
    requiredLevel: 5,
    pointCost: 20,
    effects: {
      [BUFFS.PAIN]: -10,
      [BUFFS.STATS.INTELLIGENCE]: -2
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/red_17.png`,
    name: `Fast metabolism`,
    requiredLevel: 5,
    pointCost: 20,
    effects: {
      [BUFFS.ACTION_SPEED]: 105,
      [BUFFS.HUNGER_RATE]: +15
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_160_recolor.png`,
    name: `Spelunker`,
    requiredLevel: 5,
    pointCost: 20,
    effects: {
      [BUFFS.SKILLS.SPELUNKING]: 0.5,
      [BUFFS.SKILLS.FARMING]: -0.5
    }
  },
  /**************************************/
  /*************** LEVEL 6 **************/
  /**************************************/
  {
    icon: `/${ICONS_PATH}/perks/scifi_skill_r_27.png`,
    name: `Original Thinker`,
    requiredLevel: 6,
    pointCost: 20,
    description: "5% chance to retain items on research",
    effects: {
      [BUFFS.STATS.INTELLIGENCE]: -5
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_46.png`,
    name: `Hermit`,
    requiredLevel: 6,
    pointCost: 20,
    description: "Reduces the effect of cheers on you by 75%",
    effects: {
      [BUFFS.MOOD]: 5
    }
  },
  {
    icon: `/${ICONS_PATH}/perks/sgi_addons_172.png`,
    name: `Metalsmith`,
    requiredLevel: 6,
    pointCost: 20,
    effects: {
      [BUFFS.SKILLS.SMITHING]: 0.5,
      [BUFFS.SKILLS.SMELTING]: 0.5,
      [BUFFS.SKILLS.CRAFTING]: -1
    }
  }
];

const getPerkCode = name => {
  return name.replace(/[^A-Za-z]/g, "");
};

PERKS_PROPERTIES.forEach(perk => {
  const perkClass = utils.newClassExtending(
    `BuffPerk_${getPerkCode(perk.name)}`,
    Buff
  );
  perk.perkCode = getPerkCode(perk.name);
  Object.assign(perkClass.prototype, {
    name: perk.name,
    icon: perk.icon,
    category: Buff.CATEGORIES.PERK,
    effects: perk.effects,
    description: perk.description
  });
});

const PerkSystem = {
  getAvailablePerks(player) {
    player.perks = player.perks || {};
    const soulLevel = player.getSoulLevel();
    return Object.values(PERKS_PROPERTIES)
      .map(perkDef => {
        const perkCode = perkDef.perkCode;
        const level = (player.perks[perkCode] || 0) + 1;
        if (perkDef.requiredLevel > soulLevel) {
          return false;
        }
        return {
          perkCode,
          ...PerkSystem.getPerkPayload(perkDef, level, player)
        };
      })
      .filter(perk => !!perk);
  },

  getPerkByCode(perkCode) {
    return PERKS_PROPERTIES.find(p => p.perkCode === perkCode);
  },

  isValidPerkCode(perkCode) {
    return !!PerkSystem.getPerkByCode(perkCode);
  },

  hasPerk(creature, perkCode) {
    return false;
  },

  gainPerk(creature, perk) {
    creature.addBuff(global[`BuffPerk_${perk}`]);
  },

  getPerkBonus() {
    // TODO: obsolete
    return 0;
  },

  getPerkPayload(perkDef, level, player) {
    let name = perkDef.name;
    if (level > 1) {
      name += ` ${utils.romanLiterals(level)}`;
    }
    return {
      name,
      level,
      perkCode: perkDef.perkCode,
      pointCost: perkDef.pointCost,
      icon: server.getHttpResourceForPlayer(player, perkDef.icon),
      description: perkDef.description,
      effects: Object.keys(perkDef.effects)
        .map(stat => ({
          stat: BUFF_LABELS[stat] || stat,
          value: perkDef.effects[stat],
          percentage: PERCENTAGE_BUFFS[stat],
          multiplier: MULTIPLIER_BUFFS[stat],
          discrete: DISCRETE_BUFFS[stat]
        }))
        .toObject(i => i.stat)
    };
  }
};

module.exports = global.PerkSystem = PerkSystem;

server.registerHandler("getSoulInfo", (params, player) => {
  if (player.getCreature() && !player.getCreature().isDead()) {
    return {};
  }
  return {
    perks: PerkSystem.getAvailablePerks(player),
    soulLevel: player.getSoulLevel(),
    soulPoints: player.getPerkPoints(),
    races: player.getRaces()
  };
});

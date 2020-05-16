const Item = require("../.item");
const Action = require("../../action");

// tiers
// 0 - emergency, negative debuffs
// 1 - some useful stat, mood 0-3
// 2 - useful stats, mood 5-8
// 3 - very useful stats, mood 12-16
// 4 - the best food available, mood 20-25

const contains = material => materials => materials[material];
const notContains = material => materials => !materials[material];
const containsMore = (material, material2) => materials =>
  (materials[material] || 0) > (materials[material2] || 0);
const containsMeat = utils.or(
  contains("FowlMeat"),
  contains("HeartyMeat"),
  contains("PungentMeat"),
  contains("TenderMeat"),
  contains("ToughMeat")
);
const containsFish = utils.or(
  contains("Trout"),
  contains("Bass"),
  contains("Herring"),
  contains("Salmon"),
  contains("Blindfish"),
  contains("FireSquid")
);
const isDish = materials => Object.keys(materials).length > 1;

const ingredientsEffects = [
  {
    condition: utils.and(contains("Flour"), notContains("ChickenEgg")),
    effects: {
      [BUFFS.SKILLS.MINING]: 0.4
    }
  },
  {
    condition: utils.and(
      utils.not(containsMeat),
      utils.not(containsFish),
      isDish
    ),
    effects: {
      [BUFFS.STATS_GAINS.STRENGTH]: 1,
      [BUFFS.STATS_GAINS.DEXTERITY]: 1,
      [BUFFS.STATS_GAINS.PERCEPTION]: 1,
      [BUFFS.STATS_GAINS.ENDURANCE]: 1,
      [BUFFS.STATS_GAINS.INTELLIGENCE]: 1
    }
  },
  {
    condition: utils.and(contains("ChickenEgg"), notContains("Flour")),
    effects: {
      [BUFFS.SKILLS.FISHING]: 0.4
    }
  },
  {
    condition: contains("FowlMeat"),
    effects: {
      [BUFFS.STATS_GAINS.STRENGTH]: +2,
      [BUFFS.STATS_GAINS.PERCEPTION]: +1
    }
  },
  {
    condition: contains("HeartyMeat"),
    effects: {
      [BUFFS.STATS_GAINS.ENDURANCE]: +2,
      [BUFFS.STATS_GAINS.DEXTERITY]: +1
    }
  },
  {
    condition: contains("PungentMeat"),
    effects: {
      [BUFFS.STATS_GAINS.DEXTERITY]: +2,
      [BUFFS.STATS_GAINS.ENDURANCE]: +1
    }
  },
  {
    condition: contains("TenderMeat"),
    effects: {
      [BUFFS.STATS_GAINS.DEXTERITY]: +2,
      [BUFFS.STATS_GAINS.INTELLIGENCE]: +1
    }
  },
  {
    condition: contains("ToughMeat"),
    effects: {
      [BUFFS.STATS_GAINS.STRENGTH]: +2,
      [BUFFS.STATS_GAINS.ENDURANCE]: +1
    }
  },
  {
    condition: contains("Trout"),
    effects: {
      [BUFFS.STATS_GAINS.INTELLIGENCE]: +2,
      [BUFFS.STATS_GAINS.ENDURANCE]: +1
    }
  },
  {
    condition: contains("Salmon"),
    effects: {
      [BUFFS.STATS_GAINS.INTELLIGENCE]: +2,
      [BUFFS.STATS_GAINS.PERCEPTION]: +1
    }
  },
  {
    condition: contains("Herring"),
    effects: {
      [BUFFS.STATS_GAINS.PERCEPTION]: +2,
      [BUFFS.STATS_GAINS.DEXTERITY]: +1
    }
  },
  {
    condition: contains("Blindfish"),
    effects: {
      [BUFFS.STATS_GAINS.PERCEPTION]: +2,
      [BUFFS.STATS_GAINS.ENDURANCE]: +1,
      [BUFFS.SKILLS.SPELUNKING]: +0.5
    }
  },
  {
    condition: contains("Bass"),
    effects: {
      [BUFFS.STATS_GAINS.INTELLIGENCE]: +2,
      [BUFFS.STATS_GAINS.DEXTERITY]: +1,
      [BUFFS.STATS_GAINS.ENDURANCE]: +0.5
    }
  },
  {
    condition: contains("FireSquid"),
    effects: {
      [BUFFS.STATS_GAINS.PERCEPTION]: +2,
      [BUFFS.STATS_GAINS.STRENGTH]: +1,
      [BUFFS.STATS_GAINS.ENDURANCE]: +0.5
    }
  },
  {
    condition: utils.and(contains("ToughMeat"), contains("Bitterweed")),
    effects: {
      [BUFFS.SKILLS.SMITHING]: 0.4,
      [BUFFS.SKILLS.SMELTING]: 0.4
    }
  },
  {
    condition: contains("Lemon"),
    effects: {
      [BUFFS.SKILLS.DOCTORING]: 0.4
    }
  },
  {
    condition: contains("Bladewort"),
    effects: {
      [BUFFS.SKILLS.ALCHEMY]: 0.4
    }
  },
  {
    condition: contains("Mushroom"),
    effects: {
      [BUFFS.SKILLS.COOKING]: 0.4
    }
  },
  {
    condition: contains("MuckEgg"),
    effects: {
      [BUFFS.SKILLS.SPELUNKING]: 0.4
    }
  },
  {
    condition: utils.or(contains("Coconut"), contains("CoconutOpen")),
    effects: {
      [BUFFS.SKILLS.CARPENTRY]: 0.4
    }
  },
  {
    condition: contains("Onion"),
    effects: {
      [BUFFS.SKILLS.HUNTING]: 0.4
    }
  },
  {
    condition: utils.and(contains("Onion"), containsMeat),
    effects: {
      [BUFFS.SKILLS.PATHFINDING]: 0.4
    }
  },
  {
    condition: contains("Carrot"),
    effects: {
      [BUFFS.SKILLS.LEATHERWORKING]: 0.4
    }
  },
  {
    condition: utils.and(contains("Carrot"), containsMeat),
    effects: {
      [BUFFS.SKILLS.TAILORING]: 0.4
    }
  },
  {
    condition: contains("Wildberry"),
    effects: {
      [BUFFS.SKILLS.FORAGING]: 0.4
    }
  },
  {
    condition: utils.and(contains("Wildberry"), contains("Flour")),
    effects: {
      [BUFFS.SKILLS.CRAFTING]: 0.4
    }
  },
  {
    condition: contains("Apple"),
    effects: {
      [BUFFS.SKILLS.WOODCUTTING]: 0.4
    }
  },
  {
    condition: utils.and(contains("Apple"), contains("Flour")),
    effects: {
      [BUFFS.SKILLS.FARMING]: 0.4
    }
  },
  {
    condition: contains("Dragonfruit"),
    effects: {
      [SKILL_NAMES[SKILLS.FIGHTING_UNARMED]]: 0.4
    }
  },
  {
    condition: utils.and(contains("Dragonfruit"), contains("Wildberry")),
    effects: {
      [SKILL_NAMES[SKILLS.FIGHTING_KNIFE]]: 0.4
    }
  },
  {
    condition: utils.and(contains("Dragonfruit"), contains("Apple")),
    effects: {
      [SKILL_NAMES[SKILLS.FIGHTING_MACE]]: 0.4
    }
  },
  {
    condition: utils.and(contains("Dragonfruit"), contains("Trout")), // TODO
    effects: {
      [SKILL_NAMES[SKILLS.FIGHTING_SWORD]]: 0.4
      // [SKILL_NAMES[SKILLS.FIGHTING_KNIFE]]: 0.4,
      // [SKILL_NAMES[SKILLS.FIGHTING_AXE]]: 0.4,
      // [SKILL_NAMES[SKILLS.FIGHTING_HAMMER]]: 0.4,
      // [SKILL_NAMES[SKILLS.FIGHTING_POLEARM]]: 0.4,
    }
  }
];

const actions = Action.groupById([
  new Action({
    name: "Eat",
    icon: "/actions/icons8-restaurant-100.png",
    notification: false,
    quickAction: true,
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    runCheck(item, creature) {
      if (creature.satiated + item.nutrition > 100) {
        return "You are too full to eat this";
      }
      return true;
    },
    run(item, creature, seconds) {
      creature.actionProgress += (seconds * 100) / item.timeToEat;

      if (creature.actionProgress >= 100) {
        creature.satiated += item.nutrition;
        creature.satiated = Math.min(creature.satiated, 100);
        if (item.onEat) {
          item.onEat(creature);
        }
        creature.applyFoodBuff(item);
        const removed = item.useUpItem();
        if (removed) {
          creature.actionOnSimilarItem(item);
        }
        creature.actionProgress -= 100;
        return false;
      }
      return true;
    }
  })
]);

class Edible extends ExpirableItem {
  static actions() {
    return { ...actions, ...Item.actions() };
  }

  static getProps(creature, base, object) {
    return {
      ...object,
      properties: {
        ...object.properties,
        nutrition: base.nutrition + "%"
      }
    };
  }

  getPayload(creature) {
    const result = super.getPayload(creature);
    return Edible.getProps(creature, this, result);
  }

  static getPayload(creature) {
    const result = super.getPayload(creature);
    return Edible.getProps(creature, this.prototype, result);
  }

  static makeCookedVersion(classFn, level = 0) {
    const itemClass = utils.newClassExtending(`Cooked${classFn.name}`, classFn);
    const buffs = {
      ...classFn.prototype.buffs
    };
    delete buffs[BUFFS.MOOD];
    Edible.itemFactory(itemClass, {
      dynamicName: () => `Cooked ${Nameable.getName(classFn.name)}`,
      nameable: classFn.name,
      icon: classFn.prototype.icon.replace(".png", "_cooked.png"),
      weight: classFn.prototype.weight,
      timeToEat: classFn.prototype.timeToEat,
      nutrition: classFn.prototype.nutrition,
      expiresIn: 15 * DAYS,
      buffs: {
        ...buffs
      },
      research: {
        materials: {
          [classFn.name]: 1
        }
      },
      crafting: {
        materials: {
          [classFn.name]: 1
        },
        skill: SKILLS.COOKING,
        building: ["Fireplace"],
        skillLevel: level,
        baseTime: 10 * MINUTES
      }
    });

    return itemClass;
  }

  static getCalculatedEffects(baseEffects, materials, tier) {
    const matches = ingredientsEffects.filter(ie =>
      ie.condition(materials, tier)
    );
    const result = { ...baseEffects };
    if (tier > 1) {
      result[BUFFS.MOOD] = (result[BUFFS.MOOD] || 0) + 8 * (tier - 1);
    }
    matches.forEach(ie => {
      Object.keys(ie.effects).forEach(stat => {
        result[stat] =
          Math.round(100 * ((result[stat] || 0) + ie.effects[stat] * tier)) /
          100;
      });
    });
    return result;
  }

  static itemFactory(classCtr, props) {
    if (props.calculateEffects) {
      props.buffs = props.buffs || {};
      const materials =
        props.crafting && props.crafting.materials
          ? props.crafting.materials
          : { [classCtr.name]: 1 };
      props.buffs = Edible.getCalculatedEffects(
        props.buffs,
        materials,
        props.calculateEffects
      );
    }
    return super.itemFactory(classCtr, props);
  }
}
Object.assign(Edible.prototype, {
  name: "?Edible?",
  order: ITEMS_ORDER.FOOD,
  expiresIn: 5 * DAYS,
  weight: 0.5
});
module.exports = global.Edible = Edible;

// Good images:
// dish_01.png - meal (peppers/wildberries, rice/potatoes?)
// dish_02.png - pancakes
// dish_03_b.png - bowl
// soup.png - stew/soup
// lp_01.png - some kind of cakes? potato cakes?
// sandwich.png - sandwich

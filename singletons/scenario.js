const BasicSpark = require("../class/sparks/basic");
require("../class/items/texts/tablet-writing");
require("./scenario/dates");

global.Dungeon1 = require("./world-builder/dungeons/dungeon1");
global.Dungeon1_1 = require("./world-builder/dungeons/dungeon1_1");
global.Dungeon2 = require("./world-builder/dungeons/dungeon2");
global.Dungeon3 = require("./world-builder/dungeons/dungeon3");
global.Dungeon4 = require("./world-builder/dungeons/dungeon4");
global.Dungeon5 = require("./world-builder/dungeons/dungeon5");
global.DungeonTrials = require("./world-builder/dungeons/dungeon-trials");

const {
  HUMAN_NAMES,
  DWARVEN_NAMES,
  ORCISH_NAMES,
  ELVEN_NAMES
} = require("./$names.js");

const NAMES = {
  Human: HUMAN_NAMES,
  Dwarf: DWARVEN_NAMES,
  Orc: ORCISH_NAMES,
  Elf: ELVEN_NAMES
};

const MENHIRS = {
  HUMAN: 14200,
  ORC: 14327,
  DWARF: 14338,
  ELF: 14332
};

const TABLET_NAMES = {
  [MENHIRS.HUMAN]: "Fancy",
  [MENHIRS.ORC]: "Scribbled",
  [MENHIRS.DWARF]: "Etched",
  [MENHIRS.ELF]: "Elegant"
};

const maintainedRegions = {
  Elf: [15628, 14479, 14564, 14743],
  // Orc: [15412, 15353, 15415, 15399],
  Dwarf: [14417, 14232, 14439]
};

Object.values(MENHIRS).forEach(id =>
  TabletWriting.registerBuildingWithInscription(
    id,
    `${TABLET_NAMES[id]} Inscription`
  )
);

let allMonsters;

const getNonOrcs = node =>
  node
    .getVisibleAliveCreatures()
    .filter(c => c.getFaction().getName() === "Human");

const scenario = new (class Scenario {
  cycle(seconds) {
    utils.atInterval(24 * HOURS, () => this.managePopulation(), seconds);
    utils.atInterval(
      1 * HOURS,
      () => this.guaranteeTutorialResources(),
      seconds
    );
    utils.atInterval(35 * HOURS, () => this.spawnMonsters(), seconds);
    utils.atInterval(24 * HOURS, () => this.despawnMonsters(), seconds);
    utils.atInterval(world.nextDenIn || 0, () => this.spawnDens(), seconds);

    // if (TimeCheck.onTheHour(seconds)) {
    //   this.churInterval();
    // }
    // if (TimeCheck.isDay("Saturday") && TimeCheck.atHour(16, seconds)) {
    //   this.churRaid();
    // }
  }

  formatAerianDate(era, chapter, cycle) {
    return scenario.getAerianDate(
      scenario.aerianDateToEarth(era, chapter, cycle)
    ).text;
  }

  getAerianDate(date) {
    date = date || new Date();
    const days = (date.getTime() - dayZero.getTime()) / (DAYS * IN_MILISECONDS);
    const era = Math.floor(days / 1500) + 1;
    const chapter = Math.floor((days % 1500) / 60) + 1;
    const cycle = Math.floor(days % 60) + 1;
    return {
      era,
      chapter,
      cycle,
      text: `Cycle ${cycle}, ${utils.numberOrder(chapter)} Chapter, ${
        eras[era]
      }`
    };
  }

  aerianDateToEarth(era, chapter, cycle) {
    const date = new Date(dayZero);
    const days = cycle - 1 + (chapter - 1) * 60 + (era - 1) * 1500;
    date.setDate(date.getDate() + days);
    return date;
  }

  checkForEnemyFailures() {
    Entity.getEntities(Creature).forEach(c => {
      const state = { ...c.hasEnemiesState };
      if (Object.keys(state).length <= 0) {
        return;
      }
      c.checkForEnemies();
      if (
        c.hasEnemiesState[ENEMY_STATE_TYPES.FIGHTING] !==
          state[ENEMY_STATE_TYPES.FIGHTING] ||
        c.hasEnemiesState[ENEMY_STATE_TYPES.ANY] !==
          state[ENEMY_STATE_TYPES.ANY]
      ) {
        utils.error(
          "Found invalid hasEnemiesState",
          c.getName(),
          c.getEntityId(),
          state,
          c.hasEnemiesState
        );
      }
    });
  }

  churGatherFighters(node, neededNumber, range) {
    let fighters = [];
    node.findNearest(
      node => {
        const orcs = node
          .getVisibleAliveCreatures()
          .filter(c => c instanceof Orc);
        const potentialFighters = orcs
          .filter(c => c.energy >= 70)
          .filter(c => !c.isPlayableCharacter())
          .filter(c => c.getEquipment(EQUIPMENT_SLOTS.WEAPON))
          .filter(c => c.spark)
          .filter(
            c =>
              c.spark.getEquipmentValue(
                c.getEquipment(EQUIPMENT_SLOTS.WEAPON),
                EQUIPMENT_SLOTS.WEAPON
              ) > 10
          )
          .slice(0, neededNumber - fighters.length);
        fighters = [...fighters, ...potentialFighters];
        return fighters.length >= neededNumber;
      },
      node => {
        return !(
          node.isWater() ||
          node.isType(NODE_TYPES.MOUNTAINS_COLD) ||
          node.isType(NODE_TYPES.MOUNTAINS_DIRT) ||
          node.isType(NODE_TYPES.MOUNTAINS_SNOW) ||
          getNonOrcs(node).length >= 1
        );
      },
      range
    );
    return fighters;
  }

  churInterval() {
    return;
    const orcs = Entity.getEntities(Orc).filter(o => !o.isDead());

    if (orcs.length < 15) {
      utils.log("CHUR: too few orcs");
      return;
    }

    const nonOrcLocations = [];

    maintainedRegions.Orc.forEach(regionId => {
      Entity.getById(regionId)
        .getNodes()
        .forEach(node => {
          const hasPalisade = node
            .getCompleteStructures()
            .some(b => b instanceof Palisade);
          if (hasPalisade) {
            return;
          }
          const countNonOrcs = getNonOrcs(node).filter(
            c => c instanceof Humanoid
          ).length;
          if (countNonOrcs >= 1) {
            nonOrcLocations.push({
              howMany: Infinity,
              where: node
            });
          }
        });
    });

    if (!nonOrcLocations.length) {
      utils.log("CHUR: no hostile scouts in the lands");
      return;
    }
    nonOrcLocations.sort((a, b) => {
      return a.howMany - b.howMany;
    });
    nonOrcLocations.forEach(nonOrcLocation => {
      utils.log(
        `CHUR: assault candidates ${nonOrcLocation.where
          .getVisibleAliveCreatures()
          .map(c => c.name)}`
      );
    });

    const neededNumber = utils.random(3, 6);

    nonOrcLocations.some(nonOrcLocation => {
      utils.log(
        `CHUR: attempting assault ${nonOrcLocation.where
          .getVisibleAliveCreatures()
          .map(c => c.name)}`
      );

      const fighters = scenario.churGatherFighters(
        nonOrcLocation.where,
        neededNumber,
        8
      );

      utils.log(`CHUR: fighters found: ${fighters.map(c => c.name)}`);

      if (fighters.length < neededNumber) {
        utils.log(`CHUR: not enough fighters`);
        return false;
      }

      utils.log(`CHUR: assault them!`);
      fighters.forEach(fighter => {
        const to = nonOrcLocation.where;
        fighter.startAction(to, to.getActionById("Travel"));
      });

      return true;
    });
  }

  churRaid() {
    const orcs = Entity.getEntities(Orc).filter(o => !o.isDead());

    if (orcs.length < 50) {
      utils.log("CHUR RAID: too few orcs");
      return;
    }

    const home = Entity.getById(MENHIRS.ORC).getNode();

    const raidTarget = home.findNearest(
      node => {
        const hasPalisade = node
          .getCompleteStructures()
          .some(b => b instanceof Palisade);
        if (!hasPalisade && !node.townName) {
          return;
        }

        const countNonOrcs = getNonOrcs(node).filter(c => c instanceof Humanoid)
          .length;

        if (countNonOrcs < 3) {
          return;
        }

        return true;
      },
      () => true,
      30
    );

    if (!raidTarget) {
      utils.log("CHUR RAID: no valid targets");
      return;
    }
    utils.log(
      `CHUR RAID: assault ${raidTarget
        .getVisibleAliveCreatures()
        .map(c => c.name)}`
    );

    const neededNumber = utils.random(30, 50);

    const fighters = scenario.churGatherFighters(raidTarget, neededNumber, 30);

    utils.log(
      `CHUR RAID: fighters found: (${fighters.length}) ${fighters.map(
        c => c.name
      )}`
    );

    if (fighters.length < neededNumber) {
      utils.log(`CHUR RAID: not enough fighters`);
      return false;
    }

    utils.log(`CHUR RAID: assault them!`);
    fighters.forEach(fighter => {
      fighter.startAction(raidTarget, raidTarget.getActionById("Travel"));

      if (program.dev) {
        setInterval(() => {
          fighter.actionProgress += 25;
        }, 1000);
      }
    });
  }

  getTutorialRegion() {
    return Entity.getById(14221);
  }

  getStartingRegions() {
    return [
      14387,
      14407,
      14408, // humans
      15631,
      15353, // orcs
      14439,
      14426, // dwarves
      15628,
      14479 // elves
    ].map(id => Entity.getById(id));
  }

  progressMonsterAging(monster) {
    monster.age = monster.age || 0;
    monster.age += 1;

    if (
      monster.maxAge &&
      monster.age > monster.maxAge &&
      !monster.hasEnemies() &&
      !(monster.getNode() instanceof Room) &&
      !monster.tamed
    ) {
      utils.log(`Removing a monster ${monster.name}`);
      monster.annihilate();
    }
  }

  despawnMonsters() {
    Entity.getEntities(Region).forEach(region => {
      region.getNodes().forEach(node => {
        node
          .getCreatures()
          .filter(c => c instanceof Monster)
          .forEach(m => scenario.progressMonsterAging(m));
      });
    });
  }

  spawnMonsters() {
    Entity.getEntities(Region).forEach(region => {
      const newSpawnsCount = Math.ceil(region.getNodes().length / 12);
      for (let i = 0; i < newSpawnsCount; i += 1) {
        scenario.spawnMonsterInRegion(region);
      }
    });
  }

  spawnDens() {
    world.nextDenIn = utils.random(8 * DAYS, 12 * DAYS);
    Entity.getEntities(Region).forEach(region => {
      region.modifyThreatLevel(+1);
      if (utils.chance(region.threatLevel)) {
        MonsterDen.spawnNewDenInRegion(region);
      }
    });
  }

  spawnMonsterInRegion(region) {
    if (+region.id === 14221) {
      return;
    }
    if (!allMonsters) {
      allMonsters = utils
        .getClasses(Monster)
        .filter(m => m.placement)
        .filter(m => m.getThreatLevel())
        .filter(m => m.getThreatLevel() <= 10);
    }
    const validMonsters = utils.randomizeArray(allMonsters);

    if (!validMonsters.length) {
      return false;
    }

    const validNodes = utils.randomizeArray(
      region.getNodes().filter(n => this.canSpawnMonster(n))
    );
    if (!validNodes.length) {
      utils.log(`No valid nodes for region ${region.id}`);
      return false;
    }

    let thereWasAChance = false;
    let spawned;
    validMonsters.find(monsterPrototype => {
      const monsterClass = monsterPrototype.constructor;

      const node = validNodes.find(n => {
        const chance = monsterClass.getPlacementChance(n);
        if (
          n
            .getCompleteStructures()
            .some(s => s.scaresMonsters && monsterClass === s.scaresMonsters)
        ) {
          return false;
        }
        if (chance > 0) {
          thereWasAChance = true;
        }
        return utils.chance(chance);
      });

      if (!node) {
        return false;
      }

      spawned = new monsterClass();
      utils.log(
        `Spawning ${monsterClass.name} (${spawned.id}) in node ${
          node.id
        } (region ${
          region.id
        }). Last seen by player ${node.seenRecentlyByPlayer()}`
      );
      node.addCreature(spawned);

      return true;
    });

    if (!spawned) {
      utils.log(
        `Failed to spawn monsters in region ${region.id} ${
          thereWasAChance ? "" : "(There was no chance)"
        }`
      );
      return false;
    }
    return spawned;
  }

  canSpawnMonster(node) {
    if (node.getCreatures().length > 0) {
      return false;
    }
    if (
      node
        .getConnectedNodes()
        .some(n =>
          n
            .getCreatures()
            .some(c => c instanceof Humanoid && !(c instanceof Admin))
        )
    ) {
      return false;
    }
    return true;
    // return !node.seenRecentlyByPlayer();
  }

  guaranteeTutorialResources() {
    const rookIsland = Entity.getById(14221);
    const nodes = rookIsland
      .getNodes()
      .filter(n => n.isType(NODE_TYPES.BROADLEAF_FOREST));

    this.guaranteeResources(nodes, Rabbits, 5);
    this.guaranteeResources(nodes, Apples, 25);
    this.guaranteeResources(nodes, Wildberries, 25);
  }

  guaranteeResources(nodes, resource, min) {
    const existing = nodes.reduce((acc, n) => {
      n.getResources().forEach(r => {
        if (r instanceof resource) {
          acc.push(r);
        }
      });
      return acc;
    }, []);

    if (existing.length[0]) {
      utils.randomItem(existing).showUpInSeconds = 0;
    }

    const visibleCount = existing.reduce((acc, r) => {
      return acc + (r.showUpInSeconds <= 0 ? r.size : 0);
    }, 0);

    if (visibleCount < min && nodes.length) {
      const node = utils.randomItem(nodes);
      const stuff = new resource();
      stuff.showUpInSeconds = 0;
      utils.log("Adding starting area resources", resource.name);
      node.addResource(stuff);
    }
  }

  managePopulation(includeHumans = true) {
    if (includeHumans) {
      this.spawnPopulation(Human, 20, 1, false);
    }
    this.spawnPopulation(Dwarf, 30);
    this.spawnPopulation(Orc, 30, 3, false);
    this.spawnPopulation(Elf, 20);
    this.maintainRegions();
    // this.sparksGearSpread();
  }

  maintainRegions() {
    Object.keys(maintainedRegions).forEach(raceName => {
      maintainedRegions[raceName].forEach(regionId => {
        const region = Entity.getById(regionId);
        region.getNodes().forEach(n => {
          n.getCompleteStructures().forEach(s => {
            if (s instanceof Road) {
              n.traverseFrequency = 100;
              n.increaseTraverseFrequency();
            }

            const matsNeeded = Object.keys(s.remainingMaterialsNeeded || {});
            if (matsNeeded.length) {
              const creature = utils.randomItem(
                n
                  .getCreatures()
                  .filter(c => c instanceof Humanoid)
                  .filter(c => !c.isPlayableCharacter())
              );

              if (creature) {
                matsNeeded.forEach(mat => {
                  const qty = s.remainingMaterialsNeeded[mat];
                  if (!creature.hasMaterials({ [mat]: qty })) {
                    creature.addItemByType(global[mat], qty);
                  }
                });
              }
            }

            if (!n.seenRecentlyByPlayer()) {
              if (s instanceof Home && !s.owner) {
                const spark = scenario.spawnUsefulSpark(
                  global[raceName],
                  null,
                  n
                );
                s.owner = spark;
              }
            }
          });
        });
      });
    });
  }

  sparksGearSpread() {
    const itemValues = {};
    const getEquipmentValue = (creatureId, item, slot) => {
      const key = item.constructor.name + "_" + slot;
      if (!itemValues[key]) {
        itemValues[key] = BasicSpark.getEquipmentValue(item, slot);
      }
      return itemValues[key];
    };

    Entity.getEntities(BasicSpark).forEach(spark => {
      const creature = spark.creature;
      creature
        .getNode()
        .getCreatures()
        .filter(c => c.getFaction() === creature.getFaction())
        .filter(c => !(c instanceof Human))
        .filter(c => !(c instanceof Admin))
        .filter(c => c instanceof Orc)
        .forEach(other => {
          const eq = other.getAllEquipment();
          Object.keys(eq).forEach(slot => {
            const item = eq[slot];
            if (item) {
              let value = getEquipmentValue(creature.id, item, slot);
              const currentItem = creature.getEquipment(slot);
              let currentValue = currentItem
                ? getEquipmentValue(creature.id, currentItem, slot)
                : -Infinity;
              if (slot === EQUIPMENT_SLOTS.WEAPON) {
                value *= creature.getSkillLevel(item.weaponSkill, false);
                if (currentItem) {
                  currentValue *= creature.getSkillLevel(
                    currentItem.weaponSkill,
                    false
                  );
                }
              }
              if (currentValue < value && utils.chance(35)) {
                if (currentItem) {
                  currentItem.destroy();
                }
                const newItem = new item.constructor();
                creature.addItem(newItem);
                newItem.reduceIntegrity(utils.random(80, 95));
              }
            }
          });
        });
      spark.checkForEquipment();
    });
  }

  spawnPopulation(race, numbers, times = 1, useful = true) {
    const names = NAMES[race.name];
    const spawns = [];
    const takenNames = {};
    let count = Entity.getEntities(race)
      .map(c => {
        takenNames[c.name] = true;
        return c;
      })
      .filter(c => !c.isDead()).length;

    for (let i = 0; i < times; i++) {
      if (count < numbers) {
        let validNames = names.filter(n => !takenNames[n]);
        if (!validNames.length) {
          validNames = names;
        }

        const name = utils.randomItem(validNames);
        const h = new race({
          name,
          looks: {
            hairStyle: utils.random(1, 100),
            hairColor: utils.random(1, 100),
            skinColor: utils.random(1, 100)
          }
        });
        h.putInSpark(new BasicSpark());
        if (h.spawn()) {
          spawns.push(h);
          if (useful) {
            const foods = [Apple, CookedHeartyMeat, CookedTenderMeat, Carrot];
            h.addItemByType(utils.randomItem(foods), utils.random(15, 30));
          }

          takenNames[name] = true;
        } else {
          h.annihilate();
        }

        count += 1;
      }
    }
    return spawns;
  }

  markMenhirs() {
    const makeText = text =>
      `§${text}§ Underneath that is a series of complex symbols.`;
    Object.assign(Entity.getById(MENHIRS.HUMAN), {
      plotText: makeText(
        `The real trial awaits you. Find the four artifacts hidden away in the ancient places of origins. Grow, expand, exploit, the world is yours to take it. Use the power of my symbols to your advantage.`
      ),
      plotLanguage: LANGUAGES.HUMAN
    });
    Object.assign(Entity.getById(MENHIRS.ORC), {
      plotText: makeText(
        `The real trial awaits you. Find the four artifacts hidden away in the ancient places of origins. Grow, bolster, dominate, nothing in the world can stop you. Use the power of my symbols to your advantage.`
      ),
      plotLanguage: LANGUAGES.ORC
    });
    Object.assign(Entity.getById(MENHIRS.DWARF), {
      plotText: makeText(
        `The real trial awaits you. Find the four artifacts hidden away in the ancient places of origins. Grow, fortify, master, the world is unforgiving. Use the power of my symbols to your advantage.`
      ),
      plotLanguage: LANGUAGES.DWARF
    });
    Object.assign(Entity.getById(MENHIRS.ELF), {
      plotText: makeText(
        `The real trial awaits you. Find the four artifacts hidden away in the ancient places of origins. Grow, embrace, assimilte, the world is your home. Use the power of my symbols to your advantage.`
      ),
      plotLanguage: LANGUAGES.ELF
    });
    // node // race // menhir
    // 405 // human // 14200
    // 618 // orc // 14327
    // 492 // dwarf // 14338
    // 685 // elf // 14332
  }

  resetPlayerProgress(player) {
    player.onRookIsland = true;
    player.currentQuests = {};
    player.completedQuests = {};
    player.soulXP = 0;
    player.inspirations = {};
    player.knownItemsList = {};
    player.knownSlotsList = {};
    player.craftingRecipes = [];
    player.buildingPlans = [];
    player.getCreature().die("You died due to progress reset");
    player.startQuest(QUESTS.TUTORIAL_1);
  }

  spawnFarmer(race, node) {
    node = node || debug.getCreature("Aymar").getNode();
    return scenario.spawnUsefulSpark(race, "farmer", node);
  }

  spawnWarrior(race, node) {
    node = node || debug.getCreature("Aymar").getNode();
    return scenario.spawnUsefulSpark(race, "warrior", node);
  }

  spawnUsefulSpark(race, eqProfile, node) {
    const spawn = scenario.spawnPopulation(race, Infinity, 1, false).pop();
    scenario.makeSparkUseful(spawn, eqProfile);
    if (node) {
      spawn.move(node);
    }
    return spawn;
  }

  makeSparkUseful(spark, eqProfile) {
    const h = spark;

    Object.values(SKILLS).forEach(s => {
      h.setSkillLevel(s, utils.random(50, 300) / 100);
    });

    const foods = [Apple, CookedHeartyMeat, CookedTenderMeat, Carrot];
    h.addItemByType(utils.randomItem(foods), utils.random(15, 30));

    const ageLevels = Object.keys(h.agingTiers);
    const adolescenceMaxAge = +ageLevels[1];
    if (eqProfile) {
      for (let i = 0; i <= adolescenceMaxAge; i++) {
        h.progressAging();
      }
    }

    const pieces = utils.random(10, 10);
    let equipmentPool = [];
    let tools = [];
    switch (eqProfile) {
      case "warrior":
        tools = [utils.randomItem([CopperHammer, CopperKnife, CopperAxe])];
        equipmentPool = [
          [WolfHideVest, DeerHideVest],
          [WolfSnakeTrousers],
          [BearHideGloves],
          [DeerLeatherCap],
          [DeerHideBoots, CrocodileSkinBoots]
        ];
        break;
      case "farmer":
        tools = utils
          .randomizeArray([
            CopperHoe,
            CopperAxe,
            CopperKnife,
            CopperSpear,
            Heckle
          ])
          .slice(0, 3);
        equipmentPool = [
          [BarkShirt],
          [BarkTrousers],
          [LinenWheatHat],
          [DeerHideBoots]
        ];
        break;
    }
    const equipment = utils
      .randomizeArray(equipmentPool)
      .slice(0, pieces)
      .map(selection => utils.randomItem(selection));

    [...tools, ...equipment].forEach(i => {
      const instance = new i();
      h.addItem(instance);
      let itemSlot = Object.keys(i.prototype.slots).pop();
      if (itemSlot === "932") itemSlot = "12";
      h.equip(instance, itemSlot);
    });

    return h;
  }
})();

module.exports = global.scenario = scenario;

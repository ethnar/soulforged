const releaseNotes = `
**The expansions is here!**
* Multitude of new recipes and buildings were added to the game.
* Characters will now be learning about item's existence in more ways than just holding it in their hands. This includes seeing item on the ground or in trade listings.
* Update temperature calculation! You can expect some shifts in the temperatures across the world, but they will now be more consistent tile-to-tile.
* Building & crafting materials for many structures & recipes have been slightly altered. Please note - some existing recipes may now require intermediate materials that are yet to be discovered. Apologize for the inconvenience this may cause.
* Building repairs are now much, much faster and never require a tool.
* Travel difficulty no longer affects the base travel time, only injury chance and severity.
* Accident injuries now scale with task time (longer tasks will result in more severe injury).
* Storage can no longer be overloaded when storing the last item.
* Some consumables will now be affected by diminished returns. What this means is that consuming multiples of the same type of consumable will provide smaller increase with each dose taken. In turn, most of them will no longer reduce energy when consumed.
* Creatures may now appear more unexpectedly. Their aggressive behaviour has been modified. They will also now be a little more flexible as to which places they may go to.
* Significantly increased tracking experience gains as well as updated current character tracking level accordingly.
* Several buildings had their allowed location types expanded.

Please note that while I'd really love to include so much more and I had more things planned for the expansion, I decided against continued separate expansion track and I feel that the changes included here make for a solid, good addition to the game.
`;

const underwaterLakes = [
  14874,
  14918,
  14936,
  14948,
  15221,
  15350,
  15544,
  15955,
  16091,
  16280,
  16294,
  16333,
  16377,
  16387,
  16534,
  16787,
  16838,
  16876,
  16877,
  16956,
  17028,
  17318,
  17330,
  17353,
  17393,
  17418,
  17780,
  17783,
  17809,
  17889,
  17898,
  18134,
  18148,
  18289,
  18310,
  18425,
  18743,
  18957,
  18960,
  18998,
  19013,
  19210,
  19438,
  19643,
  19763,
  17177,
  19852,
  19905,
  19921,
  19990,
  20017,
  20064,
  20076,
  20108,
  20234,
  20278,
  20323,
  20353,
  20354,
  20391,
  20490,
  20564,
  20593,
  20768,
  20832,
  20840,
  20842,
  20967,
  20974,
  20994,
  21033,
  21088
];
const volcanoes = [16247, 17046, 17680, 18045, 18123, 19077, 21052];

const WATER = 4;

module.exports = {
  apply(world) {
    return; // disabled
    world.expansionOne = world.expansionOne || {};
    const updates = [
      "updateWaterLocations",
      "updateVolcanoes",
      "addStoneCircle",
      "addBoneyards",
      "spawningUpdate",
      "updateKillQuests",
      "updateTrackingExperience",
      "updateCombatSkills"
    ];
    updates.forEach(update => {
      if (!world.expansionOne[update]) {
        utils.log(`Applying expansion update:`, update);
        world.expansionOne[update] = true;
        this[update](world);
      }
    });
  },

  updateWaterLocations(world) {
    const processQueue = {};
    world.getNodes().forEach(node => {
      if (node.isType(WATER)) {
        processQueue[node.id] = {
          distanceToLand: Infinity,
          bodyWater: {
            [node.id]: true
          }
        };
      }
    });

    let keepWorking = true;
    while (keepWorking) {
      keepWorking = false;
      Object.keys(processQueue).forEach(nodeId => {
        const info = processQueue[nodeId];
        const node = Entity.getById(nodeId);
        const connected = node.getConnectedNodes();

        connected.forEach(connectedNode => {
          const connectedInfo = processQueue[connectedNode.id];
          const isWater = connectedNode.isType(WATER);

          if (isWater && info.bodyWater !== connectedInfo.bodyWater) {
            const newWaterBody = {
              ...info.bodyWater,
              ...connectedInfo.bodyWater
            };
            Object.keys(newWaterBody).forEach(k => {
              processQueue[k].bodyWater = newWaterBody;
            });
          }

          const distanceToLand = isWater ? connectedInfo.distanceToLand : 0;
          if (distanceToLand + 1 < info.distanceToLand) {
            info.distanceToLand = distanceToLand + 1;
            keepWorking = true;
          }
        });
      });
    }

    Object.keys(processQueue).forEach(nodeId => {
      const info = processQueue[nodeId];
      const node = Entity.getById(nodeId);

      const isLake = Object.keys(info.bodyWater).length <= 3;
      const isOcean = info.distanceToLand > 2;
      if (isLake) {
        node.setType(NODE_TYPES.LAKE);
      } else {
        if (isOcean) {
          node.setType(NODE_TYPES.OCEAN);
        } else {
          node.setType(NODE_TYPES.COAST);
        }
      }
    });

    world.getNodes().forEach(node => {
      if (node.isType(WATER)) {
        throw new Error("SOME WATER LEFT!");
      }
    });

    Player.list.forEach(p => {
      Object.values(p.mapData || {}).forEach(i => {
        if (i.cache.type === WATER) {
          i.cache.type = NODE_TYPES.COAST;
        }
      });
    });

    underwaterLakes.forEach(nId => {
      const node = Entity.getById(nId);

      const hasHumanoids = node
        .getCreatures()
        .filter(c => c instanceof Humanoid).length;

      if (!hasHumanoids) {
        node.getCreatures().forEach(c => c.annihilate());
        [...node.getAllStructures()].forEach(s => {
          console.log("DESTROYED ", s.name, nId);
          s.destroy();
        });
        [...node.getResources()].forEach(s => s.destroy());
        [...node.getResources()].forEach(s => s.destroy());
        [...node.getResources()].forEach(s => s.destroy());
        [...node.getItems()].forEach(s => s.destroy());
        node.setType(NODE_TYPES.UNDERGROUND_LAKE);
      } else {
        utils.error("Unable to transform tile to lake!", nId);
      }
    });
  },

  updateVolcanoes() {
    volcanoes.forEach(nId => {
      const node = Entity.getById(nId);

      [...node.getResources()].forEach(s => s.destroy());
      [...node.getResources()].forEach(s => s.destroy());
      [...node.getResources()].forEach(s => s.destroy());
      node.setType(NODE_TYPES.UNDERGROUND_VOLCANO);
    });
  },

  addStoneCircle() {
    const circleLocation = Entity.getById(3473);
    circleLocation.setType(NODE_TYPES.DESERT_GRASS);
    circleLocation.addStructure(new StoneCircle());
    circleLocation.buildingsDisallowed = true;

    [3370, 1757].forEach(id =>
      Entity.getById(id).setType(NODE_TYPES.HILLS_DIRT)
    );

    [2565].forEach(id => Entity.getById(id).setType(NODE_TYPES.HILLS_REDGRASS));
  },

  addBoneyards() {
    const locations = [911, 255, 2922];

    locations.forEach(id => {
      const node = Entity.getById(id);
      node.addStructure(new Boneyard());
      node.addResource(new AncientBones());
    });
  },

  spawningUpdate() {
    Entity.getEntities(Region).forEach(r => {
      delete r.allowedMonsters;
      delete r.monsterPowerPerTile;
      r.regionThreat = 300;
    });
  },

  updateKillQuests() {
    Player.list.forEach(p => {
      const quest =
        p.currentQuests && p.currentQuests[QUESTS.TUTORIAL_MAINLAND_FIGHTING_2];
      if (quest) {
        ["ForestSpider", "Snake", "Wolf", "DuskCrow"].forEach(className => {
          quest[`kills${className}`] = Object.keys(
            quest.killCount[className]
          ).length;
        });
      }
    });
  },

  updateTrackingExperience() {
    Player.list
      .filter(p => p.creature && !p.creature.dead)
      .forEach(p => {
        p.creature.skills[SKILLS.TRACKING] =
          (p.creature.skills[SKILLS.TRACKING] || 0) * 2.5;
      });
  },

  updateCombatSkills() {
    Player.list
      .filter(p => p.creature && !p.creature.dead)
      .forEach(p => {
        [
          SKILLS.FIGHTING_UNARMED,
          SKILLS.FIGHTING_IMPROVISED,
          SKILLS.FIGHTING_SWORD,
          SKILLS.FIGHTING_KNIFE,
          SKILLS.FIGHTING_AXE,
          SKILLS.FIGHTING_HAMMER,
          SKILLS.FIGHTING_POLEARM,
          SKILLS.FIGHTING_MACE,
          SKILLS.FIGHTING_DODGE
        ].forEach(
          skill =>
            (p.creature.skills[skill] = (p.creature.skills[skill] || 0) / 8)
        );
      });
  }
};

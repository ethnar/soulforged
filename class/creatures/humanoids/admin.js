const Humanoid = require("./.humanoid");
const server = require("../../../singletons/server");
const util = require("util");

function changeRoomType(roomClass) {
  return new Action({
    name: `Change type: ${roomClass.constructor.name}`,
    icon: "/actions/icons8-treasure-map-100.png",
    quickAction: true,
    repeatable: false,
    notification: false,
    valid(entity, creature) {
      if (creature.adminMode !== "dungeon room") {
        return false;
      }
      if (!(creature instanceof Admin)) {
        return false;
      }
      if (!(creature.getNode() instanceof Room)) {
        return false;
      }
      return true;
    },
    run(entity, creature) {
      Reflect.setPrototypeOf(creature.getNode(), roomClass);
      return false;
    }
  });
}

const spawnableRaces = ["Human", "Dwarf", "Orc", "Elf"];
const spawnableRoles = {
  Warrior: scenario.spawnWarrior,
  Farmer: scenario.spawnFarmer
};
function spawnBetterSpark(raceName) {
  scenario.spawnUsefulSpark(global[raceName]);
}
const raceActions = raceName =>
  Object.keys(spawnableRoles).map(
    roleName =>
      new Action({
        name: `${raceName}: ${roleName}`,
        icon: "/actions/icons8-fraud-100.png",
        notification: false,
        repeatable: false,
        quickAction: true,
        valid(target, creature) {
          if (creature.adminMode !== raceName) {
            return false;
          }
          return true;
        },
        run(node, creature) {
          const sparkCreature = spawnableRoles[roleName](
            global[raceName],
            creature.getNode()
          );
          sparkCreature.spark.homeNode = creature.getNode();
        }
      })
  );
const adminMode = adminMode =>
  new Action({
    name: `Admin mode: ${adminMode}`,
    icon: "/actions/icons8-treasure-map-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(target, creature) {
      if (creature !== target) {
        return false;
      }
      if (creature.adminMode === adminMode) {
        return false;
      }
      return true;
    },
    run(node, creature) {
      creature.adminMode = adminMode;
    }
  });

const buildingsActions = [
  LeanTo,
  Tent,
  Cottage,
  Palisade,
  Kiln,
  Forge,
  Furnace,
  Mint,
  Loom,
  TanningRack,
  GravelRoad
].map(
  structureClass =>
    new Action({
      name: `Place: ${structureClass.getName()}`,
      icon: "/actions/icons8-home-100.png",
      notification: false,
      repeatable: false,
      quickAction: true,
      valid(target, creature) {
        if (creature !== target) {
          return false;
        }
        if (creature.adminMode !== "buildings") {
          return false;
        }
        return true;
      },
      run(node, creature) {
        const s = new structureClass();
        creature.getNode().addStructure(s);
        s.constructionFinished();
        s.remainingMaterialsNeeded = {};
      }
    })
);

const placeDirtRoad = new Action({
  name: `Place: Dirt road`,
  icon: "/actions/icons8-home-100.png",
  notification: false,
  repeatable: false,
  quickAction: true,
  valid(target, creature) {
    if (creature !== target) {
      return false;
    }
    if (creature.adminMode !== "buildings") {
      return false;
    }
    return true;
  },
  run(entity, creature) {
    const node = creature.getNode();
    node.traverseFrequency = 100;
    node.increaseTraverseFrequency();
  }
});

const actions = Action.groupById([
  adminMode("none"),
  adminMode("terraform"),
  adminMode("region"),
  adminMode("buildings"),
  adminMode("Human"),
  adminMode("Dwarf"),
  adminMode("Orc"),
  adminMode("Elf"),

  new Action({
    name: `Toggle Invisibility`,
    icon: "/actions/icons8-fraud-100.png",
    notification: false,
    repeatable: false,
    quickAction: true,
    valid(target, creature) {
      if (creature !== target) {
        return false;
      }
      return true;
    },
    run(node, creature) {
      creature.visible = !creature.visible;
    }
  }),

  ...spawnableRaces.reduce(
    (acc, raceName) => [...raceActions(raceName), ...acc],
    []
  ),

  ...buildingsActions,
  placeDirtRoad

  // spawnBetterSpark('warrior'),
  // spawnBetterSpark('farmer'),

  // adminMode('dungeon'),
  // adminMode('dungeon room'),
]);
// setTimeout(() => {
//     utils.getClasses(Room)
//         .map(c => changeRoomType(c))
//         .forEach(action => actions.push(action));
// });

class Admin extends Humanoid {
  static actions() {
    return { ...Humanoid.actions(), ...actions };
  }
  damageBrokenBone() {}
  damageBruised() {}
  damageInternal() {}
  damageCut() {}
  die() {}
  annihilate() {}
  isFullyRested() {
    return false;
  }
  getCreaturesMapPayload(onlyVisible = false, connection) {
    return super.getCreaturesMapPayload(true, connection);
  }

  getViewRange() {
    let range =
      Math.max(this.getStatValue(STATS.PERCEPTION), 25) / 25 +
      this.getBuff(BUFFS.VIEW_RANGE);
    if (program.dev && debugOption.bonusVisionRange) {
      range += debugOption.bonusVisionRange;
    }
    return range >= 0 ? range : 0;
  }

  canSeeCreatureDetails() {
    return 7;
  }

  connected(connection) {
    server.sendUpdate(
      "clientSideEvent",
      connection,
      (() => {
        window.admin = cb => {
          ServerService.request("adminConsole", {
            js: cb.toString()
          }).then(r => console.log(r));
        };
        console.log("Admin console enabled");
      }).toString()
    );
  }

  isNodeMapped() {
    return true;
  }

  isVisible() {
    return this.visible;
  }

  getCarryCapacity() {
    return Infinity;
  }

  getTravelSpeed() {
    return Infinity;
  }

  cycle(seconds) {
    this.satiated = 100;
    this.energy = 100;

    super.cycle(seconds);
  }

  getEfficiency(...args) {
    return 20 * super.getEfficiency(...args);
  }
}

Object.assign(Admin.prototype, {
  faction: Faction.getByName("Human"),
  maxAge: Infinity,
  agingTiers: {
    0: {
      [STATS.STRENGTH]: 100,
      [STATS.DEXTERITY]: 100,
      [STATS.ENDURANCE]: 100,
      [STATS.PERCEPTION]: 100,
      [STATS.INTELLIGENCE]: 100
    }
  },
  thermalRange: {
    min: -100,
    max: 100
  }
});

module.exports = global.Admin = Admin;

server.registerHandler("adminConsole", (params, player, connection) => {
  const creature = player.getCreature();

  if (!(creature instanceof Admin)) {
    return false;
  }

  let result;
  try {
    result = util.inspect(eval(`(${params.js})()`));
  } catch (e) {
    result = e.stack;
  }
  return result;
});

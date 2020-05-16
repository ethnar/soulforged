const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cluster = require("cluster");

global.httpServerFork = cluster.fork({ clusterMode: "http-server" });

require("../../singletons/static");
const utils = require("../../singletons/utils");
const TimeCheck = require("../../singletons/time-check");
const worldBuilder = require("../../singletons/world-builder");
const World = require("../../class/world");
const server = require("../../singletons/server");
const gameChat = require("../../singletons/game-chat-server");

server.runPreFlightChecks();

let worldPromise;
global.timing = {};

world = new World();
world.duels = {};

const battleground = new Node({
  type: NODE_TYPES.PLAINS
});

function createPc(race, items) {
  const c = new race({
    faction: Faction.getByName("Monster")
  });
  const adulthoodAge = +Object.keys(race.prototype.agingTiers)[1] + 1;

  for (let i = 0; i < adulthoodAge; i += 1) {
    c.progressAging();
  }

  items.forEach(i => {
    const instance = new i();
    c.addItem(instance);
    c.equip(instance, Object.keys(i.prototype.slots).pop());
  });

  return c;
}

function measureThreatLevel(creatureTypeConstr, attempt, transformer = x => x) {
  let growing = 128;
  let binary;
  let threatLevel = growing;

  do {
    [...battleground.getCreatures()].forEach(c => c.annihilate());
    [...battleground.items].forEach(i => i.destroy());
    const enemy = creatureTypeConstr();
    enemy.seenByPlayer = true;
    battleground.addCreature(enemy);

    process.stdout.write("Checking (" + attempt + ") " + threatLevel);

    const players = [];
    for (let i = 0; i < threatLevel; i += 1) {
      const player = new Human({
        // const player = new Creature({
        name: `pc${threatLevel}`,
        faction: "PCS",
        looks: {
          hairStyle: 1,
          hairColor: 1,
          skinColor: 1
        },
        defaultWeapon: {
          name: "Test Weapon",
          damage: {
            [DAMAGE_TYPES.SLICE]: 4,
            [DAMAGE_TYPES.PIERCE]: 4,
            [DAMAGE_TYPES.BLUNT]: 4
          },
          hitChance: 100
        },
        defaultArmor: {
          [DAMAGE_TYPES.BLUNT]: 0,
          [DAMAGE_TYPES.SLICE]: 0,
          [DAMAGE_TYPES.PIERCE]: 0
        }
      });

      const adulthoodAge = +Object.keys(Human.prototype.agingTiers)[1] + 1;
      for (let i = 0; i < adulthoodAge; i += 1) {
        player.progressAging();
      }
      transformer(player);
      battleground.addCreature(player);
      players.push(player);

      player.startAction(player, player.getActionById("Fight"));
    }

    let i;
    for (i = 0; i < 100000; i += 1) {
      if (enemy.isDead() || players.every(p => p.isDead())) {
        break;
      }
      world.cycle(5);
    }

    process.stdout.write(`\r`);
    // process.stdout.write(` cycles: ${i} \r\n`);

    switch (true) {
      case !!growing:
        if (enemy.isDead()) {
          binary = growing / 2;
          threatLevel -= binary;
          growing = null;
        } else {
          threatLevel += growing;
        }
        break;
      case binary > 1:
        binary = binary / 2;
        if (enemy.isDead()) {
          threatLevel -= binary;
        } else {
          threatLevel += binary;
        }
        break;
      case binary === 1:
        if (enemy.isDead()) {
          return threatLevel;
        } else {
          threatLevel += 1;
        }
        break;
    }
  } while (true);
}

function averageOutThreatLevel(
  creatureTypeConstr,
  attempts = 3,
  transformer = x => x
) {
  const sum = [];
  for (let i = 0; i < attempts; i++) {
    const next = measureThreatLevel(creatureTypeConstr, i + 1, transformer);
    sum.push(next);
  }
  return sum;
}

const check = utils
  .getClasses(Monster)
  .filter(m => m.name[0] !== "?")
  .map(m => m.constructor);

const results = {};
const originalLog = console.log;
console.log = () => {};

// console.warn(
//     'Armored human, metal 1 set, bone club',
//     averageOutThreatLevel(() => createPc(Human, [
//         BoneClub,
//         ArmorSetsMetal1_Head,
//         ArmorSetsMetal1_Trousers,
//         ArmorSetsMetal1_Chest,
//         ArmorSetsMetal1_Hands,
//         ArmorSetsMetal1_Head,
//     ]))
// );

const done = [
  "DesertSpider",
  "SwarmerBat",
  "ForestSpider",
  "Rat",
  "Lion",
  "Screech",
  "DuskCrow",
  "Troll",
  "Plaguebeast",
  "Bear",
  "Wolf",
  "Snake",
  "Crocodile",
  "MuckParasite",
  "GiantTick",
  "FireDrake",
  "CaveSpider",
  "MoleRat",
  "Direwolf",
  "Muckworm",
  "EarthDragon",
  "FireDragon",
  "FrostDragon",
  "WaterDragon",
  "Nightcrawler",
  "Lurker",
  "StoneGolem"
];

check.forEach(creatureType => {
  if (done.includes(creatureType.name)) {
    return;
  }
  if (creatureType.name === "PrimitiveTrainingDummy") {
    return;
  }
  if (
    creatureType.prototype.threatLevel &&
    +creatureType.prototype.threatLevel
  ) {
    // process.stdout.write(
    //   "Result " +
    //     creatureType.name +
    //     " [] " +
    //     creatureType.prototype.threatLevel +
    //     "\n"
    // );
    // return;
  }
  process.stdout.write("Processing " + creatureType.name + "\n");

  const run = callback =>
    averageOutThreatLevel(() => new creatureType(), 3, callback);
  const mod = how => h => {
    h.getDodgeRating = () => how.dodgeRating;
    h.defaultWeapon.hitChance = how.hitChance;
  };

  results[creatureType.name] = {
    "weak   ": [
      run(mod({ dodgeRating: 0, hitChance: 60 }))
      // run(mod({ dodgeRating: 0, hitChance: 80 })),
      // run(mod({ dodgeRating: 0, hitChance: 100 }))
    ],
    "mid    ": [
      // run(mod({ dodgeRating: 50, hitChance: 60 })),
      run(mod({ dodgeRating: 50, hitChance: 80 }))
      // run(mod({ dodgeRating: 50, hitChance: 100 }))
    ],
    "strong ": [
      // run(mod({ dodgeRating: 100, hitChance: 60 })),
      // run(mod({ dodgeRating: 100, hitChance: 80 })),
      run(mod({ dodgeRating: 100, hitChance: 100 }))
    ]
  };
  process.stdout.write(
    "Result " +
      creatureType.name +
      "\nCurrent stored level: " +
      creatureType.prototype.threatLevel +
      Object.keys(results[creatureType.name]).map(
        type => `\n${type}: ${results[creatureType.name][type].join(", ")}`
      ) +
      "\n\n"
  );
});

(function() {
  const powers = {};
  const tiers = {};
  const types = {};
  utils.getClasses(Room).forEach(roomProto => {
    if (roomProto.monstersTable) {
      let lastChance = 0;
      let averagePower = 0;
      Object.keys(roomProto.monstersTable).forEach(key => {
        const chance = +key - lastChance;
        lastChance = +key;

        const spawns = roomProto.monstersTable[key];
        Object.keys(spawns).forEach(creatureClassName => {
          const creatureClass = global[creatureClassName];
          const counts = spawns[creatureClassName]
            .split(":")
            .reduce((acc, fromTo) => {
              const [from, to] = fromTo.split("-");
              if (to === undefined) return acc + +from;
              return acc + (+from + +to) / 2;
            }, 0);

          averagePower +=
            (chance / 100) * counts * creatureClass.prototype.threatLevel;
        });
      });

      const tier = roomProto.constructor.name.match(/Tier([0-9]+)/)[1];
      const type = roomProto.constructor.name.replace(`Tier${tier}_`, "");

      tiers[tier] = true;
      types[type] = true;

      powers[tier] = powers[tier] || {};
      powers[tier][type] = Math.round(averagePower);
    }
  });

  const LABEL_WIDTH = 10;
  const COL_WIDTH = 6;

  originalLog(
    utils.padLeft("", LABEL_WIDTH) +
      Object.keys(tiers)
        .map(n => utils.padLeft(n, COL_WIDTH))
        .join("")
  );
  Object.keys(types).forEach(type =>
    originalLog(
      utils.padLeft(type, LABEL_WIDTH) +
        Object.keys(tiers)
          .map(n => utils.padLeft("" + powers[n][type], COL_WIDTH))
          .join("")
    )
  );
})();

console.log = originalLog;

console.log(results);

process.exit(0);

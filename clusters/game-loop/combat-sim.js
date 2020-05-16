const cluster = require("cluster");

global.httpServerFork = cluster.fork({ clusterMode: "http-server" });

global.debugOption = {
  // gameSpeed: 1000,
  // itemSpawnedQty: 2000,
  // undying: true,
  // forceAttackWave: true,
  // superpower: 25000,
  showCorpses: true,
  superFastTravel: 300000,
  veryFastEnemies: 300000,
  loginAsEmail: ADMIN_EMAIL
  // skillGainSpeed: 1000,
  // superCapacity: 50000000,
  //revealMap: true,
  // bonusVisionRange: 4,
  // TEMPERATURE_INTERVAL: 5,
  // TERRAFORM_INTERVAL: 5,
};

require("../../singletons/static");
const utils = require("../../singletons/utils");
const TimeCheck = require("../../singletons/time-check");
const worldBuilder = require("../../singletons/world-builder");
const World = require("../../class/world");
const server = require("../../singletons/server");
const gameChat = require("../../singletons/game-chat-server");

const combatSimBuilder = require("../../singletons/combat-sim-builder");

global.timing = {};

global.CYCLE_RATE = 50;

utils.log("** Creating a new world **");
world = combatSimBuilder.buildNewWorld();

server.syncTokens(world);

global.world = world;
world.currentTime = new Date();

utils.log("*** Start ***");

let terminate = false;
let updateTimer = 0;

const cycle = () => {
  world.cycle(1);

  updateTimer += 1;
  if (updateTimer > 10) {
    updateTimer -= 10;
    server.updatePlayers(1);
  }
  Player.updateHttpServer();

  if (terminate) {
    utils.log("*** Terminated ***");
    utils.log("*** Exiting ***");
    process.exit(0);
  }
  const nextCycleIn = Math.max(
    0,
    world.currentTime.getTime() - new Date().getTime()
  );
  setTimeout(() => {
    cycle();
  }, 100);
};

cycle();

process.on("SIGTERM", function() {
  terminate = true;
});

process.on("SIGINT", function() {
  terminate = true;
});

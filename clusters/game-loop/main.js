const cluster = require("cluster");

global.httpServerFork = cluster.fork({ clusterMode: "http-server" });

const cycleSeconds = 300;

require("../../singletons/static");
const utils = require("../../singletons/utils");
const worldBuilder = require("../../singletons/world-builder");
const World = require("../../class/world");
const server = require("../../singletons/server");
const gameChat = require("../../singletons/game-chat-server");

server.runPreFlightChecks();

const initialise = program.reset;
let worldPromise;
global.timing = {
  cacheUse: {}
};

if (program.profiling) {
  utils.log("Profiling enabled");
}

if (initialise) {
  utils.log("** Creating a new world **");
  worldPromise = worldBuilder.buildNewWorld().catch(utils.exitFatal);

  worldPromise
    .then(world => {
      global.world = world;
      console.log("Initial save");
      world.save("initial_save.json");
      world.save("rolling_save.json");
      console.log("Save done");
      // console.time('Running world sim');
      // console.timeEnd('Running world sim');
    })
    .catch(utils.exitFatal);
} else {
  worldPromise = Promise.resolve(World.load("rolling_save.json"))
    .then(world => {
      global.world = world;
      // world.save("rolling_save.json");
      gameChat.loadMessages(world.gameChatMessages);
      return world;
    })
    .catch(utils.exitFatal);
}

worldPromise
  .then(world => worldBuilder.upgrade(world))
  .then(world => {
    global.world = world;
    world.recipeChecker();
    server.syncTokens(world);
    Player.updateHttpServer();

    if (program.dev || program.nofastfwd) {
      world.currentTime = new Date();
    }
    world.gameChatMessages = gameChat.getMessages();

    utils.log("*** Start ***");

    let terminate = false;

    let time;
    let nextCycleSeconds = 1;

    const cycle = () => {
      global.timing.intervals = [];
      time = new Date().getTime();
      world.cycle(nextCycleSeconds);
      scenario.cycle(nextCycleSeconds);
      global.timing.cycle = new Date().getTime() - time;

      world.rollingSave(nextCycleSeconds);

      global.timing.nextCycleSeconds = nextCycleSeconds;
      global.timing.connectedPlayers = server.getConnectedPlayers();
      const targetMs = 600;
      if (program.dev && debugOption.cycleSeconds) {
        nextCycleSeconds = debugOption.cycleSeconds;
      } else {
        if (global.timing.cycle > targetMs * nextCycleSeconds) {
          nextCycleSeconds += 1;
          utils.log("Increased cycle breadth", nextCycleSeconds);
        } else if (
          nextCycleSeconds > 1 &&
          global.timing.cycle < targetMs * (nextCycleSeconds - 1)
        ) {
          nextCycleSeconds -= 1;
          utils.log("Reduced cycle breadth", nextCycleSeconds);
        }
      }

      time = new Date().getTime();
      server.updatePlayers(nextCycleSeconds);
      global.timing.sendingUpdates = new Date().getTime() - time;

      utils.profilingLog();

      if (terminate) {
        utils.log("*** Terminated ***");
        world.save("rolling_save.json");
        utils.log("*** Exiting ***");
        process.exit(0);
      }
      const nextCycleIn = Math.max(
        100,
        world.currentTime.getTime() - new Date().getTime()
      );
      setTimeout(
        cycle,
        program.dev && debugOption.cycleTiming
          ? debugOption.cycleTiming
          : nextCycleIn
      );
    };

    cycle();

    process.on("SIGTERM", function() {
      terminate = true;
    });

    process.on("SIGINT", function() {
      terminate = true;
    });
  })
  .catch(utils.exitFatal);

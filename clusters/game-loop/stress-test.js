const cluster = require("cluster");

global.httpServerFork = cluster.fork({ clusterMode: "http-server" });

require("../../singletons/static");
const utils = require("../../singletons/utils");
const TimeCheck = require("../../singletons/time-check");
const worldBuilder = require("../../singletons/world-builder");
const World = require("../../class/world");
const server = require("../../singletons/server");
const gameChat = require("../../singletons/game-chat-server");
const stressTest = require("../../singletons/world-builder/stress-test");

let worldPromise;
global.timing = {};

worldPromise = Promise.resolve(World.load("rolling_save.json"))
  .then(world => {
    global.world = world;
    return world;
  })
  .then(world => stressTest.upgrade(world))
  .then(world => {
    world.currentTime = new Date();

    world.gameChatMessages = gameChat.getMessages();

    utils.log("*** Start ***");

    let terminate = false;

    let time;
    let nextCycleSeconds = 1;
    const cycle = () => {
      time = new Date().getTime();
      world.cycle(nextCycleSeconds);
      global.timing.cycle = new Date().getTime() - time;
      console.log("Cycle:", global.timing.cycle, "ms");

      time = new Date().getTime();
      server.updatePlayers(nextCycleSeconds);
      global.timing.sendingUpdates = new Date().getTime() - time;
      global.timing.connectedPlayers = server.getConnectedPlayers();
      console.log("Updates:", global.timing.sendingUpdates, "ms");

      const targetMs = 300;
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

      if (terminate) {
        utils.log("*** Terminated ***");
        utils.log("*** Exiting ***");
        process.exit(0);
      }
      const nextCycleIn = Math.max(
        0,
        world.currentTime.getTime() - new Date().getTime()
      );
      setTimeout(cycle, nextCycleIn);
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

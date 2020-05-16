require("./singletons/utils");
require("./singletons/static");
const cluster = require("cluster");
global.program = require("commander");
process.setMaxListeners(20);

program
  .version("0.1.0")
  .option("-r, --reset", "Reset the world")
  .option("-d, --dev", "Development mode")
  .option("-s, --ssl", "Connect over ssl")
  .option("-p, --profiling", "Enable profiling logging")
  .option("-n, --nofastfwd", "No fast forward of time")
  .option("-l, --latency <miliseconds>", "Simulate latency (dev mode only)")
  .option("-m, --module <module>", "Main loop module")
  .parse(process.argv);

global.debugOption = {
  // cycleSeconds,
  // cycleTiming: 500,
  // gameSpeed: 500 / (cycleSeconds || 1),
  // undying: true,
  // superpower: 200,
  // superFastTravel: 200,
  // veryFastEnemies: 2000,
  // skillGainSpeed: 10,
  // superCapacity: 50000000,
  // revealMap: true,
  // bonusVisionRange: 0,
  // TEMPERATURE_INTERVAL: 5,
  // TERRAFORM_INTERVAL: 5,
  // disableSave: true,
  // itemSpawnedQty: 2000,
};

if (!program.dev) {
  global.debugOption = {};
}

switch (process.env.clusterMode) {
  case "http-server":
    global.PlayerData = {};
    require("./clusters/server-http/main");
    break;
  default:
    require(`./clusters/game-loop/${program.module || "main"}`);
}

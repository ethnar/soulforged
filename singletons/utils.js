const rand = require("random-seed");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const request = require("request");

require("./nameable");
require("./time-check");

const numberToText = require("./utils.number-to-text");

const BASE_SEED = 12345678;
const SEED_MODULO = 1.2676506002282294e15;

const usedDeltas = {};
const jsActionCache = {};
const measures = {};

const splitWords = str => str.match(/([^<> ]+|<[^>]+>)/g);
const hash = method => string =>
  crypto
    .createHash(method)
    .update(string)
    .digest("hex");

const performanceLog = fs.createWriteStream("./.logs/performance.log", {
  flags: "w"
});

let cycleCachingTime;
let cycleCache = {};
const invalidTrackers = {};

Array.prototype.toObject = function(keyGetter, valueGetter = i => i) {
  const object = {};
  this.forEach((i, idx) => {
    object[keyGetter(i, idx)] = valueGetter(i);
  });
  return object;
};

let gameLoadedDefer;
const gameLoadedPromise = new Promise(resolve => {
  gameLoadedDefer = resolve;
});

const stringToKey = {};
const keyToString = {};

const utils = {
  md5: hash("md5"),

  sum: (acc, i) => acc + i,

  mathLog(base, n) {
    return Math.log(n) / Math.log(base);
  },

  nextSeed(seed) {
    return (seed * BASE_SEED) % SEED_MODULO;
  },

  getValue(functionOrValue, ...args) {
    return typeof functionOrValue === "function"
      ? functionOrValue(...args)
      : functionOrValue;
  },

  totalMaterialCount(materials = {}) {
    return Object.values(materials).reduce((acc, item) => acc + item, 0);
  },

  getKey(string) {
    if (!stringToKey[string]) {
      const key = utils.md5(string).substr(0, 6);
      stringToKey[string] = key;
      if (keyToString[key]) {
        throw new Error(`Clashing keys: ${keyToString[key]} vs ${string}`);
      }
      keyToString[key] = string;
    }
    return stringToKey[string];
  },

  fromKey(key) {
    if (!keyToString[key]) {
      throw new Error(`Unable to decode key: ${key}`);
    }
    return keyToString[key];
  },

  setCacheHeaders(res, req) {
    const url = req.url || req;
    if (url.match(/\.(png|jpg|mp3)$/)) {
      const age = 30 * DAYS;
      const expires = new Date();
      expires.setSeconds(age);
      res.setHeader(
        "Cache-Control",
        `public,max-age=${age * IN_MILISECONDS},immutable`
      );
      res.setHeader("Expires", expires.toGMTString());
    }
  },

  chance(percentage, times = 1, precision = 1, seed = null) {
    const multiplier = Math.pow(10, precision);
    const chance = 100 - Math.pow((100 - percentage) / 100, times) * 100;
    return utils.random(1, 100 * multiplier, seed) <= chance * multiplier;
  },

  random(from, to, seed) {
    if (to === undefined) {
      return from;
    }
    if (seed) {
      if (typeof seed === "string") {
        seed = utils.getWordBasedSeed(seed);
      }
      return rand(seed + BASE_SEED).intBetween(from, to);
    }
    return Math.floor(Math.random() * (1 + to - from)) + from;
  },

  randomizeArray(arr, seed) {
    const result = [];
    const source = [...arr];

    while (source.length) {
      const idx = utils.random(0, source.length - 1, seed);
      if (seed) {
        seed = utils.nextSeed(seed);
      }
      const el = source.splice(idx, 1);
      result.push(el.pop());
    }

    return result;
  },

  scrambleArray(orgArr, seed) {
    const arr = [...orgArr];
    const result = [];
    while (arr.length) {
      let index = 0;
      while (index < arr.length - 1 && utils.chance(35, 1, 1, seed)) {
        seed += 1;
        index += 1;
      }
      seed += 1;
      const element = arr[index];
      result.push(element);
      arr.splice(index, 1);
    }
    return result;
  },

  randomItem(arr, seed) {
    let idx;
    if (seed) {
      if (typeof seed === "string") {
        seed = utils.getWordBasedSeed(seed);
      }
      idx = rand(seed + BASE_SEED).intBetween(0, arr.length - 1);
    } else {
      idx = utils.random(0, arr.length - 1);
    }
    return arr[idx];
  },

  getWordBasedSeed(word) {
    return word
      .toLowerCase()
      .split("")
      .reduce((acc, l) => (acc + acc + l.charCodeAt(0)) % SEED_MODULO, 0);
  },

  randomResearchMats(seedDelta) {
    return 1;
    // if (program.dev || true) {
    //     return 1;
    // }
    // if (usedDeltas[seedDelta]) {
    //     // throw new Error('Using the same seed twice: ' + usedDeltas);
    // }
    // usedDeltas[seedDelta] = true;
    // return rand(BASE_SEED + seedDelta).intBetween(1, 3);
  },

  randomFromRange(range) {
    if (!Array.isArray(range)) {
      return range;
    }
    return utils.random(...range);
  },

  effectsCalculator(maxLevel) {
    return (effects, value, multiplier = 1) =>
      Object.keys(effects).toObject(
        stat => stat,
        stat =>
          (effects[stat] * multiplier * Math.min(maxLevel, value)) / maxLevel
      );
  },

  ucfirst(word) {
    return word[0].toUpperCase() + word.slice(1);
  },

  toolMultiplier(level) {
    return Math.pow(1.5, level - 1);
  },

  skillMultiplier(level) {
    return Math.pow(1.5, level - 1);
  },

  logarithm(base, number) {
    return Math.log(number) / Math.log(base);
  },

  errorResponse(message) {
    utils.error("Responding: " + message);
    return { message: message };
  },

  cleanup(object, deep = false) {
    return object;
    //
    // if (!object || typeof object !== 'object') {
    //     return object;
    // }
    //
    // return Object
    //     .keys(object)
    //     .filter(key => key !== '#id')
    //     .reduce((acc, item) => {
    //         acc[item] = deep ?
    //             utils.cleanup(object[item], true) :
    //             object[item];
    //         return acc;
    //     }, {});
  },

  limit(value, min, max) {
    return Math.min(max, Math.max(min, value));
  },

  stackQty(acc, item) {
    return acc + item.qty;
  },

  reStackItems(itemsList) {
    itemsList.forEach((item1, idx1) => {
      itemsList.forEach((item2, idx2) => {
        if (
          idx1 !== idx2 &&
          item1.constructor === item2.constructor &&
          item1.stackable &&
          item1.hasMatchingIntegrity(item2) &&
          item1.matchesTradeId(item2) &&
          item1.qty &&
          item2.qty
        ) {
          const balance = item1.qty;
          const targetIntegrity =
            (item1.qty * item1.integrity + item2.qty * item2.integrity) /
            (item1.qty + item2.qty);
          item2.modifyIntegrity(targetIntegrity - item2.integrity);
          item1.qty -= balance;
          item2.qty += balance;
        }
      });
    });
    return [...itemsList].filter((item, idx) => {
      if (item.qty === 0) {
        item.getContainer().removeItem(item);
        item.destroy();
        return false;
      }
      return true;
    });
  },

  applyLootDrop(lootTable, node) {
    utils.applyTableChance(lootTable, (item, qty) => {
      node.addItem(
        new global[item]({
          qty
        })
      );
      node.reStackItems();
    });
  },

  applySpawnTable(spawnTable, node, callbacks) {
    utils.applyTableChance(
      spawnTable,
      (item, quantities) => {
        quantities.forEach((qty, idx) => {
          for (let i = 0; i < qty; i += 1) {
            const c = new global[item]();
            if (callbacks) {
              callbacks[idx](c);
            }
            node.addCreature(c);
          }
        });
      },
      true
    );
  },

  applyTableChance(lootTable, callback, multiples = false) {
    if (lootTable) {
      if (typeof lootTable === "function") {
        const loot = lootTable();
        Object.keys(loot).forEach(item => {
          callback(item, loot[item]);
        });
      } else {
        const dropRoll = utils.random(1, 100);
        const dropIdx = Object.keys(lootTable).find(
          chance => chance >= dropRoll
        );
        const drop = lootTable[dropIdx];

        if (drop) {
          Object.keys(drop).forEach(item => {
            if (multiples) {
              const quantities = (drop[item] || "").split(":").map(range => {
                const [from, to] = (range || "").split("-").map(n => +n);
                return to ? utils.random(from, to) : from;
              });

              callback(item, quantities);
            } else {
              const [from, to] = (drop[item] || "").split("-").map(n => +n);
              const qty = to ? utils.random(from, to) : from;
              if (qty) {
                callback(item, qty);
              }
            }
          });
        }
      }
    }
  },

  exitFatal(error) {
    utils.error(error);
    process.exit(1);
  },

  reportViolation() {},

  performanceMeasure(category) {
    measures[category] = process.hrtime();
  },

  performanceMeasureEnd(category, info) {
    if (measures[category]) {
      const hrtime = process.hrtime();
      const values = measures[category].map((v, i) => hrtime[i] - v);
      const milliseconds = values[0] * 1e3 + values[1] / 1e6;

      performanceLog.write(
        [
          new Date().toISOString(),
          `${milliseconds}ms`,
          Object.keys(info)
            .map(k => `${k}: ${info[k]}`)
            .join("  "),
          "\n"
        ].join(" ")
      );

      measures[category] = null;
    }
  },

  log(...message) {
    console.log(new Date().toISOString(), ...message);
  },

  error(...message) {
    console.error(new Date().toISOString(), ...message);
  },

  logCustom(type, ...message) {
    fs.appendFile(
      `game.${type}.log`,
      new Date().toISOString() + ": " + message + "\n",
      () => {}
    );
  },

  profilingLog() {
    if (
      program.profiling ||
      timing.cycle > 500 ||
      timing.sendingUpdates > 500
    ) {
      const intervals = global.timing.intervals;
      const message = `${new Date().toISOString()} [${world
        .getCurrentTime()
        .toISOString()}] ${timing.cycle}ms ${
        timing.sendingUpdates
      }ms ${JSON.stringify(global.timing.save)}ms {${
        timing.connectedPlayers
      }} (${intervals.join(", ")})
`;
      fs.appendFile("./.logs/profile.log", message, err => {
        if (err) utils.error(err);
      });
    }
  },

  htmlEncode(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;");
  },

  getJsPayload(basePath, creature) {
    if (!jsActionCache[basePath]) {
      const jsFile = `${basePath}.es5.js`;
      const source = fs.readFileSync(`./resources${jsFile}`).toString();
      const componentName = source.match(/Vue.component\(["']([^"']+)/)[1];

      jsActionCache[basePath] = {
        componentName,
        jsFile: jsFile
      };

      const cssFile = `${basePath}.css`;
      if (fs.existsSync(`./resources${cssFile}`)) {
        jsActionCache[basePath].cssFile = cssFile;
      }
    }
    const player = creature.getPlayer();
    const fromCache = jsActionCache[basePath];
    return {
      componentName: fromCache.componentName,
      jsFile: server.getHttpResourceForPlayer(player, fromCache.jsFile),
      cssFile: fromCache.cssFile
        ? server.getHttpResourceForPlayer(player, fromCache.cssFile)
        : undefined
    };
  },

  jsAction(sourceFilename) {
    return {
      actionJs: creature => utils.getJsPayload(sourceFilename, creature)
    };
  },

  reduceMax(acc, item) {
    return Math.max(acc, item);
  },

  removeFromArray(array, item) {
    const idx = array.indexOf(item);

    if (idx !== -1) {
      array.splice(idx, 1);
    }
  },

  romanLiterals(number) {
    switch (number) {
      case 1:
        return "I";
      case 2:
        return "II";
      case 3:
        return "III";
      case 4:
        return "IV";
      case 5:
        return "V";
      case 6:
        return "VI";
      case 7:
        return "VII";
      case 8:
        return "VIII";
      case 9:
        return "IX";
      case 10:
        return "X";
      default:
        return `${number}`;
    }
  },

  validateDataStructure(data, format) {
    let result;
    let message;
    switch (format.type) {
      case Object:
        result =
          typeof data === "object" &&
          Object.keys(data).length === Object.keys(format.format).length &&
          Object.keys(data).every(key => {
            const deepValidation = utils.validateDataStructure(
              data[key],
              format.format[key]
            );
            if (!deepValidation.ok) {
              message = deepValidation.message;
              return false;
            }
            return true;
          });
        break;
      case String:
        result =
          typeof data === "string" &&
          (!format.min || data.length >= format.min) &&
          (!format.max || data.length <= format.max) &&
          (!format.regex || data.match(format.regex)) &&
          (format.rules || []).every(rule => {
            if (!data.match(rule.regex)) {
              message = rule.message;
              return false;
            }
            return true;
          });
        break;
      case Boolean:
        result = typeof data === "boolean";
        break;
      case Number:
        result =
          typeof data === "number" &&
          (!format.min || data >= format.min) &&
          (!format.max || data <= format.max);
        break;
      case Array:
        result =
          Array.isArray(data) &&
          (!format.min || data.length >= format.min) &&
          (!format.max || data.length <= format.max) &&
          data.every(value => {
            const deepValidation = utils.validateDataStructure(
              value,
              format.format
            );
            if (!deepValidation.ok) {
              message = deepValidation.message;
              return false;
            }
            return true;
          });
        break;
      default:
        result = false;
    }
    if (!result) {
      message = message || format.message;
      utils.log("Request validation failed", JSON.stringify([data, format]));
    }
    return {
      ok: result,
      message
    };
  },

  checkForInvalidTrackers() {
    const intervalTrackers = (world.intervalTrackers =
      world.intervalTrackers || {});

    let cleanedUp = 0;
    Object.keys(intervalTrackers).forEach(k => {
      if (invalidTrackers[k] === intervalTrackers[k]) {
        cleanedUp += 1;
        delete invalidTrackers[k];
        delete intervalTrackers[k];
      } else {
        invalidTrackers[k] = intervalTrackers[k];
      }
    });

    if (cleanedUp) {
      utils.log(`Cleaned up ${cleanedUp} outdated interval trackers`);
    }
  },

  atInterval(timing, callback, seconds = 1, id = "") {
    const stringified = callback.toString();
    if (stringified.length > 48) {
      console.warn("Long interval key", stringified);
    }
    const key = stringified + id;
    const intervals = global.timing.intervals || [];

    const intervalTrackers = (world.intervalTrackers =
      world.intervalTrackers || {});
    intervalTrackers[key] = intervalTrackers[key] || 0;
    if (intervalTrackers[key] >= timing) {
      intervalTrackers[key] -= timing;
      intervals.push(key);
      callback();
    }

    intervalTrackers[key] += seconds;
  },

  calculateCycleSeconds(previousSeconds, lastTime, targetMs) {
    if (lastTime > targetMs * previousSeconds) {
      return previousSeconds + 1;
    }
    if (previousSeconds > 1 && lastTime < targetMs * previousSeconds) {
      return previousSeconds - 1;
    }
    return previousSeconds;
  },

  getClasses(className) {
    return Object.keys(global)
      .filter(name => global[name])
      .filter(name => global[name].prototype)
      .filter(name => global[name].prototype instanceof className)
      .map(name => global[name].prototype);
  },

  recursiveScandir(filepath) {
    let check = fs.readdirSync(filepath).map(f => `${filepath}/${f}`);
    // utils.log('Recursive scan', filepath, check.length);
    const files = [];
    do {
      next = check;
      check = [];

      next.forEach(item => {
        // utils.log('Recursive scan path', item);

        if (fs.lstatSync(item).isDirectory()) {
          check = [...check, ...fs.readdirSync(item).map(f => `${item}/${f}`)];
        } else if (!item.includes(".DS_Store")) {
          files.push(item);
        }
      });
    } while (check.length);

    return files.map(f => {
      try {
        return path.join("..", f);
      } catch (e) {
        utils.error(f, e);
      }
    });
  },

  recursiveRequire(filepath) {
    let check = fs.readdirSync(filepath).map(f => `${filepath}/${f}`);
    // utils.log('Recursive scan', filepath, check.length);
    const files = [];
    do {
      next = check;
      check = [];

      next.forEach(item => {
        // utils.log('Recursive scan path', item);

        if (fs.lstatSync(item).isDirectory()) {
          check = [...check, ...fs.readdirSync(item).map(f => `${item}/${f}`)];
        } else if (!item.includes(".DS_Store")) {
          files.push(item);
        }
      });
    } while (check.length);

    return files.map(f => {
      try {
        return require(path.join("..", f));
      } catch (e) {
        utils.error(f, e);
      }
    });
  },

  recursiveReplace(item, check, replace) {
    if (item && typeof item === "object") {
      Object.keys(item).forEach(k => {
        if (check(item[k])) {
          item[k] = replace(item[k]);
        }
        utils.recursiveReplace(item[k], check, replace);
      });
    }
  },

  registerClass(base, name, prototype) {
    const c = utils.newClassExtending(name, base);
    Object.assign(c.prototype, prototype);
    global[name] = c;
    return c;
  },

  newClassExtending(className, parentClass) {
    if (global[className]) {
      throw new Error(`Duplicate class ${className}`);
    }
    function B(...args) {
      return Reflect.construct(parentClass, args, B);
    }
    Reflect.setPrototypeOf(B.prototype, parentClass.prototype);
    Reflect.setPrototypeOf(B, parentClass);
    Object.defineProperty(B, "name", { value: className });
    global[className] = B;
    return B;
  },

  changeObjectClass(entity, classTo) {
    Reflect.setPrototypeOf(entity, classTo.prototype);
  },

  prepareRegistry(
    registry,
    classCtr,
    callback = entity => entity.getEntityId()
  ) {
    utils.gameLoaded().then(() => {
      Entity.getEntities(classCtr).forEach(entity => {
        registry[callback(entity)] = entity;
      });
    });
  },

  gameLoaded() {
    return gameLoadedPromise;
  },

  triggerGameLoaded(world) {
    return gameLoadedDefer(world);
  },

  scrambleLanguage(text) {
    const shouldSkipSpace = (word1, word2) => {
      if (!word2) return false;
      if (word1.length < 3 || word2.length < 3) return false;
      if (word1.length + word2.length > 16) return false;
      if (word1.match(/[^a-zA-Z]/) || word2.match(/[^a-zA-Z]/)) return false;

      const seed = utils.getWordBasedSeed(word1 + word2);

      if (utils.random(1, 100, seed) < 30) {
        return true;
      }
      return false;
    };

    const canSplit = word => {
      if (word.length < 7) return false;
      const seed = utils.getWordBasedSeed(word);
      if (utils.random(1, 100, seed) < 30) {
        const splitPoint =
          Math.round(word.length / 2) + 1 - utils.random(1, 3, seed);
        return word.substr(0, splitPoint) + " " + word.substr(splitPoint);
      }
      return false;
    };

    const scrambleWord = (word, extraSeed) => {
      const seed = utils.getWordBasedSeed(word) + extraSeed;
      return word
        .split("")
        .map((letter, idx) => {
          if (letter >= "A" && letter <= "Z") {
            return String.fromCharCode(
              ((letter.charCodeAt(0) -
                65 +
                utils.random(0, 25, seed * (idx + 1))) %
                26) +
                65
            );
          }
          if (letter >= "a" && letter <= "z") {
            return String.fromCharCode(
              ((letter.charCodeAt(0) -
                97 +
                utils.random(0, 25, seed * (idx + 1))) %
                26) +
                97
            );
          }
          return letter;
        })
        .join("");
    };

    const stripNonWordCharacter = str =>
      str ? str.replace(/[^a-zA-Z1-9 .,:()]/g, "") : undefined;

    const split = splitWords(text);

    let result = "";
    let skipSpace = false;
    for (let i = 0; i < split.length; i += 1) {
      if (split[i][0] === "<") {
        result += split[i];
        continue;
      }
      let word1 = stripNonWordCharacter(split[i]);
      let word2 = stripNonWordCharacter(split[i + 1]);

      if (skipSpace) {
        word1 = word1.toLowerCase();
      }

      skipSpace = skipSpace ? false : shouldSkipSpace(word1, word2);

      if (!skipSpace) {
        const split = canSplit(word1);
        if (split) {
          word1 = split;
        }
      }

      result += word1;
      result += skipSpace || i === split.length - 1 ? "" : " ";
    }

    return splitWords(result)
      .map((word, idx) => (word[0] === "<" ? word : scrambleWord(word, idx)))
      .join(" ")
      .replace(/> /g, ">")
      .replace(/ </g, "<");
  },

  translationSaveWords(text, level) {
    if (level >= 100) {
      return text;
    }
    let seed = utils.getWordBasedSeed(text);
    return splitWords(text)
      .map((w, idx) => {
        if (w[0] === "<") {
          return w;
        }
        const chance = utils.random(1, 100, seed);
        seed = (seed + idx * 123) % SEED_MODULO;
        return chance <= level ? w : w.replace(/[a-zA-Z]/g, "££");
      })
      .join(" ")
      .replace(/> /g, ">")
      .replace(/ </g, "<")
      .replace(/£[^a-zA-Z0-9]*£/g, "...");
  },

  approximateIntegrity(integrity) {
    switch (true) {
      case integrity > 50:
        return [50, 100];
      case integrity > 20:
        return [20, 50];
      case integrity > 0:
        return [0, 20];
      default:
        return [0];
    }
  },

  padLeft(string, length, character = " ") {
    while (string.length < length) {
      string = character + string;
    }
    return string;
  },

  cachableFunction(id, callback) {
    if (!global.world) {
      return callback();
    }
    const currentTime = world.getCurrentTime().toString();
    if (cycleCachingTime !== currentTime) {
      cycleCachingTime = currentTime;
      cycleCache = {};
      // global.timing.cacheUse = {};
    }
    if (!cycleCache.hasOwnProperty(id)) {
      // let time;
      // if (program.profiling) {
      //     time = process.hrtime();
      // }

      cycleCache[id] = callback();

      //     if (program.profiling) {
      //         const after = process.hrtime();
      //         global.timing.cacheUse[id] = {
      //             countUsed: 0,
      //             time: (after[0] + after[1] / 1e+9) - (time[0] + time[1] / 1e+9),
      //         };
      //     }
      // } else {
      //     if (program.profiling) {
      //         global.timing.cacheUse[id].countUsed += 1;
      //     }
    }
    return cycleCache[id];
  },

  clusterRequest(topic, data) {
    return new Promise(resolve => {
      const requestId = JSON.stringify(process.hrtime()) + topic;
      const listener = data => {
        if (data.type === "clusterResponse" && data.requestId === requestId) {
          resolve(data.response);
          process.removeListener("message", listener);
        }
      };
      process.on("message", listener);
      process.send({
        type: "clusterRequest",
        topic,
        requestId,
        data
      });
    });
  },

  registerClusterHandler(cluster, topic, handler) {
    if (!cluster) {
      return false;
    }
    cluster.on("message", msg => {
      if (msg.type === "clusterRequest" && msg.topic === topic) {
        const result = handler(msg.data);
        const respond = response =>
          cluster.send({
            type: "clusterResponse",
            requestId: msg.requestId,
            response
          });
        if (result && result.then) {
          result.then(response => respond(response));
        } else {
          respond(result);
        }
      }
    });
  },

  getPostData(req) {
    return new Promise((resolve, reject) => {
      let bodyStr = "";
      req.on("data", function(chunk) {
        bodyStr += chunk.toString();
      });
      req.on("end", function() {
        let params;
        try {
          params = JSON.parse(bodyStr);
          if (typeof params !== "object") {
            throw new Error("Invalid request");
          }
          resolve(params);
        } catch (error) {
          reject({
            error,
            bodyStr
          });
        }
      });
    });
  },

  httpRequest(...args) {
    return new Promise((resolve, reject) => {
      const req = request(...args);
      req.on("response", response => resolve(utils.getPostData(response)));
      req.on("error", error => reject(error));
    });
  },

  not(fn) {
    return (...args) => !fn(...args);
  },

  and(...fns) {
    return (...args) => fns.reduce((acc, fn) => acc && fn(...args), true);
  },

  or(...fns) {
    return (...args) => fns.reduce((acc, fn) => acc || fn(...args), false);
  },

  xOf(qty, ...fns) {
    return (...args) =>
      fns.reduce((acc, fn) => (fn(...args) ? acc + 1 : acc), 0) >= qty;
  },

  totalWeight(materials) {
    return Object.keys(materials).reduce((acc, material) => {
      return acc + materials[material] * global[material].prototype.weight;
    }, 0);
  },

  humanizeItemList(materials) {
    return Object.keys(materials)
      .filter(className => !!materials[className])
      .map(
        className => `${global[className].getName()} (${materials[className]})`
      )
      .join(", ");
  },

  withRetries(promiseCallback, errorHandler) {
    let retry = 0;
    const tryCall = () => {
      promiseCallback().catch(e => {
        if (retry < 20) {
          retry += 1;
          // utils.error("Retry call", retry, promiseCallback.toString());
          setTimeout(() => {
            tryCall();
          }, 5000);
        } else {
          if (errorHandler) {
            errorHandler(e);
          } else {
            utils.error(e);
          }
        }
      });
    };
    tryCall();
  },

  //  0   50  1
  // 5  -9000  2
  //  4  350  3
  getDirection(from, to) {
    if (from.zLevel !== to.zLevel) {
      return from.zLevel < to.zLevel ? -1 : -2;
    }
    if (from.x === to.x && from.y === to.y) {
      return -9000;
    }
    const xDelta = from.x - to.x;
    const yDelta = from.y - to.y;
    if (Math.abs(xDelta / yDelta) < 0.38268343) {
      // sine of 22.5deg
      return from.y < to.y ? 350 : 50;
    }
    if (Math.abs(yDelta / xDelta) < 0.38268343) {
      return from.x < to.x ? 2 : 5;
    }
    if (from.y < to.y) {
      return from.x < to.x ? 3 : 4;
    } else {
      return from.x < to.x ? 1 : 0;
    }
  },

  getDirectionPositionDescriptor(direction) {
    if (direction >= 0) {
      return "to the";
    }
    if (direction === -9000) {
      return "at";
    }
    return "";
  },

  getDirectionName(direction) {
    switch (direction) {
      case -2:
        return "below";
      case -1:
        return "above";
      case 0:
        return "north-west";
      case 50:
        return "north";
      case 1:
        return "north-east";
      case 2:
        return "east";
      case 3:
        return "south-east";
      case 350:
        return "south";
      case 4:
        return "south-west";
      case 5:
        return "west";
      case -9000:
        return "your current location";
      default:
        return "(report a bug please)";
    }
  },

  stringifyDirection(from, to) {
    const direction = utils.getDirection(from, to);
    return `${utils.getDirectionPositionDescriptor(
      direction
    )} ${utils.getDirectionName(direction)}`;
  },

  pluralize(str, number) {
    if (number > 1) {
      if (str.slice(-1) === "s") {
        return str + "'";
      } else {
        return str + "s";
      }
    }
    return str;
  },

  numberOrder(number) {
    const str = `${number}`;
    switch (str.slice(-1)) {
      case "1":
        return `${number}st`;
      case "2":
        return `${number}nd`;
      case "3":
        return `${number}rd`;
      default:
        return `${number}th`;
    }
  },

  thirdPerson(str) {
    return `${str}'s`.replace(/s's$/, `s'`);
  },

  humanizeList(array) {
    counts = {};
    array.forEach(item => {
      counts[item] = counts[item] || 0;
      counts[item] += 1;
    });

    const grouped = Object.keys(counts).map(
      item =>
        `${counts[item] > 1 ? counts[item] + " " : ""}${utils.pluralize(
          item,
          counts[item]
        )}`
    );

    if (grouped.length === 1) {
      return grouped[0];
    }
    return [grouped.slice(0, -1).join(", "), grouped.slice(-1)].join(" & ");
  },

  compressTravelQueue(queue, currentNode) {
    if (queue.includes(currentNode)) {
      const idx = queue.indexOf(currentNode);
      queue.splice(0, idx + 1);
    }

    let keepLooking = true;
    while (keepLooking) {
      keepLooking = false;
      const indices = {};
      const compressTo = queue.findIndex((node, idx) => {
        if (indices[node.id] !== undefined) {
          return true;
        }
        indices[node.id] = idx;
        return false;
      });
      if (compressTo !== -1) {
        const compressFrom = indices[queue[compressTo].id];
        queue.splice(compressFrom, compressTo - compressFrom);
        keepLooking = true;
      }
    }
  },

  numberToText
};

const debug = {
  superPower(name) {
    if (program.dev) {
      debug.getCreature(name).addBuff(Buff, {
        effects: {
          [BUFFS.COMBAT_STRENGTH]: 50000,
          [BUFFS.ACTION_SPEED]: 50000,
          [BUFFS.BLEEDING]: -50000,
          [BUFFS.HUNGER_RATE]: -10000
        }
      });
    }
  },

  getCreature(name) {
    return Entity.getEntities(Humanoid).find(
      h => !h.isDead() && h.name === name
    );
  },

  getPet(name) {
    return Entity.getEntities(Monster).find(
      h => !h.isDead() && h.tamed && h.name === name
    );
  },

  logInAs(name) {
    const authToken = Object.keys(world.authTokens)
      .reverse()
      .find(
        key =>
          world.authTokens[key] &&
          world.authTokens[key].player ===
            Player.list.find(p => p.email === ADMIN_EMAIL)
      );
    world.authTokens[authToken].player = Player.list.find(
      p => p.creature && !p.creature.dead && p.creature.name === name
    );
  },

  possess(creature) {
    const aymar = Player.list.find(p => p.email === ADMIN_EMAIL);
    aymar.creature = creature;
  },

  newHumanAndPossess() {
    const h = new Human();
    h.spawn();
    h.putInSpark(new BasicSpark());
    debug.possess(h);
  },

  wipeHumanoids() {
    if (program.dev) {
      Entity.getEntities(Humanoid).forEach(h => h.annihilate());
    } else {
      return "Disabled on live";
    }
  },

  repossess() {
    const aymar = Player.list.find(p => p.email === ADMIN_EMAIL);
    aymar.creature = debug.getCreature("Aymar");
  },

  finder(item, finderCallback, objectMapping, path = []) {
    if (!objectMapping) {
      objectMapping = new Map();
    }
    if (finderCallback(item)) {
      return path;
    }
    if (typeof item === "object") {
      if (objectMapping.get(item)) {
        return false;
      }
      objectMapping.set(item, true);

      let match;
      Object.keys(item || {}).find(key => {
        const result = debug.finder(item[key], finderCallback, objectMapping, [
          ...path,
          key
        ]);
        if (result) {
          match = result;
          return true;
        }
        return false;
      });

      if (match) {
        return match;
      }
    }
    return false;
  },

  sizer(item, objectMapping, results = [], path = []) {
    if (!objectMapping) {
      objectMapping = new Map();
      fs.writeFileSync(
        `size.report.log`,
        new Date().toISOString() + "\n",
        () => {}
      );
    }
    if (typeof item === "object") {
      if (objectMapping.get(item)) {
        return false;
      }
      let deep = true;
      objectMapping.set(item, path, "-1");
      try {
        const string = JSON.stringify(item);
        objectMapping.set(item, path, string.length);
        fs.appendFileSync(
          `size.report.log`,
          JSON.stringify(path) + " " + string.length + "\n",
          () => {}
        );
      } catch (e) {}

      Object.keys(item || {}).forEach(key => {
        debug.sizer(item[key], objectMapping, results, [...path, key]);
      });
    }
    return results;
  },

  getCreatureByDiscord(name) {
    const player = Player.list.find(p => p.discord && p.discord.name === name);
    return player && player.getCreature();
  },

  getPlayersToBePrompted() {
    const viable = Player.list
      .filter(p => !p.discord)
      .filter(p => p.onRookIsland)
      .filter(p => !p.getCreature() || p.getCreature().satiated <= 40)
      .filter(p => !p.promptedByMail);

    viable.forEach(p => (p.promptedByMail = true));

    return viable.map(p => p.email).join(", ");
  },

  npcAccountPossess(creature) {
    const p = Player.list.find(p => p.email === ADMIN_EMAIL);
    creature.spark.destroy();
    creature.spark = null;
    p.possessCreature(creature);
    creature.isOnMainland = true;
    creature.baseHidingTime = 3 * SECONDS;
  },

  spawnTesting() {
    if (program.dev) {
      const creature = debug.getCreature("Ethnar II");
      const node = creature.node;
      utils
        .getClasses(Resource)
        .filter(
          proto => (proto.name && proto.name[0] !== "?") || proto.dynamicName
        )
        .filter(proto => proto.produces)
        .forEach(proto => {
          const res = new proto.constructor();
          node.addResource(res);
          res.showUpInSeconds = 0;
        });
      utils
        .getClasses(Item)
        .filter(
          proto => (proto.name && proto.name[0] !== "?") || proto.dynamicName
        )
        .filter(proto => proto.constructor.name !== "TabletWriting")
        .forEach(proto => {
          creature.addItemByType(proto.constructor);
        });
    }
  },

  simTemperature(time) {
    const times = time / TEMPERATURE_INTERVAL;
    for (let i = 0; i < times; i += 1) {
      setTimeout(() => {
        console.log("Sim temp: " + ((100 * i) / times).toFixed(2) + "%");
        world.stabiliseTemperature();
        Entity.getEntities(Dragon).forEach(d => d.periodic());
        Entity.getEntities(Underground).forEach(u => {
          if (u.isType(NODE_TYPES.UNDERGROUND_VOLCANO)) {
            u.volcanoErupting();
          }
          if (u.isType(NODE_TYPES.UNDERGROUND_LAVA_PLAINS)) {
            u.coolingDown();
          }
        });
        world.terraform();
      }, i * 400);
    }
    setTimeout(() => {
      console.log("*********************");
      console.log("*** DONE TEMP SIM ***");
      console.log("*********************");
    }, times * 400);
  }
};

global.debug = debug;
module.exports = global.utils = utils;

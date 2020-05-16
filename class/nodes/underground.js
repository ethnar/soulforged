const Node = require("./node");

class Underground extends Node {
  constructor(args) {
    super(args);
    this.integrity = 100;
  }

  recalculateType() {
    const hasRockWall = this.getResources().some(r => r instanceof RockWall);
    if (hasRockWall) {
      if (!this.isType(NODE_TYPES.UNDERGROUND_WALL)) {
        this.setType(NODE_TYPES.UNDERGROUND_WALL);
      }
      return;
    }
    const hasRockDeposit = this.getResources().some(
      r => r instanceof RockDeposit
    );
    if (hasRockDeposit) {
      if (!this.isType(NODE_TYPES.UNDERGROUND_CAVE)) {
        this.setType(NODE_TYPES.UNDERGROUND_CAVE);
      }
      return;
    }
    if (!this.isType(NODE_TYPES.UNDERGROUND_BEDROCK)) {
      this.setType(NODE_TYPES.UNDERGROUND_FLOOR);
    }
  }

  setType(type) {
    if (this.type !== type) {
      this.integrity = 100;
      super.setType(type);

      if (this.isWall()) {
        [...this.getCreatures()].forEach(creature => {
          if (creature instanceof Humanoid) {
            creature.die("You died in a cave collapse");
          } else {
            creature.annihilate();
          }
        });
        [...this.getAllStructures()].forEach(structure => {
          if (!(structure instanceof Ruins)) {
            structure.destroy();
          }
        });
      }
    }
  }

  getViewRangeModifier(range) {
    return 0;
  }

  getTravelDifficulty(creature) {
    let type;
    if (creature && creature.getNodeInfo) {
      type = creature.getNodeInfo(this).type;
    } else {
      type = this.getType();
    }
    return (
      NODE_TYPE_TRAVEL_DIFFICULTY[type] +
      (creature ? creature.getBuff(BUFFS.TRAVEL_DIFFICULTY) : 0)
    );
  }

  getTemperature(withModifiers = false) {
    let temperature = this.temperature || 0;
    if (withModifiers) {
      temperature -= 2;
    }
    return temperature;
  }

  isWall() {
    return (
      this.isType(NODE_TYPES.UNDERGROUND_WALL) ||
      this.isType(NODE_TYPES.UNDERGROUND_BEDROCK)
    );
  }

  chanceToReshape() {
    if (this.isType(NODE_TYPES.UNDERGROUND_BEDROCK) || this.isConnectedUp()) {
      return 0;
    }
    const wallsCount = this.getConnectedNodes().filter(conn => conn.isWall())
      .length;
    let chance = 0;

    if (this.isWall()) {
      switch (wallsCount) {
        case 0:
          chance = 3;
          break;
        case 1:
          chance = 5;
          break;
        case 2:
          chance = 8;
          break;
        case 3:
          chance = 60;
          break;
        case 4:
          chance = 70;
          break;
        case 5:
          chance = 80;
          break;
        case 6:
          chance = 90;
          break;
      }
    } else {
      switch (wallsCount) {
        case 0:
          chance = 90;
          break;
        case 1:
          chance = 80;
          break;
        case 2:
          chance = 70;
          break;
        case 3:
          chance = 60;
          break;
        case 4:
          chance = 8;
          break;
        case 5:
          chance = 5;
          break;
        case 6:
          chance = 3;
          break;
      }
    }
    if (this.getCompleteStructures().some(s => s instanceof GreenEggs)) {
      chance = Math.max(chance - 20, 0);
    }
    return chance;
  }

  impactedByEarthquake() {
    const chance = this.chanceToReshape();
    if (utils.chance(chance / 3)) {
      if (this.damageSupports()) {
        return;
      }
      if (this.isType(NODE_TYPES.UNDERGROUND_FLOOR)) {
        if (utils.chance(25)) {
          this.addResource(new GraniteDeposit());
        } else if (utils.chance(15)) {
          this.addResource(new LimestoneDeposit());
        }
      } else {
        this.getResources().forEach(r => {
          if (r.undergroundReshaping) {
            r.undergroundReshaping();
          }
        });
      }
    }
  }

  damageSupports() {
    const supports = this.getCompleteStructures().find(
      s => s instanceof CaveSupports
    );
    if (!supports) {
      return false;
    }
    supports.deteriorate(utils.random(16, 26) * DAYS);
    return true;
  }

  increaseTraverseFrequency() {}
  reduceTravFreq() {}

  cycle(seconds) {
    super.cycle(seconds);

    if (
      this.isType(NODE_TYPES.UNDERGROUND_VOLCANO) &&
      TimeCheck.timesADay((24 * HOURS) / TEMPERATURE_INTERVAL, seconds)
    ) {
      this.volcanoErupting();
    }
    if (
      this.isType(NODE_TYPES.UNDERGROUND_LAVA_PLAINS) &&
      TimeCheck.timesADay((24 * HOURS) / TEMPERATURE_INTERVAL, seconds)
    ) {
      this.coolingDown();
    }
  }

  volcanoErupting() {
    let fuelLeft = 100;
    const next = this.findNearest(
      node => !fuelLeft || node.isType(NODE_TYPES.UNDERGROUND_FLOOR),
      node => {
        if (
          node.isType(NODE_TYPES.UNDERGROUND_VOLCANO) ||
          node.isType(NODE_TYPES.UNDERGROUND_FLOOR)
        ) {
          return true;
        }
        if (
          node.isType(NODE_TYPES.UNDERGROUND_LAVA_PLAINS) &&
          fuelLeft &&
          utils.chance(70)
        ) {
          const usedFuel = Math.min(
            utils.random(15, 25),
            fuelLeft,
            100 - node.lavaAmount
          );
          fuelLeft -= usedFuel;
          node.lavaAmount += usedFuel;
          node.lavaAmount = utils.limit(node.lavaAmount, 0, 100);
          return true;
        }
      },
      10
    );
    this.temperatureSource(12);
    if (next && fuelLeft) {
      next.lavaAmount = fuelLeft;
      next.setType(NODE_TYPES.UNDERGROUND_LAVA_PLAINS);
    }
  }

  coolingDown() {
    this.lavaAmount -= utils.random(5, 10);
    if (this.lavaAmount <= 0) {
      delete this.lavaAmount;
      this.setType(NODE_TYPES.UNDERGROUND_FLOOR);
    } else {
      this.temperatureSource(6);
    }
  }
}
Object.assign(Underground.prototype, {
  travelSkill: SKILLS.SPELUNKING
});
module.exports = global.Underground = Underground;

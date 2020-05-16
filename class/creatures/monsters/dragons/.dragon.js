const Monster = require("../.monster");

// const calc = () => {
//     Entity.getEntities(Node).forEach(n => n.temperature = 0);Entity.getEntities(Node).forEach(n => n.drainage = 0);world.terraform();
//     for (let i = 0; i < 12; i ++) {world.stabiliseTemperature();Entity.getEntities(Dragon).forEach(d => d.periodic());};world.terraform();
// };

module.exports = Monster.factory(
  class Dragon extends Monster {
    cycle(seconds) {
      super.cycle(seconds);
      if (!this.isDead()) {
        this.atInterval(TEMPERATURE_INTERVAL, () => this.periodic(), seconds);
      }
    }

    getTravelTime(node) {
      return 20 * MINUTES;
    }

    periodic() {
      this.spreadTemperatureChange();
      this.spreadDrainageChange();
    }

    spreadTemperatureChange() {
      if (this.temperature) {
        this.getNode().temperatureSource(this.temperature.change);
      }
    }

    spreadDrainageChange() {
      if (this.drainage) {
        this.getNode()
          .getArea(this.drainage.range)
          .forEach(({ node, range }) => {
            const relativeRange = this.drainage.range + 1;
            const rangeModifier = (relativeRange - range) / relativeRange;
            const drainageMod = this.drainage.change * (1 + rangeModifier);
            node.modifyDrainage(TEMPERATURE_VOLATILITY * drainageMod);
          });
      }
    }
  },
  {
    name: "?Dragon?",
    // faction: Faction.getByName("Dragons"),
    maxAge: Infinity,
    bloodPool: 300,
    aggressiveness: 0,
    dodgeRating: 80,
    defaultArmor: {
      [DAMAGE_TYPES.BLUNT]: 540,
      [DAMAGE_TYPES.SLICE]: 350,
      [DAMAGE_TYPES.PIERCE]: 490
    },
    defaultWeapon: {
      name: "Claws",
      damage: {
        [DAMAGE_TYPES.BLUNT]: 185,
        [DAMAGE_TYPES.SLICE]: 215,
        [DAMAGE_TYPES.PIERCE]: 185
      },
      hitChance: 75
    },
    butcherable: {
      butcherTime: 8 * HOURS,
      produces: {
        ToughMeat: 1500,
        HeartyMeat: 500,
        MysteryMeat: 1000,
        Bone: 400,
        AncientBone: 200
      },
      butcherSkillLevel: 8
    },
    threatLevel: 3000,
    stats: {
      [STATS.STRENGTH]: 150,
      [STATS.DEXTERITY]: 80,
      [STATS.ENDURANCE]: 250,
      [STATS.PERCEPTION]: 180,
      [STATS.INTELLIGENCE]: 300
    },
    scouterMessages: [
      SCOUTER_MESSAGES.FLYING,
      SCOUTER_MESSAGES.CARCASSES_BONES,
      SCOUTER_MESSAGES.CLAW_MARKS_HUGE,
      SCOUTER_MESSAGES.SOUNDS_ROARING,
      SCOUTER_MESSAGES.SCALE_FRAGMENTS
    ]
  }
);

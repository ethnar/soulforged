const Structure = require("../.structure");
const Action = require("../../action");
const Plan = require("../../plan");

const actions = Action.groupById([
  new Action({
    name: "Build",
    icon: "/actions/icons8-home-100.png",
    valid(entity) {
      return !entity.isComplete();
    },
    available(entity, creature) {
      if (entity.toolUtility && !creature.getToolLevel(entity.toolUtility)) {
        return "You need a " + entity.toolUtility + " tool.";
      }
      const blocked = creature.accessErrorMessage(entity);
      if (blocked) return blocked;
      return true;
    },
    runCheck(entity, creature) {
      if (creature.getNode() !== entity.getNode()) {
        return "You must be in the target location";
      }

      const materials = entity.getNeededMaterials();
      const availableMaterials = creature.getMaterials(materials);
      const anyAvailable = Object.keys(availableMaterials).find(material => {
        return (
          availableMaterials[material] && availableMaterials[material].length
        );
      });
      if (!anyAvailable) {
        return "You do not have any of the required materials";
      }

      return true;
    },
    run(entity, creature, seconds) {
      const efficiency = creature.getEfficiency(
        null,
        entity.toolUtility,
        true,
        creature.getBuff(BUFFS.BUILDING) / 100
      );

      creature.actionProgress += (seconds * efficiency * 100) / entity.baseTime;

      const tool = creature.getTool();
      if (creature.isUsingTool(entity.toolUtility)) {
        tool.reduceIntegrity(0.0002);
      }

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        // remove the materials
        const materials = entity.getNeededMaterials();
        const availableMaterials = creature.getMaterials(materials);
        const materialUsed = Object.keys(availableMaterials).find(
          material => availableMaterials[material].length
        );
        availableMaterials[materialUsed].pop().useUpItem();

        // reduce materials needed
        entity.remainingMaterialsNeeded[materialUsed] -= 1;
        if (entity.remainingMaterialsNeeded[materialUsed] === 0) {
          delete entity.remainingMaterialsNeeded[materialUsed];

          if (!Object.keys(entity.getNeededMaterials()).length) {
            entity.constructionFinished();
          }
        }

        return false;
      }
      return true;
    }
  }),
  new Action({
    name: "Repair",
    icon: "/actions/icons8-home-100-build.png",
    quickAction: true,
    valid(entity) {
      if (!entity.isComplete()) {
        return false;
      }
      const materials = entity.getNeededMaterials();
      if (!materials) {
        return false;
      }
      if (!Object.keys(materials).length) {
        return false;
      }
      return true;
    },
    available(entity, creature) {
      if (!creature.getToolLevel(entity.getRepairToolUtility())) {
        return "You need a " + entity.getRepairToolUtility() + " tool.";
      }
      return true;
    },
    runCheck(entity, creature) {
      const blocked = creature.accessErrorMessage(entity);
      if (blocked) return blocked;

      if (creature.getNode() !== entity.getNode()) {
        return "You must be in the target location";
      }

      if (!entity.placement.includes(entity.getNode().getType())) {
        return "You cannot repair this structure in this terrain.";
      }

      if (entity.getNode().buildingsDisallowed) {
        return "You cannot repair this structure here.";
      }

      const materials = entity.getNeededMaterials();
      const availableMaterials = creature.getMaterials(materials);
      const anyAvailable = Object.keys(availableMaterials).find(material => {
        return (
          availableMaterials[material] && availableMaterials[material].length
        );
      });
      if (!anyAvailable) {
        return "You do not have any of the required materials";
      }
      return true;
    },
    run(entity, creature, seconds) {
      const efficiency = creature.getEfficiency(
        null,
        entity.getRepairToolUtility(),
        true,
        creature.getBuff(BUFFS.BUILDING) / 100
      );

      creature.actionProgress +=
        (seconds * efficiency * 100) / entity.getRepairTime();

      const tool = creature.getTool();
      if (creature.isUsingTool(entity.getRepairToolUtility())) {
        tool.reduceIntegrity(0.0002);
      }

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        // remove the materials
        const materials = entity.getNeededMaterials();
        const availableMaterials = creature.getMaterials(materials);
        const materialUsed = Object.keys(availableMaterials).find(
          material => availableMaterials[material].length
        );
        availableMaterials[materialUsed].pop().useUpItem();

        // reduce materials needed
        entity.remainingMaterialsNeeded[materialUsed] -= 1;
        if (entity.remainingMaterialsNeeded[materialUsed] === 0) {
          delete entity.remainingMaterialsNeeded[materialUsed];
        }

        if (Object.keys(entity.remainingMaterialsNeeded).length === 0) {
          entity.integrity = 100;
        } else {
          const matsLimit = entity.getFullRepairMatsCount();
          entity.integrity = utils.limit(
            entity.integrity + 100 / matsLimit,
            0,
            100
          );
        }

        return false;
      }
      return true;
    }
  }),
  new Action({
    name: "Clean up rubble",
    icon: "/actions/icons8-home-sword.png",
    dynamicLabel(entity) {
      return `${this.name} (${100 - Math.ceil(entity.integrity)}%)`;
    },
    valid(entity) {
      if (!entity.isComplete()) {
        return false;
      }
      if (!entity.demolishCondition || !entity.demolishCondition()) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (creature.getNode() !== entity.getNode()) {
        return "You must be in the target location";
      }
      // if (!creature.getToolLevel(entity.toolUtility)) {
      //     return 'You need a ' + entity.toolUtility + ' tool.';
      // }

      return true;
    },
    run(entity, creature, seconds) {
      const efficiency = creature.getEfficiency(null, entity.toolUtility);

      creature.actionProgress +=
        (seconds * efficiency) / (entity.baseTime / (100 * 100));

      // const tool = creature.getTool();
      // if (tool && entity.toolUtility) {
      //     tool.reduceIntegrity(0.002);
      // }

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        entity.damageBuilding(1);

        if (entity.baseConstructor) {
          const materials = global[entity.baseConstructor].prototype.materials;
          const totalMatsCount = entity.getTotalMatsCount(materials);
          if (utils.chance(totalMatsCount * 0.05, 1, 3)) {
            let roll = utils.random(1, totalMatsCount);
            const rolledItem = Object.keys(materials).find(item => {
              roll -= materials[item];
              return roll <= 0;
            });

            if (rolledItem) {
              creature.addItemByType(global[rolledItem]);
              creature.logging(
                `You salvaged some ${global[
                  rolledItem
                ].getName()} from ${entity.getName()}`
              );
            }
          }
        }

        return false;
      }
      return true;
    }
  })
]);

class Building extends Structure {
  static actions() {
    return { ...actions, ...Structure.actions() };
  }

  constructor(args) {
    super(args);

    this.roomNode = null;
    this.integrity = 100;

    this.complete = false;
    this.remainingMaterialsNeeded = {
      ...this.getMaterials()
    };
  }

  getConstructionUtility() {
    return this.toolUtility;
  }

  getCompleteness() {
    const stillRequired = Object.values(this.remainingMaterialsNeeded).reduce(
      (acc, item) => acc + item,
      0
    );
    const totalNeeded = utils.totalMaterialCount(this.getMaterials());

    return (100 * (totalNeeded - stillRequired)) / totalNeeded;
  }

  getMaterials() {
    return this.materials;
  }

  isComplete() {
    return this.complete;
  }

  getRoomNode() {
    return this.roomNode;
  }

  setRoomNode(roomNode) {
    this.roomNode = roomNode;
  }

  constructionFinished() {
    this.complete = true;
    this.integrity = 100;

    if (this.obsoletes) {
      this.getNode()
        .getAllStructures()
        .forEach(structure => {
          if (this.obsoletes.includes(structure.constructor.name)) {
            utils.log(
              structure.constructor.name,
              "is being removed as obsolete"
            );
            structure.destroy(true);
          }
        });
    }

    return this;
  }

  cycle(seconds) {
    super.cycle(seconds);
    this.deteriorate(seconds);
  }

  earthQuakeDamage(multiplier = 1) {
    this.deteriorate(multiplier);
  }

  deteriorate(multiplier = 1) {
    this.damageBuilding((multiplier * 100) / this.deteriorationRate);
  }

  getTotalMatsCount(materials) {
    return Object.values(materials).reduce((acc, qty) => acc + qty, 0);
  }

  getFullRepairMatsCount() {
    return Math.floor(
      this.getTotalMatsCount(this.getRepairMaterials()) / BUILD_TO_REPAIR_RATIO
    );
  }

  getRepairMaterials() {
    // return this.getMaterials() || {};
    return (this.repair && this.repair.materials) || this.getMaterials() || {};
  }

  getRepairToolUtility() {
    return null;
    // const designated = this.repair && this.repair.toolUtility;
    // return designated || designated === null ? designated : this.toolUtility;
  }

  getRepairTime() {
    return 3;
    // return (this.repair && this.repair.baseTime) || this.baseTime / 2;
  }

  getTotalBuildTime() {
    const matsCount = Object.values(this.materials || {}).reduce(
      (acc, i) => acc + i,
      0
    );
    return matsCount * this.baseTime;
  }

  damageBuilding(damage) {
    const materials = this.getRepairMaterials();
    const totalMatsCount = this.getTotalMatsCount(materials);
    const matsLimit = this.getFullRepairMatsCount();

    const matsBeforeDamage = Math.floor(
      ((100 - this.integrity) * matsLimit) / 100
    );

    this.integrity -= damage;
    this.integrity = utils.limit(this.integrity, 0, 100);

    const matsAfterDamage = Math.floor(
      ((100 - this.integrity) * matsLimit) / 100
    );

    let matsNeeded = Math.max(matsAfterDamage - matsBeforeDamage, 0);

    if (Object.keys(materials).length && this.isComplete()) {
      while (matsNeeded > 0) {
        matsNeeded -= 1;
        let roll = utils.random(1, totalMatsCount);
        const rolledItem = Object.keys(materials).find(item => {
          roll -= materials[item];
          return roll <= 0;
        });

        if (!rolledItem) {
          utils.error(
            "Could not add a required material, options were:",
            JSON.stringify(materials),
            "roll:",
            roll
          );
          break;
        }

        this.remainingMaterialsNeeded[rolledItem] =
          this.remainingMaterialsNeeded[rolledItem] || 0;
        this.remainingMaterialsNeeded[rolledItem] += 1;
      }
    }

    if (!this.integrity) {
      utils.log("Building destroyed", this.getName());
      this.destroy();
    }
  }

  destroy(noRuin = false) {
    if (!this.noRuins && !noRuin) {
      const ruin = new Ruins();
      ruin.name = `Ruins (${this.getName()})`;
      ruin.baseTime = this.getTotalBuildTime() / 2;
      ruin.deteriorationRate = ruin.baseTime * 400;
      ruin.baseConstructor = this.constructor.name;
      this.getNode().addStructure(ruin);
    }
    super.destroy();
  }

  getSimplePayload(creature, node) {
    const result = super.getSimplePayload(creature, node);
    result.integrity = utils.approximateIntegrity(this.integrity);
    return result;
  }

  getPayload(creature) {
    return {
      ...super.getPayload(creature),
      complete: this.isComplete()
    };
  }

  static buildingFactory(classCtr, props) {
    if (props.materials && props.research && props.research.sameAsCrafting) {
      props.research.materials = {
        ...(props.research.materials || {}),
        ...props.materials
      };
    }

    global[classCtr.name] = classCtr;
    Object.assign(classCtr.prototype, props);
    classCtr.recipe = global[classCtr.name].planFactory();
    return classCtr;
  }

  static planFactory() {
    return new Plan({
      id: this.name,
      name: this.prototype.name,
      dynamicName: this.prototype.dynamicName,
      research: this.prototype.research,
      buildClassName: this.name,
      materials: this.prototype.materials,
      defaultRepetitions: utils.totalMaterialCount(this.prototype.materials),
      getAnythingPotentiallyBlocking: this.prototype
        .getAnythingPotentiallyBlocking
    });
  }
}
Object.assign(Building.prototype, {
  deteriorationRate: 2 * MONTHS,
  toolUtility: null,
  order: 25,
  placement: [
    // NODE_TYPES.COAST,
    // NODE_TYPES.TROPICAL_PLAINS,
    NODE_TYPES.DESERT_GRASS,
    NODE_TYPES.DESERT_SAND,
    // NODE_TYPES.BOG,
    NODE_TYPES.PLAINS,
    NODE_TYPES.SCRUB_LAND,
    NODE_TYPES.SNOW_FIELDS,
    NODE_TYPES.PLAINS_SNOW,
    NODE_TYPES.COLD_DIRT
    // NODE_TYPES.JUNGLE,
    // NODE_TYPES.SAVANNAH,
    // NODE_TYPES.CACTI,
    // NODE_TYPES.SWAMP,
    // NODE_TYPES.BROADLEAF_FOREST,
    // NODE_TYPES.DESERT_PALMS,
    // NODE_TYPES.CONIFEROUS_FOREST_SNOWED,
    // NODE_TYPES.CONIFEROUS_FOREST_COLD,
    // NODE_TYPES.CONIFEROUS_FOREST,
    // NODE_TYPES.HILLS_DIRT,
    // NODE_TYPES.HILLS_GRASS,
    // NODE_TYPES.HILLS_SNOW,
    // NODE_TYPES.HILLS_COLD,
    // NODE_TYPES.MOUNTAINS_SNOW,
    // NODE_TYPES.MOUNTAINS_COLD,
    // NODE_TYPES.MOUNTAINS_DIRT,
  ]
});
module.exports = global.Building = Building;

const Ruins = require("./ruins");

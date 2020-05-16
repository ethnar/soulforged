const Building = require("../.building");

const cache = {};
function getGatherActions(collectables) {
  return collectables.map(collectable => {
    if (!cache[collectable.name]) {
      cache[collectable.name] = new Action({
        name: `Collect (${collectable.getName()})`,
        icon: "/actions/icons8-receive-cash-100.png",
        quickAction: true,
        secondaryAction: true,
        valid(building) {
          if (building.getProduceCount(collectable) <= 0) {
            return false;
          }
          if (!building.isComplete()) {
            return false;
          }
          return true;
        },
        available(building, creature) {
          const blocked = creature.accessErrorMessage(building);
          if (blocked) return blocked;
          return true;
        },
        runCheck(building, creature) {
          const containerItemType = collectable.getContainerItemType();
          if (
            containerItemType &&
            !creature.hasItemType(containerItemType.name)
          ) {
            return `You need a ${containerItemType.getName()} for this`;
          }
          return true;
        },
        run(building, creature, seconds) {
          creature.actionProgress +=
            (seconds * 100 * creature.getEfficiency()) / (20 * SECONDS);

          if (creature.actionProgress >= 100) {
            creature.addItem(
              new collectable({
                qty: 1,
                integrity: building.animalsFeedlevel
              })
            );

            const containerItemType = collectable.getContainerItemType();
            if (containerItemType) {
              creature.spendMaterials({
                [containerItemType.name]: 1
              });
            }

            building.removeProduce(collectable, 1);

            creature.actionProgress -= 100;
            return false;
          }
          return true;
        }
      });
    }
    return cache[collectable.name];
  });
}

const actions = Action.groupById([
  ...Object.values(Building.actions()),
  new Action({
    name: "Add breeding animals",
    icon: "/actions/icons8-forward-arrow-100-in.png",
    secondaryAction: true,
    valid(building, creature) {
      if (!building.isComplete()) {
        return false;
      }
      return true;
    },
    available(building, creature) {
      const blocked = creature.accessErrorMessage(building);
      if (blocked) return blocked;
      return true;
    },
    runCheck(building, creature) {
      const maxBreedingAnimals = building.animalPen.maxBreedingAnimals;
      if (building.getBreedingAnimalsCount() >= maxBreedingAnimals) {
        return `The building is full`;
      }
      const type = building.getBreedingAnimalType();
      if (!creature.hasItemType(type.name)) {
        return `You need ${type.getName()} to place them here`;
      }
      return true;
    },
    run(building, creature, seconds) {
      creature.actionProgress += (seconds * 100) / (5 * SECONDS);
      const type = building.getBreedingAnimalType();

      if (creature.actionProgress >= 100) {
        let chicken = creature.getItemsByType(type).pop();
        if (!chicken) {
          chicken = creature
            .getHome()
            .getItemsByType(type)
            .pop();
        }
        if (chicken.qty > 1) {
          chicken = chicken.split(1);
        }
        building.addBreedingAnimal(chicken.integrity);

        chicken.destroy();

        creature.actionProgress -= 100;
        return false;
      }
      return true;
    }
  }),
  new Action({
    name: `Remove breeding animals`,
    icon: "/actions/icons8-forward-arrow-100-out.png",
    secondaryAction: true,
    valid(building) {
      if (!building.isComplete()) {
        return false;
      }
      return true;
    },
    available(building, creature) {
      const blocked = creature.accessErrorMessage(building);
      if (blocked) return blocked;
      return true;
    },
    runCheck(building, creature) {
      const blocked = creature.accessErrorMessage(building);
      if (blocked) return blocked;
      if (building.getBreedingAnimalsCount() <= 0) {
        return `There are no more animals to take`;
      }
      const containerItemType = building
        .getBreedingAnimalType()
        .getContainerItemType();
      if (containerItemType && !creature.hasItemType(containerItemType.name)) {
        return `You need a ${containerItemType.getName()} for this`;
      }
      return true;
    },
    run(building, creature, seconds) {
      creature.actionProgress +=
        (seconds * 100 * creature.getEfficiency()) / (5 * MINUTES);
      const type = building.getBreedingAnimalType();

      if (creature.actionProgress >= 100) {
        creature.addItem(
          new type({
            qty: 1,
            integrity: building.animalsFeedlevel
          })
        );

        const containerItemType = type.getContainerItemType();
        if (containerItemType) {
          creature.spendMaterials({
            [containerItemType.name]: 1
          });
        }

        building.removeBreedingAnimal(creature);

        creature.actionProgress -= 100;
        return false;
      }
      return true;
    }
  }),
  new Action({
    name: "Add fodder",
    icon: "/actions/icons8-wheat-100.png",
    quickAction: true,
    valid(building, creature) {
      if (!building.isComplete()) {
        return false;
      }
      return true;
    },
    available(building, creature) {
      const blocked = creature.accessErrorMessage(building);
      if (blocked) return blocked;
      return true;
    },
    runCheck(building, creature) {
      const type = building.getFoodType();
      if (!creature.hasItemType(type.name)) {
        return `You need ${type.getName()} to feed the animals`;
      }
      const maxFood = building.animalPen.maxFood;
      if (building.getFoodCount() >= maxFood) {
        return `The feeder is full`;
      }
      return true;
    },
    run(building, creature, seconds) {
      creature.actionProgress += seconds * 100;
      const type = building.getFoodType();

      if (creature.actionProgress >= 100) {
        creature.spendMaterials({
          [type.name]: 1
        });
        building.foodCount += 1;

        creature.actionProgress -= 100;
        return false;
      }
      return true;
    }
  })
]);

class AnimalPen extends Building {
  static actions() {
    const gatherActions = Action.groupById(
      getGatherActions(this.prototype.animalPen.collectables)
    );
    return { ...actions, ...gatherActions };
  }

  constructor(args) {
    super(args);
    this.breedingAnimals = 0;
    this.products = {};
    this.animalsFeedlevel = 0;
    this.foodCount = 0;
  }

  getBreedingAnimalType() {
    return this.animalPen.breedingAnimalType;
  }

  getDeadAnimalType() {
    return this.animalPen.deadAnimal;
  }

  addBreedingAnimal(integrity) {
    const totalAnimals = this.getBreedingAnimalsCount();
    this.breedingAnimals = this.breedingAnimals || 0;
    this.breedingAnimals += 1;

    this.animalsFeedlevel =
      (this.animalsFeedlevel * totalAnimals + integrity) / (totalAnimals + 1);
  }

  removeBreedingAnimal(creature) {
    this.breedingAnimals = this.breedingAnimals || 0;
    this.breedingAnimals -= 1;
  }

  getBreedingAnimalsCount(creature = null) {
    return this.breedingAnimals || 0;
  }

  addProduce(type, count) {
    this.products[type.name] = this.products[type.name] || 0;
    this.products[type.name] += count;
  }

  removeProduce(type, count = 1) {
    this.products[type.name] = this.products[type.name] || 0;
    this.products[type.name] -= count;
    if (!this.products[type.name]) {
      delete this.products[type.name];
    }
  }

  reduceProduce(type, count) {
    this.products[type.name] = this.products[type.name] || 0;
    this.products[type.name] -= count;
    this.products[type.name] = Math.max(0, this.products[type.name]);
    if (!this.products[type.name]) {
      delete this.products[type.name];
    }
  }

  getProduceCount(type) {
    return this.products[type.name] || 0;
  }

  getFoodCount() {
    return this.foodCount;
  }

  getFoodType() {
    return this.getBreedingAnimalType().getFoodType();
  }

  getFoodNeededPerAnimal() {
    const animalType = this.getBreedingAnimalType();
    return animalType.getFoodAmount();
  }

  getAnimalTimeAlive() {
    const animalType = this.getBreedingAnimalType();
    return animalType.prototype.expiresIn;
  }

  cycle(seconds) {
    super.cycle(seconds);

    this.progressHunger(seconds);
  }

  progressHunger(seconds) {
    const animals =
      this.getBreedingAnimalsCount() +
      this.getProduceCount(this.getBreedingAnimalType());
    if (animals) {
      this.foodCount = this.foodCount || 0;
      this.animalsFeedlevel = this.animalsFeedlevel || 0;

      this.animalsFeedlevel -= (seconds * 100) / this.getAnimalTimeAlive();

      const foodConsumed = Math.min(
        Math.floor(
          ((100 - this.animalsFeedlevel) *
            this.getFoodNeededPerAnimal() *
            animals) /
            100
        ),
        this.getFoodCount()
      );

      this.foodCount -= foodConsumed;
      this.animalsFeedlevel +=
        (100 * foodConsumed) / (this.getFoodNeededPerAnimal() * animals);

      if (this.animalsFeedlevel <= 0) {
        this.killOffAllAnimals();
      }
    }
  }

  killOffAllAnimals() {
    const breedingType = this.getBreedingAnimalType();
    const animals =
      this.getBreedingAnimalsCount() + this.getProduceCount(breedingType);
    this.breedingAnimals = 0;
    this.products[breedingType.name] = 0;
    delete this.products[breedingType.name];
    this.getNode().addItemByType(this.getDeadAnimalType(), animals);
  }

  getPayload(creature) {
    const result = super.getPayload(creature);
    const breedingAnimalsCount = this.getBreedingAnimalsCount();
    if (this.isComplete()) {
      result.listedItems = {
        ...result.listedItems,
        "Breeding animals": [
          {
            name: this.getBreedingAnimalType().getName(),
            item: this.getBreedingAnimalType().prototype.sourceResource.getPayload(
              creature
            ),
            qty: breedingAnimalsCount,
            integrity: breedingAnimalsCount
              ? utils.approximateIntegrity(this.animalsFeedlevel)
              : 0,
            integrityType: "living"
          }
        ],
        "Animal fodder": [
          {
            name: this.getFoodType().getName(),
            item: this.getFoodType().getPayload(creature),
            qty: this.getFoodCount()
          }
        ],
        Produce: Object.keys(utils.cleanup(this.products)).map(
          productClassName => ({
            name: global[productClassName].getName(),
            item: global[productClassName].prototype.sourceResource
              ? global[productClassName].prototype.sourceResource.getPayload(
                  creature
                )
              : global[productClassName].getPayload(creature),
            qty: this.products[productClassName]
          })
        )
      };
    }
    return result;
  }

  destroy() {
    super.destroy();
    this.killOffAllAnimals();
  }
}

Building.buildingFactory(AnimalPen, {
  name: "?AnimalPen?",
  order: 15
});
module.exports = global.AnimalPen = AnimalPen;

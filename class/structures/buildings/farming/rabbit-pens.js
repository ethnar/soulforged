const AnimalPen = require("./.animal-pen");
require("../../../resources/popping/animals/rabbits");

class RabbitPens extends AnimalPen {
  cycle(seconds) {
    super.cycle(seconds);

    this.eggHatchingProgress = this.eggHatchingProgress || [];
    if (TimeCheck.atHour(8, seconds)) {
      const breedingRabbits = this.getBreedingAnimalsCount();
      if (breedingRabbits >= 2) {
        const qty = utils.random(0, Math.round(breedingRabbits * 2));
        if (qty > 0) {
          this.addProduce(CapturedRabbit, qty);
        }
      }
    }
  }
}
Building.buildingFactory(RabbitPens, {
  dynamicName: () => `${Nameable.getName("Rabbits")} Pens`,
  baseTime: 8 * MINUTES,
  icon: `/${ICONS_PATH}/resources/popping/animals/rabbit7.png`,
  deteriorationRate: 60 * DAYS,
  research: {
    materials: {
      WoodenBeam: 0,
      WoodenPlank: 0,
      CageTrap: 0,
      ResearchConcept_RabbitBreeding: 0
    }
  },
  animalPen: {
    breedingAnimalType: CapturedRabbit,
    deadAnimal: Rabbit,
    maxBreedingAnimals: 20,
    maxFood: 20,
    collectables: [CapturedRabbit]
  },
  toolUtility: TOOL_UTILS.HAMMER,
  materials: {
    WoodenBeam: 15,
    WoodenPlank: 40,
    CageTrap: 20
  }
});

new ResearchConcept({
  dynamicName: () => `${Nameable.getName("Rabbits")} Breeding`,
  className: "ResearchConcept_RabbitBreeding",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [ResearchConcept.knownItem("CapturedRabbit")]
});

module.exports = global.RabbitPens = RabbitPens;

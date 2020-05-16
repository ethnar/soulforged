const AnimalPen = require("./.animal-pen");
require("../../../resources/popping/animals/chickens");

class ChickenCoop extends AnimalPen {
  cycle(seconds) {
    super.cycle(seconds);

    this.eggHatchingProgress = this.eggHatchingProgress || [];
    if (TimeCheck.atHour(8, seconds)) {
      this.breeding();
    }
  }

  breeding() {
    const eggsCount = this.getProduceCount(ChickenEgg);
    const breedingChickens = this.getBreedingAnimalsCount();
    if (breedingChickens >= 1) {
      let remainingEggs = Math.min(eggsCount, breedingChickens * 3);
      this.eggHatchingProgress = this.eggHatchingProgress
        .reverse()
        .map(eggCounts => {
          const newAmount = Math.min(eggCounts, remainingEggs);
          remainingEggs -= newAmount;
          return newAmount;
        })
        .reverse();

      this.eggHatchingProgress.unshift(remainingEggs);

      if (this.eggHatchingProgress.length > 3) {
        const hatching = this.eggHatchingProgress.pop();
        if (hatching > 0) {
          this.reduceProduce(ChickenEgg, hatching);
          this.addProduce(CapturedChicken, hatching);
        }
      }
    }
    const qty = utils.random(0, Math.round(breedingChickens / 2));
    if (qty > 0) {
      this.addProduce(ChickenEgg, qty);
    }
  }
}
Building.buildingFactory(ChickenCoop, {
  dynamicName: () => `${Nameable.getName("Chickens")} Coop`,
  baseTime: 8 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/farming/greenland_sgi_152_chicken.png`,
  deteriorationRate: 60 * DAYS,
  research: {
    materials: {
      WoodenBeam: 0,
      WoodenPlank: 0,
      ResearchConcept_ChickenBreeding: 0
    }
  },
  animalPen: {
    breedingAnimalType: CapturedChicken,
    deadAnimal: Chicken,
    maxBreedingAnimals: 20,
    maxFood: 200,
    collectables: [ChickenEgg, CapturedChicken]
  },
  toolUtility: TOOL_UTILS.HAMMER,
  materials: {
    WoodenBeam: 20,
    WoodenPlank: 60
  }
});

new ResearchConcept({
  dynamicName: () => `${Nameable.getName("Chickens")} Breeding`,
  className: "ResearchConcept_ChickenBreeding",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [ResearchConcept.knownItem("CapturedChicken")]
});

module.exports = global.ChickenCoop = ChickenCoop;

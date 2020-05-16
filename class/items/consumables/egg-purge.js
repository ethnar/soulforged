const Drink = require("./.drink");

const container = "ClayFlask";

class EggPurge extends Drink {
  consumed(creature) {
    const eggs = creature
      .getNode()
      .getCompleteStructures()
      .find(s => s instanceof GreenEggs);

    const messagePartOne = `As you pour the substance out of the flask a delicate mist spreads around you.`;

    if (eggs) {
      eggs.destroy();
      creature.logging(
        messagePartOne +
          ` It seems to spread toward the eggs, turning them black and void of life.`,
        LOGGING.GOOD
      );
      return;
    }
    creature.logging(
      messagePartOne +
        ` It drifts above the ground for a brief moment, only to completely dissipate soon after.`,
      LOGGING.NORMAL
    );
  }
}
Item.itemFactory(EggPurge, {
  nameable: true,
  consumeAction: "Pour",
  icon: `/${ICONS_PATH}/items/alchemy/bottle_02_red.png`,
  timeToDrink: 1,
  weight: 0.3,
  containerItemType: global[container],
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      AlchemyIng1_4: 2,
      AlchemyIng2_2: 2,
      AlchemyIng3_3: 2,
      AlchemyIng3_5: 2,
      Ruby: 1,
      [container]: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 5,
    baseTime: 60 * MINUTES
  }
});

const MeltedMetal = require("./melted-metal");

const TOTAL = 4;
const RATIO = 1;
class MeltedBronze extends MeltedMetal {}
Item.itemFactory(MeltedBronze, {
  nameable: true,
  name: "Bronze",
  dynamicName: () => `Melted ${Nameable.getName("MeltedBronze")}`,
  icon: `/${ICONS_PATH}/items/metal/146_b_crucible_bronze.png`,
  expiresIn: 2 * HOURS,
  expiresInto: {
    BronzeInCrucible: 1
  },
  weight: 2.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    dynamicName: () => `Melt ${Nameable.getName("MeltedBronze")}`,
    materials: {
      MeltedCopper: TOTAL - RATIO,
      MeltedTin: RATIO,
      Coal: 1
    },
    result: {
      MeltedBronze: TOTAL
    },
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    building: ["Kiln"],
    baseTime: 12 * MINUTES,
    onSuccess(creature) {
      creature.spendMaterials({
        Crucible: TOTAL
      });
    }
  }
});

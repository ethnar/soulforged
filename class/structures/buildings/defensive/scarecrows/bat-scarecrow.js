const Scarecrow = require("./.scarecrow");
const SwarmerBat = require("../../../../creatures/monsters/animals/swarmer-bat");

class BatScarecrow extends Scarecrow {}
Building.buildingFactory(BatScarecrow, {
  name: "Bat Mawkin",
  scaresMonsters: SwarmerBat,
  baseTime: 5 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/defensive/sgi_92_totem_bat.png`,
  research: {
    materials: {
      WoodenShaft: 0,
      LeatherRope: 0,
      BatWing: 0,
      Bone: 0
    }
  },
  materials: {
    WoodenShaft: 1,
    LeatherRope: 1,
    BatWing: 4,
    Bone: 3
  },
  placement: [NODE_TYPES.UNDERGROUND_CAVE, NODE_TYPES.UNDERGROUND_FLOOR]
});

module.exports = global.BatScarecrow = BatScarecrow;

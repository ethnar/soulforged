const MedicalItem = require("./.medical-item");

class BurnsBalm extends MedicalItem {}
Item.itemFactory(BurnsBalm, {
  name: "Soothing Balm",
  icon: `/${ICONS_PATH}/items/equipment/medicine/sgi_98.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.25,
  containerItemType: ClayPot,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WhisperLily: 2,
      AlchemyIng1_3: 1,
      ClayPot: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 1,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 20 * MINUTES,
    level: 4
  },
  sourceBuff: "BuffBurn",
  maxBatch: 8,
  skillLevel: 3,
  applicationTime: 2 * MINUTES,
  skillGainMultiplier: 10,
  transformBuff: (creature, stacks, oldBuff) => {
    creature.addBuff(BuffBurnSoothingBalm, {
      duration: (oldBuff.duration * 3) / 4,
      stacks: stacks,
      effects: {
        [BUFFS.STATS.ENDURANCE]: -(stacks / 10),
        [BUFFS.STATS.STRENGTH]: -(stacks / 10),
        [BUFFS.PAIN]: stacks / 3
      }
    });
  }
});
module.exports = global.BurnsBalm = BurnsBalm;

class BuffBurnSoothingBalm extends Buff {}
Object.assign(BuffBurnSoothingBalm.prototype, {
  name: `Burn (${BurnsBalm.getName()})`,
  icon: `/${ICONS_PATH}/creatures/spellbook01_58_healed.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBurnSoothingBalm = BuffBurnSoothingBalm;

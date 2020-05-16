const MedicalItem = require("./.medical-item");

class BuffBruiseCuringBalm extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffSwelling, this.getStacks() / 3);
    return true;
  }
}
Object.assign(BuffBruiseCuringBalm.prototype, {
  name: "Bruise (Curing Balm)",
  icon: `/${ICONS_PATH}/creatures/yellow_17_healed2.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBruiseCuringBalm = BuffBruiseCuringBalm;

class CuringBalm extends MedicalItem {}
Item.itemFactory(CuringBalm, {
  name: "Curing Balm",
  icon: `/${ICONS_PATH}/items/equipment/medicine/powder_b_01.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.25,
  containerItemType: ClayPot,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilverNettle: 2,
      SpiderLeg: 1,
      ClayPot: 1
    },
    skill: SKILLS.ALCHEMY,
    skillLevel: 1,
    // toolUtility: TOOL_UTILS.MILLING,
    baseTime: 30 * MINUTES,
    level: 2
  },
  sourceBuff: "BuffBruise",
  maxBatch: 15,
  skillLevel: 1,
  applicationTime: 2 * MINUTES,
  skillGainMultiplier: 10,
  transformBuff: (creature, stacks, oldBuff) => {
    creature.addBuff(BuffBruiseCuringBalm, {
      duration: oldBuff.duration / 2,
      stacks: stacks,
      effects: {
        [BUFFS.PAIN]: stacks,
        [BUFFS.MOOD]: -stacks / 5,
        [BUFFS.INTERNAL_DAMAGE]: stacks / 20
      }
    });
  }
});
module.exports = global.Bandage = CuringBalm;

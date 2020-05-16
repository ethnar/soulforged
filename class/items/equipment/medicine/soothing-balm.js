const MedicalItem = require("./.medical-item");

class SoothingBalm extends MedicalItem {}
Item.itemFactory(SoothingBalm, {
  name: "Palliative Balm",
  icon: `/${ICONS_PATH}/items/equipment/medicine/am_b_08.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.25,
  containerItemType: ClayPot,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilverNettle: 2,
      Bitterweed: 1,
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
    creature.addBuff(BuffBruiseSoothingBalm, {
      duration: oldBuff.duration,
      stacks: stacks,
      effects: {
        [BUFFS.PAIN]: stacks / 2,
        [BUFFS.INTERNAL_DAMAGE]: stacks / 10
      }
    });
  }
});
module.exports = global.Bandage = SoothingBalm;

class BuffBruiseSoothingBalm extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffSwelling, this.getStacks());
    return true;
  }
}
Object.assign(BuffBruiseSoothingBalm.prototype, {
  name: `Bruise (${SoothingBalm.getName()})`,
  icon: `/${ICONS_PATH}/creatures/yellow_17_healed2.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBruiseSoothingBalm = BuffBruiseSoothingBalm;

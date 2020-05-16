const MedicalItem = require("./.medical-item");

class BuffCutSimpleBandage extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffScar, this.getStacks() / 2);
    return true;
  }
}
Object.assign(BuffCutSimpleBandage.prototype, {
  name: "Cut (Simple Bandage)",
  icon: `/${ICONS_PATH}/creatures/spellbook01_73_healed.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffCutSimpleBandage = BuffCutSimpleBandage;

class SimpleBandage extends MedicalItem {}
Item.itemFactory(SimpleBandage, {
  name: "Simple Bandage",
  icon: `/${ICONS_PATH}/items/equipment/medicine/ni_b_13.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenCloth: 1
    },
    result: {
      SimpleBandage: 3
    },
    skill: SKILLS.DOCTORING,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 10 * MINUTES,
    level: 2
  },
  sourceBuff: "BuffCut",
  maxBatch: 10,
  skillLevel: 2,
  skillGainMultiplier: 10,
  transformBuff: (creature, stacks, oldBuff) => {
    creature.addBuff(BuffCutSimpleBandage, {
      duration: (oldBuff.duration * 2) / 3,
      stacks: stacks,
      effects: {
        [BUFFS.PAIN]: stacks / 4,
        [BUFFS.BLEEDING]: stacks / 10
      }
    });
  }
});
module.exports = global.Bandage = SimpleBandage;

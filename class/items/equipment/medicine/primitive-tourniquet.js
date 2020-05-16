const MedicalItem = require("./.medical-item");

class BuffCutPrimitiveTourniquet extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffScar, this.getStacks());
    return true;
  }
}
Object.assign(BuffCutPrimitiveTourniquet.prototype, {
  name: "Cut (Primitive Tourniquet)",
  icon: `/${ICONS_PATH}/creatures/spellbook01_73_healed.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffCutPrimitiveTourniquet = BuffCutPrimitiveTourniquet;

class PrimitiveTourniquet extends MedicalItem {}
Item.itemFactory(PrimitiveTourniquet, {
  name: "Primitive Tourniquet",
  icon: `/${ICONS_PATH}/items/equipment/medicine/loop_b_01.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 40 * SECONDS
  },
  sourceBuff: "BuffCut",
  maxBatch: 20,
  skillLevel: -1,
  skillGainMultiplier: 10,
  transformBuff: (creature, stacks, oldBuff) => {
    creature.addBuff(BuffCutPrimitiveTourniquet, {
      duration: (oldBuff.duration * 3) / 4,
      stacks: stacks,
      effects: {
        [BUFFS.PAIN]: (stacks * 2) / 3,
        [BUFFS.BLEEDING]: stacks / 5
      }
    });
  }
});
module.exports = global.PrimitiveTourniquet = PrimitiveTourniquet;

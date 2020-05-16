const MedicalItem = require("./.medical-item");

class BuffBrokenBonePrimitiveSplint extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffSwelling, 40);
    this.getCreature().possibleInjury(BuffBadKnee, 3);
    return true;
  }
}
Object.assign(BuffBrokenBonePrimitiveSplint.prototype, {
  name: "Broken bone (Primitive Splint)",
  icon: `/${ICONS_PATH}/creatures/spellbook01_43_healed.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBrokenBonePrimitiveSplint = BuffBrokenBonePrimitiveSplint;

class PrimitiveSplint extends MedicalItem {}
Item.itemFactory(PrimitiveSplint, {
  name: "Primitive Splint",
  icon: `/${ICONS_PATH}/items/equipment/medicine/sticks_b_01.png`,
  order: ITEMS_ORDER.MEDICINE,
  autoCalculateWeight: true,
  autoCalculateWeightMult: 0.95,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 1,
      WoodenShaft: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.WOODCUTTING,
    baseTime: 30 * MINUTES
  },
  sourceBuff: "BuffBrokenBone",
  maxBatch: 1,
  skillLevel: 0,
  skillGainMultiplier: 50,
  transformBuff: (creature, stacks, oldBuff) => {
    creature.addBuff(BuffBrokenBonePrimitiveSplint, {
      duration: oldBuff.duration / 4,
      stacks: stacks,
      effects: {
        [BUFFS.PAIN]: oldBuff.effects[BUFFS.PAIN] * 0.5,
        [BUFFS.STATS.DEXTERITY]: oldBuff.effects[BUFFS.STATS.DEXTERITY] * 0.5,
        [BUFFS.STATS.STRENGTH]: oldBuff.effects[BUFFS.STATS.STRENGTH] * 0.5
      }
    });
  }
});
module.exports = global.PrimitiveSplint = PrimitiveSplint;

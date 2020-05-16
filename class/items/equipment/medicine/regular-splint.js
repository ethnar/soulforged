const MedicalItem = require("./.medical-item");

class BuffBrokenBoneRegularSplint extends Buff {
  expired() {
    this.getCreature().possibleInjury(BuffSwelling, 50);
    this.getCreature().possibleInjury(BuffBadKnee, 2);
    return true;
  }
}
Object.assign(BuffBrokenBoneRegularSplint.prototype, {
  name: "Broken bone (Splint)",
  icon: `/${ICONS_PATH}/creatures/spellbook01_43_healed.png`,
  category: Buff.CATEGORIES.WOUND,
  visible: true
});
global.BuffBrokenBoneRegularSplint = BuffBrokenBoneRegularSplint;

class RegularSplint extends MedicalItem {}
Item.itemFactory(RegularSplint, {
  name: "Splint",
  icon: `/${ICONS_PATH}/items/equipment/medicine/sticks_b_01_dark.png`,
  order: ITEMS_ORDER.MEDICINE,
  weight: 0.6,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeatherRope: 1,
      HardwoodShaft: 1
    },
    toolUtility: TOOL_UTILS.WOODCUTTING,
    skill: SKILLS.CARPENTRY,
    skillLevel: 3,
    baseTime: 30 * MINUTES
  },
  sourceBuff: "BuffBrokenBone",
  maxBatch: 1,
  skillLevel: 0,
  skillGainMultiplier: 50,
  transformBuff: (creature, stacks, oldBuff) => {
    creature.addBuff(BuffBrokenBoneRegularSplint, {
      duration: oldBuff.duration / 4.5,
      stacks: stacks,
      effects: {
        [BUFFS.PAIN]: oldBuff.effects[BUFFS.PAIN] * 0.3,
        [BUFFS.STATS.DEXTERITY]: oldBuff.effects[BUFFS.STATS.DEXTERITY] * 0.4,
        [BUFFS.STATS.STRENGTH]: oldBuff.effects[BUFFS.STATS.STRENGTH] * 0.4
      }
    });
  }
});
module.exports = global.RegularSplint = RegularSplint;

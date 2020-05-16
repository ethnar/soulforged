const Resource = require("./.resource");

class AncientBones extends Resource {
  constructor(args) {
    super(args);
    this.setSize(Infinity);
  }
}
Object.assign(AncientBones.prototype, {
  name: "Ancient Bones",
  skill: SKILLS.MINING,
  toolUtility: TOOL_UTILS.MINING,
  skillLevel: 5,
  produces: (creature, core = false) => {
    if (creature && !core) {
      creature.addBuff(BuffWerewolfChance);
    }
    return AncientBone;
  },
  baseTime: 5 * HOURS,
  placement: {}
});

module.exports = global.AncientBones = AncientBones;

const Event = require("../.event");

class Sunrise extends Event {
  constructor(args) {
    super(args);
    world.buffs = world.buffs || {};
    world.buffs[BUFFS.TEMPERATURE_OVERWORLD] =
      world.buffs[BUFFS.TEMPERATURE_OVERWORLD] || 0;
    world.buffs[BUFFS.TEMPERATURE_OVERWORLD] -= 1.5;
  }

  destroy() {
    world.buffs[BUFFS.TEMPERATURE_OVERWORLD] += 1.5;
    super.destroy();
  }
}
Object.assign(Sunrise.prototype, {
  name: "Sunrise",
  icon: `/${ICONS_PATH}/events/world/sunrise.png`,
  eventDuration: 1 * HOURS,
  includeMinutesLeft: true,
  plotText: "The sun is rising.",
  visibilityCondition(creature) {
    return creature.isOverground();
  }
});
module.exports = global.Sunrise = Sunrise;

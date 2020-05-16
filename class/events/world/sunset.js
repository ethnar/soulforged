const Event = require("../.event");

class Sunset extends Event {
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

    world.startNewEvent(Night);
  }
}
Object.assign(Sunset.prototype, {
  name: "Sunset",
  icon: `/${ICONS_PATH}/events/world/sunset.png`,
  checkEventTiming: TimeCheck.atHour(21),
  includeMinutesLeft: true,
  eventChance: 100,
  eventDuration: 1 * HOURS,
  plotText: "The sun is setting, night will soon be upon you.",
  triggerCondition: () => !world.hasEvent(Night),
  visibilityCondition(creature) {
    return creature.isOverground();
  }
});
module.exports = global.Sunset = Sunset;

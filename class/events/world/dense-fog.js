const Event = require("../.event");

class DenseFog extends Event {
  constructor(args) {
    super(args);
    world.buffs = world.buffs || {};
    world.buffs[BUFFS.VIEW_RANGE_OVERWORLD] = -10;
  }

  destroy() {
    delete world.buffs[BUFFS.VIEW_RANGE_OVERWORLD];
    super.destroy();
  }
}
Object.assign(DenseFog.prototype, {
  name: "Dense Fog",
  icon: `/${ICONS_PATH}/events/world/emerald_13_fog.png`,
  checkEventTiming: TimeCheck.atHour(6),
  eventChance: 7,
  eventDuration: 3 * HOURS,
  plotText:
    "Dense fog blankets the earth, you can barely make out your surroundings.",
  triggerCondition: () => {
    return !world.hasEvent(Drought);
  },
  visibilityCondition(creature) {
    return creature.isOverground();
  }
});
module.exports = global.DenseFog = DenseFog;

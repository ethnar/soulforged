const Event = require("../.event");

class CorruptedMist extends Event {
  constructor(args) {
    super(args);
  }

  destroy() {
    super.destroy();
  }
}
Object.assign(CorruptedMist.prototype, {
  name: "Strange Mist",
  icon: `/${ICONS_PATH}/events/world/emerald_13_fog_purple.png`,
  checkEventTiming: TimeCheck.atHour(6),
  eventChance: 0,
  eventDuration: 60 * DAYS,
  plotText: "A strange mist blankets the earth.",
  triggerCondition: () => {
    return true;
  },
  visibilityCondition() {
    return true;
  }
});
module.exports = global.CorruptedMist = CorruptedMist;

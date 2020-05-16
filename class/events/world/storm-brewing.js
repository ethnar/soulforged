const Event = require("../.event");
const Storm = require("./storm");

class StormBrewing extends Event {
  destroy() {
    const random = utils.random(1, 100);
    if (random <= this.chanceForStorm) {
      world.startNewEvent(Storm);
    }
    super.destroy();
  }
}
Object.assign(StormBrewing.prototype, {
  name: "Storm Brewing",
  icon: `/${ICONS_PATH}/events/world/yellow_09_blue.png`,
  checkEventTiming: TimeCheck.onTheHour(),
  eventChance: 2,
  eventDuration: 1.5 * HOURS,
  chanceForStorm: 95,
  plotText: "A storm is brewing...",
  triggerCondition: () => {
    return !world.hasEvent(Storm);
  },
  visibilityCondition(creature) {
    return creature.isOverground();
  }
});
module.exports = global.StormBrewing = StormBrewing;

const Event = require("../.event");
const Earthquake = require("./earthquake");

class Tremors extends Event {
  destroy() {
    const random = utils.random(1, 100);
    if (random <= this.chanceForEarthquake) {
      world.startNewEvent(Earthquake);
    }
    super.destroy();
  }
}
Object.assign(Tremors.prototype, {
  name: "Tremors",
  icon: `/${ICONS_PATH}/events/world/sgi_41_no_magma.png`,
  checkEventTiming: TimeCheck.onTheHour(),
  eventChance: 1,
  eventDuration: 4 * HOURS,
  chanceForEarthquake: 60,
  plotText: "The earth is trembling.",
  triggerCondition: () => {
    return !world.hasEvent(Earthquake);
  }
});
module.exports = global.Tremors = Tremors;

const Event = require("../.event");

class StarryNight extends Event {
  constructor(args) {
    super(args);
    world.sleepBuffMultiplier = 1.5;
  }

  destroy() {
    world.sleepBuffMultiplier = 1;
    super.destroy();
  }
}
Object.assign(StarryNight.prototype, {
  name: "Starry Night",
  icon: `/${ICONS_PATH}/events/world/spellbookpreface_07.png`,
  eventChance: 5,
  eventDuration: 11 * HOURS,
  plotText:
    "Clear skies bring serenity and respite. Sleeping benefits are increased." // TODO: move to plot hint
});
module.exports = global.StarryNight = StarryNight;

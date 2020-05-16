const Event = require("../.event");

class Storm extends Event {
  constructor(args) {
    super(args);
    world.buffs = world.buffs || {};
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] =
      world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] || 0;
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] += 1;
    world.finishEvent(Drought);
  }

  destroy() {
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] -= 1;
    super.destroy();
  }
}
Object.assign(Storm.prototype, {
  name: "Storm",
  icon: `/${ICONS_PATH}/events/world/blue_42.png`,
  eventChance: 0,
  eventDuration: 5 * HOURS,
  plotText:
    "A violent thunderstorm is tearing the skies apart. The paths are treacherous, traveling at this time is full of peril.",
  visibilityCondition(creature) {
    return creature.isOverground();
  }
});
module.exports = global.Storm = Storm;

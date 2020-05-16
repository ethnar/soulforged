const Event = require("../.event");

const DIFFICULTY_CHANGE = 0.3;
class Night extends Event {
  constructor(args) {
    super(args);
    world.buffs = world.buffs || {};
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] =
      world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] || 0;
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] += DIFFICULTY_CHANGE;
    world.buffs[BUFFS.TEMPERATURE_OVERWORLD] =
      world.buffs[BUFFS.TEMPERATURE_OVERWORLD] || 0;
    world.buffs[BUFFS.TEMPERATURE_OVERWORLD] -= 3;

    if (Night.timeToNextLongNight(-1) === 0) {
      this.expiresIn = utils.random(4, 5) * DAYS + 8 * HOURS;
    }
  }

  destroy() {
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] -= DIFFICULTY_CHANGE;
    world.buffs[BUFFS.TEMPERATURE_OVERWORLD] += 3;
    super.destroy();

    world.startNewEvent(Sunrise);
  }

  static timeToNextLongNight(mod = 0) {
    if (!world.nextLongNight) {
      world.nextLongNight = utils.random(25, 120);
    }
    world.nextLongNight += mod;
    return world.nextLongNight - 1;
  }
}
Object.assign(Night.prototype, {
  name: "Night",
  icon: `/${ICONS_PATH}/events/world/spellbookpreface_07.png`,
  eventDuration: 8 * HOURS,
  triggerCondition: () => !world.hasEvent(Night),
  plotText:
    "Night sets upon the world, with the air growing colder. The surrounding darkness makes travelling difficult.",
  visibilityCondition(creature) {
    return creature.isOverground();
  }
});
module.exports = global.Night = Night;

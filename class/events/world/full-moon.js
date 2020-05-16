const Event = require("../.event");

const DIFFICULTY_CHANGE = -0.2;
class FullMoon extends Event {
  constructor(args) {
    super(args);
    world.buffs = world.buffs || {};
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] =
      world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] || 0;
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] += DIFFICULTY_CHANGE;

    FullMoon.turnWereWolves();
    FullMoon.spreadTheCurse();
  }

  destroy() {
    world.buffs[BUFFS.TRAVEL_DIFFICULTY_OVERWORLD] -= DIFFICULTY_CHANGE;

    FullMoon.turnWereWolvesBack();
    super.destroy();
  }

  static turnWereWolves() {
    Entity.getEntities(Humanoid).forEach(h => {
      if (h.hasBuff("BuffSomethingHappening1")) {
        h.removeBuff("BuffSomethingHappening1");
        h.logging(
          `You are filled with unstoppable rage as your body twist and turns into a monstrous shape.`
        );
        Werewolf.turnInto(h);
      }
    });
  }

  static spreadTheCurse() {
    Entity.getEntities(Humanoid).forEach(h => {
      if (h.hasBuff("BuffWerewolfChance") && !h.hasBuff("BuffMoonrageHidden")) {
        const count = h.getBuffs().filter(b => b instanceof BuffWerewolfChance)
          .length;
        if (utils.chance(count - 3) * 4) {
          h.addBuff(BuffMoonrageHidden);
          h.removeBuff("BuffWerewolfChance");
        }
      }
    });
  }

  static turnWereWolvesBack() {
    Entity.getEntities(Humanoid).forEach(h => {
      if (h.hasBuff("BuffMoonrage")) {
        h.removeBuff("BuffMoonrage");
        h.logging(
          `As the rage subsides, your body turns back into your old form.`
        );
        Werewolf.turnBack(h);
      }
    });
  }

  static spreadWarning() {
    Entity.getEntities(Humanoid).forEach(h => {
      if (h.hasBuff("BuffMoonrageHidden")) {
        h.addBuff(BuffSomethingHappening1);
        h.logging(`You feel goosebumps. Something is coming...`);
      }
    });
  }

  static timeToNextFullMoon(mod = 0) {
    if (!world.nextFullMoon) {
      world.nextFullMoon = utils.random(25, 35);
    }
    world.nextFullMoon += mod;
    return world.nextFullMoon - 1;
  }
}
Object.assign(FullMoon.prototype, {
  name: "Full Moon",
  icon: `/${ICONS_PATH}/events/world/fullmoon.png`,
  checkEventTiming: seconds => {
    if (TimeCheck.atHour(23, seconds)) {
      const timeLeft = FullMoon.timeToNextFullMoon(-1);
      if (timeLeft === 1) {
        FullMoon.spreadWarning();
      }
      return timeLeft === 0;
    }
    return false;
  },
  eventChance: 100,
  eventDuration: 6 * HOURS,
  triggerCondition: () => !world.hasEvent(FullMoon),
  plotText: "A silvery shape lightens up the night sky.",
  visibilityCondition(creature) {
    return creature.isOverground();
  }
});
module.exports = global.FullMoon = FullMoon;

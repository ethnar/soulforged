const TimeCheck = {
  atHour(hour, seconds) {
    const fn = seconds =>
      utils.cachableFunction(`TimeCheck.atHour:${hour}`, () => {
        const before = new Date(world.currentTime.getTime() - seconds * 1000);
        return (
          before.getUTCHours() < hour &&
          !(world.currentTime.getUTCHours() < hour)
        );
      });
    return seconds ? fn(seconds) : fn;
  },

  onTheHour(seconds) {
    const fn = seconds =>
      utils.cachableFunction(`TimeCheck.onTheHour:`, () => {
        const before = new Date(world.currentTime.getTime() - seconds * 1000);
        return before.getUTCHours() !== world.currentTime.getUTCHours();
      });
    return seconds ? fn(seconds) : fn;
  },

  timesADay(times, seconds) {
    const fn = seconds =>
      utils.cachableFunction(`TimeCheck.timesADay:${times}`, () => {
        const current = world.currentTime;
        const before = new Date(current.getTime() - seconds * 1000);
        const beforeSeconds =
          (before.getUTCHours() * 60 + before.getUTCMinutes()) * 60 +
          before.getUTCSeconds();
        const nowSeconds =
          (current.getUTCHours() * 60 + current.getUTCMinutes()) * 60 +
          current.getUTCSeconds();
        const span = (24 * HOURS) / times;
        return (
          Math.floor(beforeSeconds / span) !== Math.floor(nowSeconds / span)
        );
      });
    return seconds ? fn(seconds) : fn;
  },

  isDay(dayName) {
    const time = new Date(world.currentTime.getTime());
    return dayName === DAYS_OF_WEEK[time.getDay()];
  }
};

module.exports = global.TimeCheck = TimeCheck;

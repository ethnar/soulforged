global.dayZero = new Date("5 December 1990 06:00");
global.eras = {
  1: "Era of Old",
  2: "Era of Bloom",
  3: "Era of Culture",
  4: "Era of Mirrors",
  5: "Era of Splendor",
  6: "Era of Fright",
  7: "Era of Sorrow",
  8: "Era of Hope"
};

const importantDates = {
  FirstAerianBirthday: [1, 1, 1],
  YarloBirthday: [1, 8, 12],
  VesnaBirthday: [2, 12, 3],
  ChurBirthday: [3, 22, 50],
  AymarBirthday: [4, 3, 45],
  CivilWarStart: [5, 4, 45],
  // Chur gets involved - because of Zoraya!
  // Assassination contract issued
  // Prison becomes operational
  CorruptionNoticed: [6, 13, 22],
  TheVanishing: [7, 3, 38]
};

const scenarioDates = {
  importantDates,
  formatAerianDate(era, chapter, cycle) {
    return scenarioDates.getAerianDate(
      scenarioDates.aerianDateToEarth(era, chapter, cycle)
    ).text;
  },

  getAerianDate(date) {
    date = date || new Date();
    const days = (date.getTime() - dayZero.getTime()) / (DAYS * IN_MILISECONDS);
    const era = Math.floor(days / 1500) + 1;
    const chapter = Math.floor((days % 1500) / 60) + 1;
    const cycle = Math.floor(days % 60) + 1;
    return {
      era,
      chapter,
      cycle,
      text: `Cycle ${cycle}, ${utils.numberOrder(chapter)} Chapter, ${
        eras[era]
      }`
    };
  },

  aerianDateToEarth(era, chapter, cycle) {
    const date = new Date(dayZero);
    const days = cycle - 1 + (chapter - 1) * 60 + (era - 1) * 1500;
    date.setDate(date.getDate() + days);
    return date;
  }
};

module.exports = global.scenarioDates = scenarioDates;

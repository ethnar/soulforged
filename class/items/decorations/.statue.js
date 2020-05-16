class StatueDecoration extends Decoration {}
Object.assign(StatueDecoration.prototype, {
  name: "?Statue?",
  expiresIn: 500 * DAYS
});

module.exports = global.StatueDecoration = StatueDecoration;

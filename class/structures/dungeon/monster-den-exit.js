class MonsterDenExit extends DungeonExit {}
Object.assign(MonsterDenExit.prototype, {
  name: "Den Exit",
  icon: `/${ICONS_PATH}/structures/sgi_39.png`,
  mapGraphic: () => ({})
});

module.exports = global.MonsterDenExit = MonsterDenExit;

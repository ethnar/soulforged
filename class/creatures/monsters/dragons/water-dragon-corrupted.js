const Dragon = require("./.dragon");

module.exports = Monster.factory(class WaterDragonPurple extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_02_purple.png`,
  butcherable: Dragon.prototype.butcherable,
  temperature: null,
  drainage: {
    change: 10,
    range: 5
  }
});

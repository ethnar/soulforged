const Dragon = require("./.dragon");

module.exports = Monster.factory(class EarthDragonPurple extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_06_purple.png`,
  temperature: null,
  butcherable: Dragon.prototype.butcherable,
  drainage: {
    change: -10,
    range: 9
  }
});

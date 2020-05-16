const Dragon = require("./.dragon");

module.exports = Monster.factory(class EarthDragon extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_06.png`,
  temperature: null,
  butcherable: Dragon.prototype.butcherable,
  drainage: {
    change: -1,
    range: 9
  }
});

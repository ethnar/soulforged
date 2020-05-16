const Dragon = require("./.dragon");

module.exports = Monster.factory(class WaterDragon extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_02.png`,
  butcherable: Dragon.prototype.butcherable,
  temperature: null,
  drainage: {
    change: 1,
    range: 5
  }
});

const Dragon = require("./.dragon");

module.exports = Monster.factory(class FrostDragon extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_05.png`,
  butcherable: Dragon.prototype.butcherable,
  temperature: {
    change: -6
  },
  drainage: null
});

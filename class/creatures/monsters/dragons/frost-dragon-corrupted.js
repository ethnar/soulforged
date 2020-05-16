const Dragon = require("./.dragon");

module.exports = Monster.factory(class FrostDragonPurple extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_05_purple.png`,
  butcherable: Dragon.prototype.butcherable,
  temperature: {
    change: -24
  },
  drainage: null
});

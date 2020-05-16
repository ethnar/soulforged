const Dragon = require("./.dragon");

module.exports = Monster.factory(class FireDragonPurple extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_03_purple.png`,
  butcherable: Dragon.prototype.butcherable,
  temperature: {
    change: 24
  },
  drainage: null
});

const Dragon = require("./.dragon");

module.exports = Monster.factory(class FireDragon extends Dragon {}, {
  name: "Dragon",
  icon: `/${ICONS_PATH}/creatures/monsters/dragons/dragon_03.png`,
  butcherable: Dragon.prototype.butcherable,
  temperature: {
    change: 6
  },
  drainage: null
});

const Structure = require("./.structure");

class GreenEggs extends Structure {
  getDescription() {
    return `Large, green pulsating eggs are strewn across this area.`;
  }
}
Object.assign(GreenEggs.prototype, {
  name: "Large Green Eggs",
  icon: `/${ICONS_PATH}/structures/spellbookpage09_16.png`
  // mapGraphic: {
  //     7: 'tiles/custom/menhir.png',
  // },
});
module.exports = global.GreenEggs = GreenEggs;

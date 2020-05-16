const Structure = require("./.structure");

class Menhir extends Structure {
  getDescription() {
    return `Massive stone slab sits here, its purpose unknown.`;
  }
}
Object.assign(Menhir.prototype, {
  name: "Menhir",
  icon: `/${ICONS_PATH}/structures/sgi_115.png`,
  mapGraphic: {
    7: "tiles/custom/menhir.png"
  }
});
module.exports = global.Menhir = Menhir;

// node // race // menhir
// 405 // human // 14200
// 618 // orc // 14327
// 492 // dwarf // 14338
// 685 // elf // 14332

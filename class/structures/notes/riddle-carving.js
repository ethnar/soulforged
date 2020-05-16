const Structure = require("../.structure");
const server = require("../../../singletons/server");

class RiddleCarving extends Structure {}
Object.assign(RiddleCarving.prototype, {
  name: "Carved statue",
  icon: `/${ICONS_PATH}/structures/notes/sgi_165_gray.png`,
  plotText: "?MISSING?"
});
module.exports = global.RiddleCarving = RiddleCarving;

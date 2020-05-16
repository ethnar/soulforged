const Structure = require("../.structure");
const server = require("../../../singletons/server");

class Diary extends Structure {}
Object.assign(Diary.prototype, {
  name: "Diary",
  icon: `/${ICONS_PATH}/structures/notes/sgi_03.png`,
  plotText: "?MISSING?"
});
module.exports = global.Diary = Diary;

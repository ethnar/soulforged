const Item = require("../.item");

class Bone extends Item {}
Object.assign(Bone.prototype, {
  name: "Bone",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/huntingicons_78.png`,
  weight: 1
});
module.exports = global.Bone = Bone;

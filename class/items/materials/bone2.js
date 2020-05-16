const Item = require("../.item");

class AncientBone extends Item {}
Object.assign(AncientBone.prototype, {
  name: "Ancient Bone",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/prehistoricicon_123_b_gray.png`,
  weight: 1
});
module.exports = global.AncientBone = AncientBone;

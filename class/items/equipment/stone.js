const Item = require("../.item");

class Stone extends Item {}
Object.assign(Stone.prototype, {
  name: "Stone",
  icon: `/${ICONS_PATH}/items/equipment/gmn6_t_bg_gray.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 1,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.HAMMER]: 0.2,
    [TOOL_UTILS.HUNTING]: 0.1,
    [TOOL_UTILS.FISHING]: 0.1
  }
});
module.exports = global.Stone = Stone;

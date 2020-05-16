const Item = require("../.item");

class GlassFlask extends Item {}
Item.itemFactory(GlassFlask, {
  name: "Glass Flask",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/alchemy/empty_pot.png`,
  weight: 0.1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Sand: 20,
      Coal: 2
    },
    skill: SKILLS.SMELTING,
    skillLevel: 2,
    building: ["Furnace"],
    baseTime: 2400
  }
});
module.exports = global.GlassFlask = GlassFlask;

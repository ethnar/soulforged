const Item = require("../.item");

class Ruby extends Item {}
Item.itemFactory(Ruby, {
  nameable: true,
  name: "Ruby",
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/crt_b_01_ruby.png`,
  weight: 0.05
});

class CutRuby extends Item {}
Item.itemFactory(CutRuby, {
  dynamicName: () => `${Nameable.getName("Ruby")} (cut)`,
  order: ITEMS_ORDER.GEMS,
  icon: `/${ICONS_PATH}/items/gems/ruby_cut.png`,
  weight: 0.045,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Ruby: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.GEMCUTTING,
    baseTime: 120 * MINUTES
  }
});

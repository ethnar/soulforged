const BoneEquipment = require("./.bone-equipment");

class BoneHoe extends BoneEquipment {}
Item.itemFactory(BoneHoe, {
  name: "Bone Hoe",
  order: ITEMS_ORDER.TOOLS,
  weight: 1,
  utility: {
    [TOOL_UTILS.HOE]: 0.8
  },
  icon: `/${ICONS_PATH}/items/equipment/bone/barbarian_icons_42_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 2
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bone: 1,
      WoodenShaft: 1,
      BarkRope: 1
    },
    toolUtility: TOOL_UTILS.CUTTING,
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 15 * MINUTES
  }
});
module.exports = global.BoneHoe = BoneHoe;

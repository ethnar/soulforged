const Item = require("../.item");

class BoneNeedle extends Item {}
Item.itemFactory(BoneNeedle, {
  name: "Bone Needle",
  order: ITEMS_ORDER.TOOLS,
  icon: `/${ICONS_PATH}/items/leather/bone_needle.png`,
  weight: 0.1,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.SEWING]: 0.8
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Sewing: 0
    }
  },
  crafting: {
    materials: {
      Bone: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 1 * HOURS
  }
});
module.exports = global.BarkRope = BarkRope;

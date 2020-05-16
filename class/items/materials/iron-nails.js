class TrueIronNails extends Item {}
Item.itemFactory(TrueIronNails, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Nails`,
  icon: `/${ICONS_PATH}/items/materials/pt_b_03.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.02,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    result: {
      TrueIronNails: 5
    },
    materials: {
      IronWire: 1
    },
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    building: ["Forge"],
    baseTime: 50 * MINUTES
  }
});

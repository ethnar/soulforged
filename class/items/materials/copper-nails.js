class IronNails extends Item {}
Item.itemFactory(IronNails, {
  dynamicName: () => `${Nameable.getName("MeltedCopper")} Nails`,
  icon: `/${ICONS_PATH}/items/materials/pt_b_03_copper.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.02,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    result: {
      IronNails: 5
    },
    materials: {
      CopperWire: 1
    },
    skill: SKILLS.SMITHING,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.HAMMER,
    building: ["Forge"],
    baseTime: 20 * MINUTES
  }
});

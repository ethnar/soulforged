const Item = require("../.item");
const server = require("../../../singletons/server");

const fitActionCache = {};
const fitActionsCache = {};
function getFitAction(decorationSlotIds) {
  if (!fitActionsCache[decorationSlotIds.join(",")]) {
    fitActionsCache[decorationSlotIds.join(",")] = Action.groupById(
      decorationSlotIds.map(decorationSlotId => {
        if (!fitActionCache[decorationSlotId]) {
          fitActionCache[decorationSlotId] = new Action({
            name: `Fit: ${DECORATION_SLOT_NAMES[decorationSlotId]}`,
            icon: "/actions/icons8-home-100.png",
            quickAction: true,
            repeatable: false,
            notification: false,
            valid(item, creature, context) {
              const home = creature.getHome();
              if (!home) {
                return false;
              }
              if (home.isDecorationUp(item) && !context) {
                return false;
              }
              return true;
            },
            runCheck(item, creature, context) {
              const home = creature.getHome();
              if (item.getContainer() !== home) {
                return "You must first place it in your storage";
              }
              if (
                !home.hasSpaceForOneOfDecorationType([decorationSlotId]) &&
                !context
              ) {
                return "There is no space to fit this";
              }
              if (home.isDecorationTypeUp(item) && !context) {
                return "You cannot have two decorations of the same type";
              }
              if (item.getIntegrity() <= 0) {
                return "The item is too damaged";
              }
              return true;
            },
            run(item, creature, seconds, context) {
              const decorationSlotNumber = context;
              const home = creature.getHome();
              if (context) {
                home.unfitDecorationSlot(decorationSlotNumber);
                creature.getHome().removeDecorationByType(item);
              }
              creature
                .getHome()
                .putAsDecoration(item, decorationSlotId, decorationSlotNumber);
              return false;
            }
          });
        }
        return fitActionCache[decorationSlotId];
      })
    );
  }
  return fitActionsCache[decorationSlotIds.join(",")];
}

const actions = Action.groupById([
  new Action({
    name: "Take down",
    icon: "/actions/icons8-home-100.png",
    repeatable: false,
    notification: false,
    quickAction: true,
    valid(item, creature) {
      const home = creature.getHome();
      if (!home) {
        return false;
      }
      if (!home.isDecorationUp(item)) {
        return false;
      }
      return true;
    },
    run(item, creature) {
      creature.getHome().removeDecoration(item);
      return false;
    }
  })
]);

class Decoration extends ExpirableItem {
  static actions() {
    return { ...actions, ...Item.actions() };
  }

  getFreelyAvailableQty() {
    const container = this.getContainer();
    if (container instanceof Home && container.isDecorationUp(this)) {
      return this.qty - 1;
    }
    return this.qty;
  }

  actionsGetter() {
    return getFitAction(this.decorationSlots);
  }

  constructor(args) {
    super(args);

    // this.buff = {
    //     [variant.buffs[utils.random(0, variant.buffs.length - 1)]]: utils.random(Math.round(this.maxBuff * 10 / 3), this.maxBuff * 10) / 10,
    // }
  }

  markInvalidForUse() {
    if (this.getContainer() instanceof Home) {
      this.getContainer().removeDecoration(this);
    }
  }

  // getPayload(creature) {
  //     return {
  //         ...super.getPayload(creature),
  //         houseDecoration: true,
  //     }
  // }

  getIcon(creature) {
    return server.getImage(creature, this.icon);
  }

  static makeTrophy(animal, slots, materials, buffs) {
    require("../wood/hardwood-board");
    require("../wood/wooden-board");
    require("../../resources/quaking/clay");

    const corpseClass = `${animal.name}Corpse`;

    const decoration = utils.newClassExtending(
      `Decoration_${animal.name}_Trophy`,
      Decoration
    );
    Item.itemFactory(decoration, {
      dynamicName: () => `${animal.getName()} Trophy`,
      icon: animal.prototype.icon,
      autoCalculateWeight: true,
      weight: -global[corpseClass].prototype.weight + 3,
      order: ITEMS_ORDER.DECOR,
      expiresIn: 80 * DAYS,
      decorationSlots: slots,
      buffs,
      research: {
        sameAsCrafting: true,
        materials: {
          ResearchConcept_ImpFurnitureDecoration: 0
        }
      },
      crafting: {
        materials: {
          [corpseClass]: true,
          Glue: Math.floor(materials.Clay / 3),
          ...materials
        },
        skill: SKILLS.CRAFTING,
        skillLevel: animal.prototype.butcherable.butcherSkillLevel,
        toolUtility: TOOL_UTILS.CUTTING,
        baseTime: 2 * HOURS
      }
    });
  }

  // getTradeId() {
  //     return [
  //         'Decoration',
  //         'Item',
  //         utils.cleanup(this.buff),
  //         this.name,
  //         this.icon,
  //         ...super.getTradeId(),
  //     ];
  // }

  /*static createIndividualCrafts(decorationClass) {
        decorationClass.individualCrafts = decorationClass.prototype.variants.map(variant => {
            const className = decorationClass.name + '_Individual_' + variant.name;

            class IndividualTrinket extends Decoration {}
            Item.itemFactory(IndividualTrinket, {
                ...decorationClass.prototype,
                name: `${decorationClass.prototype.name} (${variant.name})`,
                icon: variant.icon,
                variants: [variant],
            });
            Object.defineProperty(IndividualTrinket, 'name', { value: className });

            global[className] = IndividualTrinket;
            return IndividualTrinket;
        });
    }*/
}
Object.assign(Decoration.prototype, {
  name: "?Decoration?",
  order: ITEMS_ORDER.DECOR,
  expiresIn: 60 * DAYS,
  expiresIntegrity: true
  // stackable: false,
});

module.exports = global.Decoration = Decoration;

server.preFlightCheck(() => {
  const theHouses = utils.getClasses(Home).map(h => h.constructor.name);
  new ResearchConcept({
    name: "Furnishing & Decoration",
    className: "ResearchConcept_FurnitureDecoration",
    tier: ResearchConcept.TIERS.CLAY,
    requirements: [
      utils.or(
        ...theHouses.map(houseTypeName =>
          ResearchConcept.knownBuildingPlan(houseTypeName)
        )
      )
    ]
  });

  const baseDecorations = Recipe.getRecipes().filter(
    r =>
      r.research &&
      r.research.materials["ResearchConcept_FurnitureDecoration"] !== undefined
  );
  new ResearchConcept({
    name: "Improved Furnishing & Decorations",
    className: "ResearchConcept_ImpFurnitureDecoration",
    tier: ResearchConcept.TIERS.PARCHMENT,
    requirements: [
      ResearchConcept.knownItem("ResearchConcept_FurnitureDecoration"),
      utils.xOf(
        Math.floor((baseDecorations.length * 2) / 3),
        ...baseDecorations.map(r => ResearchConcept.knownRecipe(r.id))
      )
    ]
  });
});

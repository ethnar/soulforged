const Entity = require("../.entity");
const Action = require("../action");
const Recipe = require("../recipe");

require("../research-concept");
require("../../singletons/systems/weapon-system");

const METALS = [
  // 'Copper',
  // 'Iron',
  // 'Steel',
  // 'Mithril',
];

const actions = Action.groupById([
  ...Object.values(EQUIPMENT_SLOTS).reduce((acc, slotId) => {
    const allowedWithEnemiesAround =
      slotId === EQUIPMENT_SLOTS.WEAPON || slotId === EQUIPMENT_SLOTS.TOOL;
    acc.push(
      new Action({
        // notAllowedInCombat: !allowedWithEnemiesAround,
        name: `Equip: ${EQUIPMENT_SLOT_NAMES[slotId]}`,
        icon: "/actions/icons8-footman-100.png",
        notification: false,
        quickAction: true,
        repeatable: false,
        valid(item, creature) {
          if (item.getContainer() !== creature) {
            return false;
          }
          if (!item.slots || !item.slots[slotId]) {
            return false;
          }
          if (creature.getEquipment(slotId) === item) {
            return false;
          }
          return true;
        },
        runCheck(item, creature) {
          if (item.getIntegrity() <= 0) {
            return "The item is too damaged";
          }
          return true;
        },
        run(item, creature) {
          creature.equip(item, slotId);
          return false;
        }
      })
    );
    acc.push(
      new Action({
        // notAllowedInCombat: !allowedWithEnemiesAround,
        name: `Unequip: ${EQUIPMENT_SLOT_NAMES[slotId]}`,
        icon: "/actions/icons8-drawstring-bag-100.png",
        notification: false,
        quickAction: true,
        repeatable: false,
        valid(item, creature) {
          if (item.getContainer() !== creature) {
            return false;
          }
          if (item !== creature.getEquipment(slotId)) {
            return false;
          }
          return true;
        },
        run(item, creature) {
          creature.unequip(item, slotId);
          return false;
        }
      })
    );
    return acc;
  }, []),
  // new Action({
  //     name: 'Salvage',
  //     icon: '/actions/icons8-receive-cash-100.png',
  //     valid(item, creature) {
  //         if (!PerkSystem.hasPerk(creature, PERKS.SMITH_SALVAGE)) {
  //             return false;
  //         }
  //         if (!creature.hasItem(item)) {
  //             return false;
  //         }
  //         if (
  //             !item.crafting || (
  //                 item.crafting.result && (
  //                     item.crafting.result.length >= 1 ||
  //                     Object.values(item.crafting.result)[0] > 1
  //                 )
  //             ) ||
  //             !item.crafting.materials ||
  //             !METALS.some(metal => item.crafting.materials[metal])
  //         ) {
  //             return false;
  //         }
  //         return true;
  //     },
  //     run(item, creature, seconds) {
  //         const efficiency = creature.getEfficiency(SKILLS.SMITHING, null);
  //
  //         creature.actionProgress += seconds * efficiency * 100 / (item.crafting.baseTime / 2);
  //
  //
  //         if (creature.actionProgress >= 100) {
  //             creature.actionProgress -= 100;
  //
  //             Object
  //                 .keys(item.crafting.materials)
  //                 .forEach(material => {
  //                     if (METALS.includes(material)) {
  //                         const qty = item.crafting.materials[material];
  //                         const getting = Math.ceil(qty * PerkSystem.getPerkBonus(creature, PERKS.SMITH_SALVAGE));
  //                         creature.addItemByType(global[material], getting);
  //                     }
  //                 });
  //
  //             const removed = item.useUpItem();
  //             if (removed) {
  //                 creature.actionOnSimilarItem(item);
  //             }
  //
  //             return false;
  //         }
  //         return true;
  //     }
  // }),
  new Action({
    name: "Discard contents",
    icon: "/actions/icons8-forward-arrow-100-out.png",
    quickAction: true,
    notification: false,
    valid(item, creature) {
      if (!item.containerItemType) {
        return false;
      }
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    run(item, creature) {
      let qty = Math.min(creature.currentAction.repetitions, item.qty);
      creature.currentAction.repetitions = 0;
      container = item.getContainer();
      while (qty > 0 && item && item.qty && creature.isActionRunable()) {
        const split = item.qty > 1 ? item.split(1) : item;
        split.destroy();

        qty -= 1;
      }
      container.reStackItems();
      return false;
    }
  }),
  new Action({
    name: "Pick up", // from the ground
    icon: "/actions/icons8-drawstring-bag-100.png",
    quickAction: true,
    notification: false,
    notAllowedInCombat: true,
    maxRepetitions: (item, creature) => item.qty,
    valid(item, creature) {
      if (!item.getContainer() || item.getContainer() !== creature.getNode()) {
        return false;
      }
      return true;
    },
    run(item, creature) {
      let qty = creature.currentAction.repetitions;
      creature.currentAction.repetitions = 0;
      while (qty > 0 && item && creature.isActionRunable()) {
        const picked = creature.pickUp(item, qty);
        if (item.getContainer() !== creature.getNode()) {
          item = creature.actionOnSimilarItem(item, creature.getNode());
        }
        qty -= picked.qty;
      }
      creature.reStackItems();
      creature.getNode().reStackItems();
      return false;
    }
  }),
  new Action({
    name: "Store",
    icon: "/actions/icons8-open-box-100.png",
    quickAction: true,
    notification: false,
    maxRepetitions: (item, creature) => item.qty,
    valid(item, creature) {
      if (item.getContainer() !== creature) {
        return false;
      }
      return true;
    },
    runCheck(item, creature, context, repetitions) {
      const home = creature.getHome();
      if (!home) {
        return "You do not have storage space available in this location";
      }
      if (!home.hasStorageSpace(item, repetitions)) {
        return "You do not have enough space to store this item";
      }
      return true;
    },
    run(item, creature) {
      let qty = creature.currentAction.repetitions;
      creature.currentAction.repetitions = 0;
      while (qty > 0 && item && creature.isActionRunable()) {
        const stored = creature.putToStorage(item, qty);
        if (item.getContainer() !== creature) {
          item = creature.actionOnSimilarItem(item, creature);
        }
        qty -= stored.qty;
      }
      creature.reStackItems();
      creature.getHome().reStackItems();
      return false;
    }
  }),
  new Action({
    name: "Take", // out of storage
    icon: "/actions/icons8-drawstring-bag-100.png",
    quickAction: true,
    notification: false,
    maxRepetitions: (item, creature) => item.qty,
    valid(item, creature) {
      if (!item.getContainer() || item.getContainer() !== creature.getHome()) {
        return false;
      }
      return true;
    },
    run(item, creature) {
      const home = creature.getHome();

      let qty = creature.currentAction.repetitions;
      creature.currentAction.repetitions = 0;
      while (qty > 0 && item && creature.isActionRunable()) {
        const taken = creature.takeFromStorage(item, qty);
        if (item.getContainer() !== home) {
          item = creature.actionOnSimilarItem(item, home);
        }
        qty -= taken.qty;
      }
      creature.reStackItems();
      home.reStackItems();
      return false;
    }
  }),
  new Action({
    name: "Dump", // on the ground
    icon: "/actions/icons8-delete-100.png",
    quickAction: true,
    notification: false,
    maxRepetitions: (item, creature) => item.qty,
    dynamicLabel(item, creature) {
      return item.getContainer() === creature ? "Dump" : "Dump ";
    },
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    run(item, creature) {
      let qty = creature.currentAction.repetitions;
      creature.currentAction.repetitions = 0;
      const container = item.getContainer();
      while (qty > 0 && item && creature.isActionRunable()) {
        const dropped = container.drop(item, qty);
        if (item.getContainer() !== container) {
          item = creature.actionOnSimilarItem(item, container);
        }
        qty -= dropped.qty;
      }
      container.reStackItems();
      container.getNode().reStackItems();
      return false;
    }
  })
]);

function buffsFormatting(buffs) {
  return Object.keys(buffs || {})
    .filter(stat => BUFF_LABELS[stat] !== null)
    .map(stat => ({
      stat: BUFF_LABELS[stat] || stat,
      value: buffs[stat],
      negative: NEGATIVE_BUFFS[stat],
      discrete: DISCRETE_BUFFS[stat],
      percentage: PERCENTAGE_BUFFS[stat],
      multiplier: MULTIPLIER_BUFFS[stat]
    }));
}

class Item extends Entity {
  static actions() {
    return actions;
  }

  constructor(args = {}) {
    super(args);

    this.integrity = 100;
    this.qty = args.qty || 1;
  }

  getContainerItemType() {
    return this.containerItemType;
  }

  getContainerItemTypeName() {
    return this.containerItemType && this.containerItemType.prototype.name;
  }

  static getContainerItemType() {
    return this.prototype.containerItemType;
  }

  static getWeight() {
    return this.prototype.weight;
  }

  getWeight() {
    return this.qty * this.weight;
  }

  getFreelyAvailableQty() {
    return this.qty;
  }

  useUpItem() {
    const container = this.getContainer();
    this.qty -= 1;
    if (this.getContainer() && this.getContainerItemType()) {
      this.getContainer().addItemByType(this.getContainerItemType());
    }
    if (this.qty === 0) {
      this.destroy();
      return true;
    }
    container.reStackItems();
    return false;
  }

  destroy(leavesContainer = true) {
    if (this.getContainer()) {
      if (leavesContainer && this.getContainerItemType() && this.qty) {
        this.getContainer().addItemByType(
          this.getContainerItemType(),
          this.qty
        );
      }

      this.getContainer().removeItem(this);
    }
    super.destroy();
  }

  split(qty) {
    const newStack = new this.constructor({
      qty: qty
    });
    this.getContainer().addItem(newStack);
    this.qty = this.qty - qty;
    newStack.integrity = this.integrity;
    return newStack;
  }

  markInvalidForUse() {
    if (this.getContainer() instanceof Creature) {
      if (this.getContainer().replaceEquipment) {
        this.getContainer().replaceEquipment(this);
      }
      this.getContainer().unequip(this);
      if (this.getContainer().reStackItems) {
        this.getContainer().reStackItems();
      }
    }
  }

  reduceIntegrity(damage) {
    this.integrity -= damage / (this.durability || 1) / this.qty;
    if (this.integrity <= 0) {
      this.integrity = 0;
      this.markInvalidForUse();
    } else {
      if (this.getContainer().reStackItems) {
        this.getContainer().reStackItems();
      }
    }
  }

  isUnusable() {
    return this.getIntegrity() <= 0;
  }

  getIntegrity() {
    return this.integrity;
  }

  getUtilityLevel(utilityType) {
    return (this.utility && this.utility[utilityType]) || 0;
  }

  getContainer() {
    return this.container;
  }

  getNode() {
    const container = this.getContainer();
    return container instanceof Node ? container : container.getNode();
  }

  setContainer(container) {
    this.container = container;
  }

  static getDamagePayload(damage) {
    if (!damage) {
      return undefined;
    }
    const result = {};
    Object.keys(damage).forEach(damageType => {
      result[DAMAGE_TYPE_LEVELS[damageType]] =
        Math.round(damage[damageType] * 100) / 100;
    });
    return result;
  }

  static getProps(creature, base, object) {
    let weaponProps = {};
    if (base.damage) {
      const damage = WeaponSystem.calculateDamageWithCoefficients(
        base,
        creature
      );
      weaponProps = {
        damage: Item.getDamagePayload(damage),
        hitChance: creature.getChanceToHit(base).toFixed(2),
        weaponSkill: SKILL_NAMES[base.weaponSkill],
        weaponSkillLevel: WeaponSystem.getCoefficientLevel(base)
      };
    }
    return {
      ...object,
      order: base.order || ITEMS_ORDER.OTHER,
      buffs: buffsFormatting(utils.cleanup(base.buffs)),
      properties: {
        ...object.properties,
        utility: utils.cleanup(base.utility),
        ...weaponProps
      }
    };
  }

  hasMatchingIntegrity(item) {
    switch (true) {
      case this.integrity > 50:
        return item.integrity > 50;
      case this.integrity > 20:
        return item.integrity > 20 && item.integrity <= 50;
      case this.integrity > 0:
        return item.integrity > 0 && item.integrity <= 20;
      default:
        return item.integrity === 0;
    }
  }

  getIntegrityPayload() {
    return utils.approximateIntegrity(this.integrity);
  }

  matchesTradeId(item) {
    return (
      JSON.stringify(this.getTradeId()) === JSON.stringify(item.getTradeId())
    );
  }

  getPayload(creature) {
    return Item.getProps(creature, this, {
      ...this.constructor.getPayload(creature),
      id: this.getEntityId(),
      icon: this.getIcon(creature),
      name: this.getName(),
      qty: this.qty,
      nonResearchable: this.nonResearchable,
      integrity: this.getIntegrityPayload(),
      nameable:
        creature.knowsItem(this.constructor.name) &&
        Nameable.getPublicKey(
          this.nameable === true ? this.constructor.name : this.nameable
        ),
      actions: this.getActionsPayloads(creature),
      tradeId: JSON.stringify(this.getTradeId()),
      container: this.getContainerItemTypeName(),
      weight: {
        single: this.weight,
        total: this.getWeight()
      }
    });
  }

  static getItemPurposes() {
    let results = [];
    if (this.prototype.slots) {
      results = [
        ...results,
        ...Object.keys(this.prototype.slots).reduce((acc, slotId) => {
          let result = `Eq.: ${EQUIPMENT_SLOT_NAMES[slotId]}`;
          let clothing = true;
          if (+slotId === EQUIPMENT_SLOTS.WEAPON) {
            result += ` - ${SKILL_NAMES[this.prototype.weaponSkill].replace(
              "Combat: ",
              ""
            )}`;
            clothing = false;
          }
          if (+slotId === EQUIPMENT_SLOTS.TOOL) {
            Object.keys(this.prototype.utility).forEach(util => {
              acc.push(result + ` - ${utils.ucfirst(util)}`);
            });
          } else {
            if (clothing) {
              result = `Eq.: Clothing - ${EQUIPMENT_SLOT_NAMES[slotId]}`;
            }
            acc.push(result);
          }
          return acc;
        }, [])
      ];
    }
    if (this.prototype.decorationSlots) {
      results = [
        ...results,
        ...this.prototype.decorationSlots.map(
          slotId => `Furn.: ${DECORATION_SLOT_NAMES[slotId]}`
        )
      ];
    }
    if (this.prototype.nutrition) {
      results = [...results, "Food"];
    }
    return results;
  }

  static getPayload(creature) {
    return Item.getProps(creature, this.prototype, {
      name: this.getName(),
      icon: this.getIcon(creature),
      itemCode: utils.getKey(this.name),
      weight: {
        single: this.prototype.weight
      },
      itemPurposes: this.getItemPurposes(),
      tradeId: JSON.stringify(this.getTradeId())
    });
  }

  static getMaterialsPayload(materials, creature) {
    if (!materials) {
      return materials;
    }

    return Object.keys(materials).map(material => ({
      item: global[material].getPayload(creature),
      qty: materials[material]
    }));
  }

  static isKnownBy(creature) {
    return creature.knowsItem(this.name);
  }

  static itemFactory(classCtr, props) {
    if (!classCtr.prototype) {
      throw new Error(classCtr.constructor.name, "- invalid factory use");
    }
    if (props.autoCalculateWeight) {
      props.weight =
        ((props.weight || 0) + utils.totalWeight(props.crafting.materials)) *
        (props.autoCalculateWeightMult || 0.75);
      if (!props.weight) {
        throw new Error("Invalid item weight", classCtr);
      }
    }
    // props.weight = Math.floor((props.weight || classCtr.prototype.weight) * 100) / 100;
    props.weight = +(+(props.weight || classCtr.prototype.weight || 0)).toFixed(
      2
    );
    global[classCtr.name] = classCtr;
    Object.assign(classCtr.prototype, props);
    classCtr.recipe = global[classCtr.name].recipeFactory();

    if (classCtr.onClassExtends) {
      classCtr.onClassExtends(classCtr);
    }

    return super.factory(classCtr, props);
  }

  static recipeFactory() {
    if (this.prototype.crafting) {
      let research = this.prototype.research;
      let dynamicName;
      const nameable =
        this.prototype.nameable !== true ? this.prototype.nameable : this.name;
      if (nameable) {
        dynamicName = () => Nameable.getName(nameable);
      }
      return new Recipe({
        id: this.name,
        dynamicName:
          this.prototype.crafting.dynamicName ||
          this.prototype.dynamicName ||
          dynamicName,
        name: this.prototype.crafting.name || this.prototype.name,
        icon: this.prototype.icon,
        result: {
          [this.name]: 1
        },
        research,
        ...this.prototype.crafting
      });
    }
  }

  static backwardCompatibility(alt, original) {
    if (!global[original]) {
      throw new Error(`No such item as ${original}`);
    }
    global[alt] = global[original];
    Recipe.registerRecipeAlterId(alt, original);
  }

  modifyIntegrity(mod) {
    this.integrity = utils.limit(this.integrity + mod, 0, 100);
  }

  getTradeId() {
    return [
      "Item",
      utils.getKey(this.constructor.name),
      this.getIntegrityPayload()
    ];
  }

  getBuffs(creature) {
    return this.buffs;
  }

  static getTradeId() {
    return ["Item", utils.getKey(this.name), [50, 100]];
  }

  static inferPayloadFromTradeId(creature, tradeId) {
    const className = utils.fromKey(tradeId[1]);
    return global[className].inferPayload(creature, tradeId);
  }

  static inferPayload(creature, tradeId) {
    const classDef = global[utils.fromKey(tradeId[1])];
    return {
      ...classDef.getPayload(creature),
      tradeId: JSON.stringify(tradeId),
      name: classDef.getName(),
      weight: classDef.prototype.weight,
      icon: classDef.getIcon(creature),
      itemCode: utils.getKey(classDef.name),
      integrity: tradeId[2],
      buffs: buffsFormatting(utils.cleanup(classDef.prototype.buffs))
    };
  }
}

Object.assign(Item.prototype, {
  weight: 1,
  stackable: true
});

module.exports = global.Item = Item;

server.preFlightCheck(() => {
  const itemsUsedForCrafting = Recipe.getRecipes()
    .filter(recipe => !!recipe)
    .reduce((acc, recipe) => {
      Object.keys({
        ...recipe.materials,
        ...((recipe.research && recipe.research.materials) || {})
      }).forEach(material => (acc[material] = true));
      return acc;
    }, {});

  const itemsUsedForBuilding = Plan.getPlans()
    .filter(recipe => !!recipe)
    .reduce((acc, recipe) => {
      Object.keys({
        ...recipe.getMaterials(),
        ...((recipe.research && recipe.research.materials) || {})
      }).forEach(material => (acc[material] = true));
      return acc;
    }, {});

  const itemsUsed = {
    ...itemsUsedForCrafting,
    ...itemsUsedForBuilding
  };

  const itemClasses = utils.getClasses(Item);

  itemClasses.forEach(item => {
    if (!item.weight && item.name[0] !== "?") {
      throw new Error("Item is weightless", item.name);
    }
  });

  const exceptions = [
    "TabletWriting",
    "Key",
    "KeyMold",
    "WortBarrel",
    "ArmorSetsCloth1",
    "ArmorSetsCloth2",
    "ArmorSetsCloth3",
    "ArmorSetsCloth4",
    "ArmorSetsCloth5",
    "ArmorSetsLeather1",
    "ArmorSetsLeather2",
    "ArmorSetsLeather3",
    "ArmorSetsLeather4",
    "ArmorSetsLeather5",
    "ArmorSetsMetal0",
    "ArmorSetsMetal1",
    "ArmorSetsMetal2",
    "ArmorSetsMetal3",
    "ArmorSetsMetal4",
    "ArmorSetsMetal5",
    "PrimitiveTrainingDummyItem"
  ];

  const deadEndItems = utils.getClasses(Item).filter(itemClass => {
    return (
      !exceptions.includes(itemClass.constructor.name) &&
      (itemClass.name[0] !== "?" || itemClass.dynamicName) &&
      !itemsUsed[itemClass.constructor.name] &&
      !itemClass.nutrition &&
      !itemClass.slots &&
      !itemClass.decorationSlots &&
      !(itemClass instanceof Corpse) &&
      !(itemClass instanceof Drink) &&
      !(itemClass instanceof MedicalItem) &&
      !(itemClass instanceof TrappedPrey)
    );
  });

  if (deadEndItems.length && program.dev) {
    console.warn(
      "Unused items:",
      deadEndItems.map(itemClass => itemClass.constructor.name)
    );
  }
});

// Fixing the items container
// admin(() => Entity.getEntities(Human).forEach(h => h.items = Entity.getEntities(Item).filter(i => i.getContainer().id === h.id)))

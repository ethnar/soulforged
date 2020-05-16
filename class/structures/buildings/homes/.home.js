const Building = require("../.building");
const server = require("../../../../singletons/server");

const actions = Action.groupById([
  new Action({
    name: "Reclaim",
    icon: "/actions/icons8-sword-100.png",
    notification: false,
    repeatable: false,
    valid(target, creature) {
      const owner = target.getOwner();
      if (!owner) {
        return false;
      }
      if (!owner.isHostile(creature)) {
        return false;
      }
      if (Duel.areDueling(owner, creature)) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to do that";
      }
      return true;
    },
    run(target, creature, seconds) {
      if (creature.progressingAction(seconds, 1 * HOURS)) {
        target.setOwner(null);
        return false;
      }
      return true;
    }
  }),
  new Action({
    name: "Abandon",
    icon: "/actions/icons8-delete-100.png",
    notification: false,
    repeatable: false,
    secondaryAction: true,
    quickAction: true,
    valid(target, creature) {
      if (creature !== target.getOwner()) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to do that";
      }
      return true;
    },
    run(target, creature) {
      target.setOwner(null);
    }
  }),
  new Action({
    name: "Claim",
    icon: "/actions/icons8-so-so-100.png",
    notification: false,
    repeatable: false,
    secondaryAction: true,
    quickAction: true,
    valid(target, creature) {
      if (!!target.getOwner()) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to do that";
      }
      if (creature.getHome() && target.isComplete()) {
        return "You already have a home in this location";
      }
      return true;
    },
    run(target, creature) {
      target.setOwner(creature);
    }
  })
]);
class Home extends Building {
  static actions() {
    return { ...actions, ...Building.actions() };
  }

  constructor(args = {}) {
    super(args);

    this.items = [];
    this.decorations = [];
    this.createDecorationSlots();
  }

  createDecorationSlots() {
    Object.keys(this.availableDecorationSlots).forEach(slotType => {
      const count = this.availableDecorationSlots[slotType];
      for (let i = 0; i < count; i++) {
        this.decorations.push({
          slotNumber: this.decorations.length + 1,
          item: null,
          slotType
        });
      }
    });
  }

  getItemsWeight() {
    return this.items.reduce((acc, i) => acc + i.getWeight(), 0);
  }

  hasStorageSpace(item, qty = 1) {
    const weight = (item ? item.weight : 0) * qty;
    return this.getItemsWeight() + weight <= this.getStorageCapacity();
  }

  getStorageCapacity() {
    return Math.ceil(
      this.storageCapacity *
        (1 + PerkSystem.getPerkBonus(this.getOwner(), PERKS.HOUSE_STORAGE))
    );
  }

  unfitDecorationSlot(decorationSlotNumber) {
    const slot = this.getDecorations().find(
      slot => +slot.slotNumber === +decorationSlotNumber
    );
    slot.item = null;
  }

  putAsDecoration(item, slotType, slotNumber) {
    const firstAvailableSlot = this.getFirstAvailableSlot(
      [slotType],
      slotNumber
    );

    if (firstAvailableSlot) {
      firstAvailableSlot.item = item;
    }
  }

  removeDecoration(item) {
    const slot = this.getDecorationSlotWithItem(item);
    if (slot) {
      slot.item = null;
    }
  }

  removeDecorationByType(item) {
    const slot = this.getDecorations().find(
      slot => slot.item && slot.item.constructor === item.constructor
    );
    if (slot) {
      slot.item = null;
    }
  }

  getFirstAvailableSlot(slotTypes, slotNumber) {
    return this.getDecorations().find(
      slot =>
        !slot.item &&
        slotTypes.some(st => `${st}` === `${slot.slotType}`) &&
        (slotNumber === undefined || +slotNumber === +slot.slotNumber)
    );
  }

  hasSpaceForOneOfDecorationType(slotTypes) {
    return !!this.getFirstAvailableSlot(slotTypes);
  }

  isDecorationUp(item) {
    return !!this.getDecorationSlotWithItem(item);
  }

  isDecorationTypeUp(item) {
    return this.getDecorations().find(
      slot => slot.item && slot.item.constructor === item.constructor
    );
  }

  getDecorationSlotWithItem(item) {
    return this.getDecorations().find(slot => slot.item === item);
  }

  removeItem(item) {
    if (this.isDecorationUp(item)) {
      this.removeDecoration(item);
    }
    if (this.getOwner() && this.getOwner().replaceActionedItem) {
      this.getOwner().replaceActionedItem(item);
    }
    return super.removeItem(item);
  }

  drop(item, qty = 1) {
    let toDrop = item;
    if (item.qty > qty) {
      toDrop = item.split(qty);
    }
    this.removeItem(toDrop);
    this.getNode().addItem(toDrop);
    return toDrop;
  }

  getName(creature) {
    let postfix = "";
    if (!this.getOwner()) {
      postfix = " - Vacant";
    }
    return super.getName(creature) + postfix;
  }

  getFurnishingPayload(creature) {
    return this.getDecorations().map(slot => ({
      slotNumber: slot.slotNumber,
      slotType: DECORATION_SLOT_NAMES[slot.slotType],
      item: slot.item && slot.item.getPayload(creature)
    }));
  }

  getInventoryPayload(creature) {
    return {
      items: this.items.map(item => {
        creature.learnAboutItem(item.constructor.name);
        return {
          deadEnd:
            creature.knowsItem(item.constructor.name) ===
            ITEM_KNOWLEDGE.DEAD_END,
          ...item.getPayload(creature)
        };
      }),
      weight: this.getItemsWeight(),
      weightLimit: this.getStorageCapacity()
    };
  }

  getDecorations() {
    return this.decorations || [];
  }

  constructionFinished() {
    const owner = this.getOwner();
    let result;

    if (owner) {
      const previousHome = owner.getHome(this.getNode());

      result = super.constructionFinished();

      if (previousHome) {
        [...previousHome.items].forEach(item => {
          previousHome.removeItem(item);
          this.addItem(item);
        });

        previousHome.setOwner(null);
      }
    } else {
      result = super.constructionFinished();
    }
    return result;
  }

  getBuffs(creature) {
    if (this.getOwner() === creature) {
      return super.getBuffs(creature);
    }
    return {};
  }

  getPayload(creature) {
    const base = super.getPayload(creature);
    return {
      ...base,
      decorations: this.getDecorations()
        .filter(slot => !!slot.item)
        .map(slot => slot.item.getIcon(creature))
    };
  }

  demolishCondition() {
    return false;
  }

  static availabilityCheck(plan, creature) {
    const node = creature.getNode();
    const construct = plan.getConstructor();
    const conflictingStructure = node
      .getAllStructures()
      .find(
        structure =>
          structure.constructor === construct &&
          (!structure.getOwner() ||
            (structure.getOwner() === creature && !structure.isComplete()))
      );
    if (conflictingStructure) {
      if (!conflictingStructure.getOwner()) {
        return "There is already a vacant building of this type here";
      }
      return "You already have a home of this type under construction here";
    }
    return true;
  }

  static getDescription() {
    let result = `${this.getName()} serves as a shelter, providing some protection from the elements.`;
    if (this.prototype.buffs) {
      result += `<br/>`;
      result += `Effects: `;
      result += Object.keys(this.prototype.buffs)
        .map(stat => {
          return `${BUFF_LABELS[stat]} <span class="value">${this.prototype.buffs[stat]}</span>`;
        })
        .join(", ");
    }
    if (this.prototype.storageCapacity) {
      result += `<br/>`;
      result += `It provides <span class="value">${this.prototype.storageCapacity}kg</span> of personal storage.`;
    }
    if (
      this.prototype.availableDecorationSlots &&
      Object.keys(this.prototype.availableDecorationSlots).length > 0
    ) {
      result += `<br/>`;
      result += `${this.getName()} has room for the following decorations: <span class="value">`;
      result += Object.keys(this.prototype.availableDecorationSlots)
        .map(slotId => {
          return `${DECORATION_SLOT_NAMES[slotId]} (${this.prototype.availableDecorationSlots[slotId]})`;
        })
        .join(", ");
      result += `<span>`;
    }
    return result;
  }
}
Object.assign(Home.prototype, {
  name: "?Home?",
  order: 35,
  availableDecorationSlots: {},
  cannotBeOccupied: true
});
module.exports = global.Home = Home;

Nameable.byVoting({
  className: "Node",
  property: "townName",
  validation: {
    maxLength: 22
  },
  condition: (creature, node) => {
    return !!creature.getHome(node) && node.isTown();
  },
  voteWeight: (creature, node) =>
    Math.pow(2, creature.getHome(node).getHomeLevel() - 1)
});

server.registerHandler("set-town-name", (params, player) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }
  return Nameable.castVote(creature, creature.getNode(), params.name);
});

server.registerHandler("get-town-name-preferences", (params, player) => {
  const creature = player.getCreature();
  return Nameable.getVotes(creature, creature.getNode());
});

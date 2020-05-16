require("./action");
const server = require("../singletons/server");
const Entity = require("./.entity");
const gameChat = require("../singletons/game-chat-server");

class Trade extends Entity {
  constructor(args) {
    super(args);
    this.items = {};
    this.accepted = {};
  }

  involves(creature) {
    return this.parties.includes(creature);
  }

  setItems(creature, items) {
    this.items[creature.getEntityId()] = items;
    this.temporarilyBlockAccept();
  }

  temporarilyBlockAccept() {
    this.acceptBlocked = true;
    this.accepted = {};
    setTimeout(() => {
      this.acceptBlocked = false;
    }, 2000);
  }

  tryCommence() {
    if (this.parties.every(c => this.accepted[c.getEntityId()])) {
      this.acceptBlocked = true;

      const itemsCopy = JSON.parse(JSON.stringify(this.items));
      const result = this.commenceTrade();

      if (result === true) {
        this.parties.forEach(creature => {
          Trade.logTrading(
            creature,
            this.getOtherParty(creature),
            itemsCopy[creature.getEntityId()],
            itemsCopy[this.getOtherParty(creature).getEntityId()],
            1
          );
        });

        this.destroy();
      }
      return result;
    }
    return `The trade wasn't accepted by both parties`;
  }

  hasAccepted(creature) {
    return !!this.accepted[creature.getEntityId()];
  }

  markAccepted(creature) {
    if (!this.acceptBlocked) {
      this.accepted[creature.getEntityId()] = true;

      setTimeout(() => {
        this.tryCommence();
      }, 2000);
    }
  }

  commenceTrade() {
    if (this.parties[0].getNode() !== this.parties[1].getNode()) {
      return "You must be in the same location to trade";
    }
    let result = true;
    try {
      let node;
      const itemsToExchange = {};

      this.parties.forEach(party => {
        const exchange = (itemsToExchange[party.getEntityId()] = []);
        if (!node) {
          node = party.getNode();
        } else if (node !== party.getNode()) {
          result = "Trade not possible, different location";
          throw new Error(result);
        }

        const homeItems = (party.getHome() && party.getHome().getItems()) || [];
        const offeredItems = this.getItems(party).map(i => ({ ...i }));

        [...homeItems, ...party.items].forEach(item => {
          if (item.getFreelyAvailableQty() <= 0) {
            return;
          }
          const offeredIdx = offeredItems.findIndex(
            tradeItem =>
              tradeItem.tradeId === JSON.stringify(item.getTradeId(party))
          );
          const offered = offeredItems[offeredIdx];

          if (offered) {
            const qty = Math.min(item.getFreelyAvailableQty(), offered.qty);
            offered.qty -= qty;
            if (offered.qty === 0) {
              offeredItems.splice(offeredIdx, 1);
            }
            exchange.push({
              item,
              qty
            });
          }
        });

        if (offeredItems.length) {
          result = `${party.getName()}: doesn't have all the items.`;
          throw new Error(result);
        }
      });

      utils.log("TRADING");
      this.parties.forEach(party => {
        const exchange = itemsToExchange[party.getEntityId()];
        const giveTo = this.getOtherParty(party);

        exchange.forEach(({ item, qty }) => {
          party.give(item, qty, giveTo, false);
        });
      });
      this.parties.forEach(party => {
        party.reStackItems();
      });
      this.completed = true;
    } catch (e) {
      utils.log("TRADE ERROR: ", e);
      if (result === true) {
        result = "Unknown error";
      }
    }
    return result;
  }

  getOtherParty(creature) {
    return this.parties.find(c => c !== creature);
  }

  getItems(creature) {
    return this.items[creature.getEntityId()] || [];
  }

  getItemsPayload(items, creature) {
    if (!items) {
      return items;
    }

    return items.map(item => ({
      item: Item.inferPayloadFromTradeId(creature, JSON.parse(item.tradeId)),
      qty: item.qty
    }));
  }

  getPayload(creature) {
    const myItems = this.getItemsPayload(this.getItems(creature), creature);
    const theirItems = this.getItemsPayload(
      this.getItems(this.getOtherParty(creature)),
      creature
    );
    [...myItems, ...theirItems].forEach(({ item }) => {
      creature.learnAboutItem(utils.fromKey(item.itemCode));
    });
    return {
      id: this.getEntityId(),
      with: this.getOtherParty(creature).getName(),
      items: {
        yours: myItems,
        theirs: theirItems
      },
      accepted: {
        you: this.accepted[creature.getEntityId()],
        them: this.accepted[this.getOtherParty(creature).getEntityId()]
      },
      acceptBlocked: this.acceptBlocked
    };
  }

  destroy(notify = true) {
    if (!this.completed && notify) {
      this.parties.forEach(party => {
        party.logging(
          `The trade with ${this.getOtherParty(party).getName()} was cancelled.`
        );
      });
    }
    this.items = {};
    this.accepted = {};
    const idx = world.trades.findIndex(trade => trade === this);
    if (idx !== -1) {
      world.trades.splice(idx, 1);
    }
    super.destroy();
  }

  static getCreatureTrades(creature) {
    return world.getTrades().filter(trade => trade.involves(creature));
  }

  static canAccessListing(listing, whose, who) {
    return (
      listing.listingTarget === TRADE_TARGETS.EVERYONE ||
      (listing.listingTarget === TRADE_TARGETS.NO_RIVALS &&
        !who.considersRival(whose)) ||
      (listing.listingTarget === TRADE_TARGETS.FRIENDS &&
        who.considersFriend(whose))
    );
  }

  static logTrading(who, withWhom, giving, getting, multiplier) {
    const itemName = tradeId =>
      Item.inferPayloadFromTradeId(who, JSON.parse(tradeId)).name;

    const describeItems = item =>
      `${itemName(item.tradeId)} (${item.qty * multiplier})`;

    const gettingDescribed =
      getting && getting.length
        ? `You received <span class="items"><b>${getting
            .map(describeItems)
            .join(", ")}</b></span>`
        : "";
    const givingDescribed =
      giving && giving.length
        ? `You gave <span class="items"><b>${giving
            .map(describeItems)
            .join(", ")}</b></span>`
        : "";

    const message = `<span class="trade">${withWhom.getName()} traded with you<br/>${gettingDescribed}${
      gettingDescribed && givingDescribed ? "<br/>" : ""
    }${givingDescribed}`;

    who.getPlayer().logging(message, LOGGING.NORMAL, true, EMOJIS.MONEY);
  }
}
module.exports = global.Trade = Trade;

Trade.startTradeAction = new Action({
  name: "Trade",
  icon: "/actions/icons8-coins-100.png",
  notification: false,
  quickAction: true,
  repeatable: false,
  valid(target, creature) {
    if (target === creature) {
      return false;
    }
    if (creature.isHostile(target)) {
      return false;
    }
    if (!target.getPlayer()) {
      return false;
    }
    if (target.isDead()) {
      return false;
    }
    return true;
  },
  runCheck(target, creature) {
    if (creature.isTradingWith(target)) {
      return "There is already a trade ongoing";
    }
    return true;
  },
  run(target, creature) {
    world.initTrade(creature, target);
    target.logging(`You have a new trade request from ${creature.getName()}.`);
    return false;
  }
});

server.registerHandler("cancelTrade", (params, player, connection) => {
  const trade = Entity.getById(params.trade);
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  if (!trade || !(trade instanceof Trade)) {
    return false;
  }

  if (!trade.involves(creature)) {
    return false;
  }

  trade.destroy();

  return true;
});

server.registerHandler("acceptTrade", (params, player, connection) => {
  const trade = Entity.getById(params.trade);
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  if (!trade || !(trade instanceof Trade)) {
    return false;
  }

  if (!trade.involves(creature)) {
    return false;
  }

  trade.markAccepted(creature);

  return true;
});

server.registerHandler("commenceTrade", (params, player, connection) => {
  const trade = Entity.getById(params.trade);
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  if (!trade || !(trade instanceof Trade)) {
    return false;
  }

  if (!trade.involves(creature)) {
    return false;
  }

  return trade.tryCommence();
});

server.registerHandler("setTradeItems", (params, player, connection) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  if (
    !params.items ||
    typeof params.items !== "object" ||
    !Array.isArray(params.items) ||
    !params.trade
  ) {
    return false;
  }
  const trade = Entity.getById(params.trade);
  if (!trade || !trade.involves(creature)) {
    return false;
  }

  const incorrectItems = params.items.filter(
    item =>
      !item.qty ||
      item.tradeId === "null" ||
      typeof item.qty !== "number" ||
      Object.keys(item).length !== 2 ||
      (!trade
        .getItems(creature)
        .some(currentItem => currentItem.tradeId === item.tradeId) &&
        !creature.items.some(
          i => JSON.stringify(i.getTradeId()) === item.tradeId
        ) &&
        (!creature.getHome() ||
          !creature
            .getHome()
            .getItems()
            .some(i => JSON.stringify(i.getTradeId()) === item.tradeId)))
  );

  if (incorrectItems.length) {
    utils.error("HACKING ATTEMPT!", player.email, params, incorrectItems);
    return false;
  }

  trade.setItems(creature, params.items);

  server.updatePlayer(connection);

  return true;
});

server.registerHandler("addListing", (params, player, connection) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  [...params.offering, ...params.asking].forEach(element => {
    const item = Item.inferPayloadFromTradeId(
      creature,
      JSON.parse(element.tradeId)
    );

    const itemConstrName = utils.fromKey(item.itemCode);
    if (
      !itemConstrName ||
      !element.tradeId ||
      !(global[itemConstrName].prototype instanceof Item) ||
      !creature.knowsItem(itemConstrName) ||
      +element.qty < 0
    ) {
      throw new Error("Invalid item picked for trade listing");
    }
  });

  if (
    +params.repetitions < 0 ||
    (creature.tradeListings || []).length > 100 ||
    (!params.asking.length && !params.offering.length) ||
    !Object.values(TRADE_TARGETS).includes(params.listingTarget)
  ) {
    return false;
  }

  const mapElements = elements =>
    elements.map(element => ({
      tradeId: element.tradeId,
      qty: element.qty
    }));

  creature.tradeListingId = creature.tradeListingId || 0;
  creature.tradeListingId += 1;

  creature.tradeListings = creature.tradeListings || [];
  creature.tradeListings.push({
    asking: mapElements(params.asking),
    offering: mapElements(params.offering),
    repetitions: params.repetitions,
    tradeListingId: creature.tradeListingId,
    listingTarget: params.listingTarget
  });

  server.updatePlayer(connection);

  return true;
});

server.registerHandler("removeListing", (params, player, connection) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  if (+params.tradeListingId < 0 || !creature.tradeListings) {
    return false;
  }

  const listingIdx = creature.tradeListings.findIndex(
    listing => listing.tradeListingId === params.tradeListingId
  );

  if (listingIdx === -1) {
    return false;
  }

  creature.tradeListings.splice(listingIdx, 1);

  server.updatePlayer(connection);

  return true;
});

server.registerHandler("acceptTradeListing", (params, player, connection) => {
  const creature = player.getCreature();
  const tradingWith = Entity.getById(params.creatureId);
  if (creature.noControlCheck()) {
    return;
  }

  if (!(tradingWith instanceof Humanoid)) {
    return false;
  }

  const listing = tradingWith.tradeListings.find(
    listing => listing.tradeListingId === params.tradeListingId
  );

  if (
    !listing ||
    listing.repetitions < 1 ||
    params.qty < 1 ||
    !Trade.canAccessListing(listing, tradingWith, creature)
  ) {
    return "Invalid trade";
  }

  let returnCode;
  let trades = 0;

  for (let i = 0; i < params.qty; i += 1) {
    const trade = new Trade({
      parties: [creature, tradingWith]
    });
    trade.setItems(creature, JSON.parse(JSON.stringify(listing.asking)));
    trade.setItems(tradingWith, JSON.parse(JSON.stringify(listing.offering)));

    returnCode = trade.commenceTrade();

    trade.destroy(false);

    if (returnCode === true) {
      listing.repetitions -= 1;
      trades += 1;
    } else {
      if (returnCode.includes(`doesn't have all the items`)) {
        returnCode = `You don't have all of the required items.`;
      }
      break;
    }
  }

  if (trades >= 1) {
    Trade.logTrading(
      tradingWith,
      creature,
      listing.offering,
      listing.asking,
      trades
    );
    Trade.logTrading(
      creature,
      tradingWith,
      listing.asking,
      listing.offering,
      trades
    );
  }

  return returnCode;
});

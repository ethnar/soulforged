const Item = require("../.item");
const Action = require("../../action");

const actions = Action.groupById([
  new Action({
    name: "Consume",
    dynamicLabel(entity) {
      return entity.consumeAction || "Consume";
    },
    notification: false,
    quickAction: true,
    defaultRepetitions: 1,
    icon: "/actions/icons8-restaurant-100.png",
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    runCheck(item, creature) {
      if (
        item.buffs &&
        item.buffs.energy &&
        creature.energy < -item.buffs.energy
      ) {
        return "You are too tired to consume this right now";
      }
      return true;
    },
    run(item, creature, seconds) {
      creature.actionProgress += (seconds * 100) / item.timeToDrink;

      if (creature.actionProgress >= 100) {
        const removed = item.consumed(creature);

        if (removed) {
          creature.actionOnSimilarItem(item);
        }
        creature.actionProgress -= 100;
        return false;
      }
      return true;
    }
  })
]);

class Drink extends Item {
  static actions() {
    return { ...actions, ...Item.actions() };
  }

  static getProps(creature, base, object) {
    const timedBuff = base.timedBuff || [];
    return {
      ...object,
      buffs: [
        ...Object.keys(utils.cleanup(base.buffs) || {}).map(stat => ({
          stat,
          value: base.buffs[stat],
          negative: NEGATIVE_BUFFS[stat]
        })),
        ...timedBuff.reduce(
          (acc, b) => [
            ...acc,
            ...Object.keys(b.effects).map(stat => ({
              value: b.effects[stat],
              discrete: DISCRETE_BUFFS[stat],
              percentage: PERCENTAGE_BUFFS[stat],
              duration: b.duration,
              negative: NEGATIVE_BUFFS[stat],
              multiplier: MULTIPLIER_BUFFS[stat],
              stat: stat
            }))
          ],
          []
        )
      ].toObject(b => b.stat),
      properties: {
        ...object.properties,
        nutrition: base.nutrition,
        diminishingReturn: timedBuff.length
          ? timedBuff.reduce(
              (acc, b) => [
                acc[0] > b.diminishingReturn ? b.diminishingReturn : acc[0],
                acc[1] < b.diminishingReturn ? b.diminishingReturn : acc[1]
              ],
              [Infinity, -Infinity]
            )
          : null
      }
    };
  }

  consumed(creature) {
    creature.applyDrinkBuff(this);
    return this.useUpItem();
  }

  getPayload(creature) {
    const result = super.getPayload(creature);
    return Drink.getProps(creature, this, result);
  }

  static getPayload(creature) {
    const result = super.getPayload(creature);
    return Drink.getProps(creature, this.prototype, result);
  }

  static inferPayload(creature, tradeId) {
    const result = Item.inferPayload(creature, tradeId);
    return Drink.getProps(creature, this.prototype, result);
  }
}
Object.assign(Drink.prototype, {
  name: "?Drink?",
  order: ITEMS_ORDER.USEABLE,
  timeToDrink: 1
});
module.exports = global.Drink = Drink;

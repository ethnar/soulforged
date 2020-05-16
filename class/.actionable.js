const actionCache = {};

class Actionable {
  getActions() {
    return {
      ...(this.actionsGetter ? this.actionsGetter() : {}),
      ...(this.constructor.actions ? this.constructor.actions() : {}),
      ...(this.constructor.registrableActions || {})
    };
  }

  getActionById(actionId, useCache = true) {
    if (useCache) {
      if (!actionCache[actionId]) {
        actionCache[actionId] = this.getActions()[actionId];
      }
      return actionCache[actionId];
    }
    return this.getActions()[actionId];
  }

  getActionsPayloads(creature) {
    return Object.values(this.getActions())
      .map(action => action.getPayload(this, creature))
      .filter(action => !!action);
  }

  getName() {
    if (this.dynamicName) {
      return this.dynamicName();
    }
    return this.name;
  }
}
module.exports = global.Actionable = Actionable;

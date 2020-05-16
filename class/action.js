const server = require("../singletons/server");

const contextualActions = {};
const actionsIdReserved = {};

class Action {
  constructor(args) {
    Object.assign(this, args);
    if (actionsIdReserved[args.name]) {
      throw new Error("Duplicate action ID: " + args.name);
    }
    actionsIdReserved[args.name] = true;
    this.name = args.name;
    this.validCallback = args.valid;
    this.cancellable = args.cancellable === undefined ? true : args.cancellable;
    this.availableCallback = args.available;
    this.run = args.run;
    this.actionJs = args.actionJs;
    this.payloadExtras = args.payloadExtras;
  }

  isValid(entity, creature, context) {
    return !this.validCallback || this.validCallback(entity, creature, context);
  }

  canDo(entity, creature, context) {
    return (
      this.isValid(entity, creature, context) &&
      this.checkAvailable(entity, creature, context)
    );
  }

  canRun(entity, creature, context, repetitions, extra) {
    return (
      this.isValid(entity, creature, context) &&
      this.checkAvailable(entity, creature, context) &&
      this.getRunCheck(entity, creature, context, repetitions, extra) === true
    );
  }

  getRunCheck(entity, creature, context, repetitions, extra) {
    return this.runCheck
      ? this.runCheck(entity, creature, context, repetitions, extra)
      : true;
  }

  checkAvailable(entity, creature, context) {
    return this.getAvailabilityMessage(entity, creature, context) === true;
  }

  getAvailabilityMessage(entity, creature, context) {
    if (!this.isAllowedDuringCombat() && creature.hasFightingEnemies()) {
      return "You cannot do this while enemies are attacking you.";
    }
    if (!this.isValid(entity, creature, context)) {
      return "Invalid action";
    }
    if (!this.availableCallback) {
      return true;
    }
    return this.availableCallback(entity, creature, context);
  }

  isAllowedDuringCombat() {
    return !this.notAllowedInCombat;
  }

  getActionTargetName(currentActionTarget) {
    return !this || this.hideTargetName
      ? null
      : currentActionTarget !== this &&
          currentActionTarget &&
          currentActionTarget.getName &&
          currentActionTarget.getName();
  }

  getPayload(entity, creature, current = false) {
    if (!this.isValid(entity, creature)) {
      return null;
    }
    return {
      id: this.getId(),
      context: this.context,
      name: this.getName(entity, creature, current),
      icon: this.getIcon(creature),
      quick: this.quickAction,
      cancellable: this.cancellable,
      queueable: this.queueable,
      secondaryAction: this.secondaryAction,
      repeatable: this.repeatable !== false,
      maxRepetitions: utils.getValue(this.maxRepetitions, entity, creature),
      defaultRepetitions: utils.getValue(
        this.defaultRepetitions,
        entity,
        creature
      ),
      difficulty: this.difficulty ? this.difficulty(entity, creature) : null,
      available: true,
      // available: this.canDo(entity, creature, this.context),
      // message: this.getAvailabilityMessage(entity, creature),
      actionJs: this.actionJs ? this.actionJs(creature) : null,
      ...(this.payloadExtras ? this.payloadExtras(entity, creature) : {})
    };
  }

  getIcon(creature) {
    return server.getImage(creature, this.icon);
  }

  getId() {
    return this.name;
  }

  getName(entity, creature, current) {
    if (this.dynamicLabel) {
      return this.dynamicLabel(entity, creature, current);
    }
    return this.name;
  }

  notificationEnabled(entity, creature) {
    if (this.notification === false) {
      return false;
    }
    if (typeof this.notification === "function") {
      return this.notification(entity, creature);
    }
    return true;
  }

  static getTarget(target, context, creature) {
    if (context && contextualActions[context]) {
      return contextualActions[context](target, context, creature);
    }
    return Entity.getById(target);
  }

  static registerContextualAction(context, targetGetter) {
    contextualActions[context] = targetGetter;
  }

  static groupById(arrayOfActions) {
    const result = {};
    arrayOfActions.forEach(action => (result[action.name] = action));
    return result;
  }
}
module.exports = global.Action = Action;

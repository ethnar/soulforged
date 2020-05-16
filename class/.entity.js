const Actionable = require("./.actionable");

let id = 1;
let entityMap = {};
const reservedIds = {};
const destroyHandlers = [];
const keyToClassMap = {};

class Entity extends Actionable {
  static getEntityMap() {
    return entityMap;
  }

  static getKeyToClassMap() {
    return keyToClassMap;
  }

  static setEntityMap(eM) {
    entityMap = {
      ...entityMap,
      ...eM
    };
  }

  static getById(id) {
    return entityMap[id];
  }

  static find(callback) {
    return Object.values(entityMap).find(callback);
  }

  static getEntities(ctrClass) {
    return Object.values(Entity.getEntityMap()).filter(
      entity => entity instanceof ctrClass
    );
  }

  static addAction(action) {
    this.registrableActions = this.registrableActions || {};
    this.registrableActions[action.name] = action;
  }

  static registerClass(name, prototype) {
    utils.registerClass(this, name, prototype);
  }

  static onDestroy(types, handler) {
    types.forEach(type => {
      destroyHandlers.push({
        type,
        handler
      });
    });
  }

  constructor(args) {
    super(args);
    while (entityMap[id] || reservedIds[id]) {
      id += 1;
    }
    this.id = id;
    entityMap[id] = this;
    id++;
    Object.assign(this, args);
  }

  destroy() {
    const id = this.getEntityId();
    this.entityDestroyed = true;
    reservedIds[id] = true;

    destroyHandlers.forEach(({ type, handler }) => {
      if (this instanceof global[type]) {
        handler(this);
      }
    });

    setTimeout(() => {
      delete reservedIds[id];
    }, 30 * SECONDS * IN_MILISECONDS);
    delete entityMap[id];
  }

  getEntityId() {
    return this.id;
  }

  getIcon(creature) {
    if (this.icon) {
      return server.getImage(creature, this.icon);
    }
    return this.constructor.getIcon(creature);
  }

  static getIcon(creature) {
    const icon = this.prototype.icon || this.icon;
    const player = creature.getPlayer();
    return server.getHttpResourceForPlayer(player, icon);
  }

  static getName() {
    if (this.prototype.dynamicName) {
      return this.prototype.dynamicName();
    }
    if (this.prototype.nameable) {
      return Nameable.getName(this.name);
    }
    return this.prototype.name;
  }

  getName() {
    if (this.hasOwnProperty("name")) {
      return this.name;
    }
    return this.constructor.getName();
  }

  atInterval(timing, callback, seconds = 1) {
    return utils.atInterval(timing, callback, seconds, this.getEntityId());
  }

  static isKnownBy() {
    return false;
  }

  static factory(classCtr, props) {
    global[classCtr.name] = classCtr;
    const nameable =
      props.nameable ||
      (props.nameable === undefined && classCtr.prototype.nameable);
    if (nameable) {
      const className = nameable === true ? classCtr.name : nameable;
      Nameable.byVoting(className, {
        voteWeight:
          global[className] &&
          global[className].nameableVoteWeight &&
          global[className].nameableVoteWeight.bind(global[className]),
        validation: {
          maxLength: 22
        },
        condition: (creature, entityClass) => {
          return global[entityClass].isKnownBy(creature);
        }
      });
      keyToClassMap[Nameable.getPublicKey(className)] =
        nameable === true ? classCtr : global[nameable];
    }
    Object.assign(classCtr.prototype, props);
    return classCtr;
  }
}

Object.assign(Entity.prototype, {
  name: "?Entity?",
  icon: "/placeholder.png"
});
module.exports = global.Entity = Entity;

setTimeout(() => {
  InformationProvider({
    info: "entity-description",
    provider: (player, { entityKey }) => {
      const classCtr = keyToClassMap[entityKey];
      return classCtr && classCtr.getDescription && classCtr.getDescription();
    }
  });
});

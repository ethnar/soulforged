const registry = {};
const NO_FACTION_NAME = "Factionless";

global.Faction = class Faction {
  constructor(args) {
    this.name = args.name;
    if (!this.name) {
      throw new Error("Faction must have a name");
    }
    registry[this.name] = this;
  }

  getName() {
    return this.name;
  }

  isHostile(toFaction) {
    return (
      (this.nameIs(NO_FACTION_NAME) || this !== toFaction) &&
      !this.hasPeaceWith(toFaction)
    );
  }

  hasPeaceWith(aFaction) {
    world.factionsAtPeace = world.factionsAtPeace || {};
    const id = Faction.getRelationshipId(this, aFaction);
    return world.factionsAtPeace[id] === "peace";
  }

  markAtPeaceWith(aFaction) {
    world.factionsAtPeace = world.factionsAtPeace || {};
    const id = Faction.getRelationshipId(this, aFaction);
    world.factionsAtPeace[id] = "peace";
  }

  markAtWarWith(aFaction) {
    world.factionsAtPeace = world.factionsAtPeace || {};
    const id = Faction.getRelationshipId(this, aFaction);
    delete world.factionsAtPeace[id];
  }

  nameIs(name) {
    return this.name === name;
  }

  static getRelationshipId(faction1, faction2) {
    return JSON.stringify([faction1.getName(), faction2.getName()].sort());
  }

  static getDefaultFaction() {
    return Faction.getByName(NO_FACTION_NAME);
  }

  static getByName(name) {
    if (!registry[name]) {
      new Faction({
        name
      });
    }
    return registry[name];
  }
};

utils.prepareRegistry(registry, Faction, faction => faction.name);

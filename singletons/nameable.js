global.Nameable = {
  definitions: [],
  globalDefinitions: {},

  getPublicKey(string) {
    if (!string || !Nameable.globalDefinitions[string]) {
      return undefined;
    }
    return utils.getKey(string);
  },

  getSimpleVoteCache() {
    world.voteCache = world.voteCache || {
      name: {},
      votes: {}
    };
    return world.voteCache;
  },

  getName(entity) {
    if (Nameable.getSimpleVoteCache().name[entity] === undefined) {
      Nameable.updateVotedName(entity);
    }
    return Nameable.getSimpleVoteCache().name[entity] || "Unnamed";
  },

  byVoting(properties, options) {
    if (options) {
      Nameable.globalDefinitions[properties] = options;
      return;
    }
    Nameable.definitions.push(properties);
  },

  getProps(entity) {
    if (typeof entity === "string") {
      return Nameable.globalDefinitions[entity];
    }
    return Nameable.definitions.find(
      def => entity instanceof global[def.className]
    );
  },

  canVote(creature, entity) {
    return !Nameable.canVoteError(creature, entity);
  },

  canVoteError(creature, entity) {
    if (!entity) {
      return "Not a valid entity";
    }
    const properties = Nameable.getProps(entity);
    if (!properties) {
      return "Not nameable";
    }
    if (!properties.condition || !properties.condition(creature, entity)) {
      return "Condition not met";
    }
    return false;
  },

  resetVotes(entity) {
    if (Nameable.simple(entity)) {
      delete Nameable.getSimpleVoteCache().name[entity];
      Nameable.getSimpleVoteCache().votes[entity] = {};
    } else {
      entity._nameVotes = {};
      const properties = Nameable.getProps(entity);
      entity[properties.property] = null;
    }
  },

  castVote(creature, entity, name) {
    name = name && name.replace(/[‘’`´']/g, "'");
    const canVoteError = Nameable.canVoteError(creature, entity);
    if (canVoteError) {
      return "You can't name this: " + canVoteError;
    }
    const properties = Nameable.getProps(entity);
    if (
      name &&
      (typeof name !== "string" ||
        (properties.validation.maxLength &&
          name.length > properties.validation.maxLength))
    ) {
      return "The name is too long";
    }
    if (name && !name.match(/^[a-zA-Z ']+$/)) {
      return "Only letters, spaces and apostrophes are allowed";
    }
    const nameVotes = Nameable.getNameVotes(entity);
    if (name) {
      nameVotes[creature.getPlayer().getEntityId()] = name;
    } else {
      delete nameVotes[creature.getPlayer().getEntityId()];
    }
    Nameable.updateVotedName(entity);
    return true;
  },

  simple(entity) {
    return typeof entity === "string";
  },

  updateVotedName(entity) {
    const properties = Nameable.getProps(entity);
    const counts = Nameable.getVotesCounts(entity);
    const oldName = Nameable.simple(entity)
      ? Nameable.getSimpleVoteCache().name[entity]
      : entity[properties.property];
    const newValue = Object.keys(counts).reduce(
      (mostPopular, name) =>
        !mostPopular ||
        counts[name] > counts[mostPopular] ||
        (counts[name] === counts[mostPopular] && name === oldName)
          ? name
          : mostPopular,
      null
    );

    if (typeof entity === "string") {
      Nameable.getSimpleVoteCache().name[entity] = newValue;
    } else {
      const triggerEvent =
        entity[properties.property] !== newValue && entity.onNameChange;

      entity[properties.property] = newValue;

      if (triggerEvent) {
        entity.onNameChange(newValue);
      }
    }
  },

  getNameVotes(entity) {
    return Nameable.simple(entity)
      ? (Nameable.getSimpleVoteCache().votes[entity] =
          Nameable.getSimpleVoteCache().votes[entity] || {})
      : (entity._nameVotes = entity._nameVotes || {});
  },

  getVotesCounts(entity) {
    const nameVotes = Nameable.getNameVotes(entity);
    const properties = Nameable.getProps(entity);

    return Object.keys(utils.cleanup(nameVotes)).reduce((counts, playerId) => {
      const name = nameVotes[playerId];
      const player = Entity.getById(playerId);
      if (!(player instanceof Player)) {
        return counts;
      }
      const creature = player.getCreature();
      if (!creature || creature.isDead()) {
        return counts;
      }
      if (properties.condition && properties.condition(creature, entity)) {
        const voteWeight = properties.voteWeight
          ? properties.voteWeight(creature, entity)
          : 1;
        counts[name] = counts[name] || 0;
        counts[name] += voteWeight;
      }
      return counts;
    }, {});
  },

  getVotes(creature, entity) {
    if (!Nameable.canVote(creature, entity)) {
      return {
        counts: {},
        playerOwnPreference: ""
      };
    }
    const nameVotes = Nameable.getNameVotes(entity);

    return {
      counts: Nameable.getVotesCounts(entity),
      playerOwnPreference: nameVotes[creature.getPlayer().getEntityId()]
    };
  },

  hasVoted(creature, entity) {
    const nameVotes = Nameable.getNameVotes(entity);
    const player = creature.getPlayer();
    return !!(nameVotes || {})[player && player.getEntityId()];
  },

  defaultName(entity, defaultName) {
    return Player.list
      .filter(p => p.creature)
      .filter(p => {
        const result = Nameable.castVote(p.creature, entity, defaultName);
        return result === true;
      });
  }
};

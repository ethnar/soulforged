global.PET_HUNTS = {};
const hunting = (animals, validPets = []) => {
  const key = `hunting${animals}`;
  return {
    [key]: (PET_HUNTS[key] = {
      animals,
      getName: () => `Hunting ${Nameable.getName(animals)}`,
      desc: () =>
        `Your pet will occasionally hunt for ${Nameable.getName(animals)}`,
      requiredBond: 2,
      validPets: validPets.length ? validPets : undefined
    })
  };
};

const INTERACT_DIFFICULTY_MOD = 0.5;
const TRAIN_DIFFICULTY_MOD = 1;

const isSick = pet => {
  return global.ILLNESSES.some(illness => pet.hasBuff(illness));
};
const isInPain = pet => {
  return pet.painThresholdTiered <= 50;
};

const calculateRating = (pet, base, adds) => {
  let result = base;
  if (adds.byPetType) {
    result += adds.byPetType[pet.constructor.name] || 0;
  }
  result += isSick(pet) ? adds.whenSick : 0;
  result += isInPain(pet) ? adds.whenInPain : 0;
  result +=
    (adds.byBond * PetTrainingSystem.getCurrentOwnerBondLevel(pet)) / 10;
  return result;
};

global.TRAINABLES = {
  healFaster: {
    getName: () => "Resilient",
    desc: () => "Your pet will recover from their wounds faster.",
    requiredBond: 1,
    levels: 3,
    onLearn: pet => {
      pet.damageTime = Object.keys(pet.damageTime).toObject(
        damageType => damageType,
        damageType => pet.damageTime[damageType] * 0.8
      );
    }
  },
  lessHungry: {
    getName: () => "Voracious",
    desc: () =>
      "Your pet gets more out of their meals, needing feeding less frequently.",
    requiredBond: 2,
    levels: 3,
    onLearn: pet => {
      pet.stomachSeconds = pet.stomachSeconds * 1.25;
    }
  },
  bondMore: {
    getName: () => "Friendly",
    desc: () => "Your pet bonds with you more easily.",
    levels: 3
  },
  callOver: {
    getName: () => "Beckon",
    desc: () =>
      "You are able to order your pet to follow you from some distance.",
    requiredBond: 4
  },
  moreDamage: {
    getName: () => "Mighty",
    desc: () => "Your pet deals increased damage.",
    levels: 3,
    onLearn: pet => {
      pet.defaultWeapon = Object.keys(pet.defaultWeapon).toObject(
        damageType => damageType,
        damageType => pet.defaultWeapon[damageType] + 2
      );
    }
  },
  moreDodge: {
    getName: () => "Sprightly",
    desc: () => "Your pet dodges more often.",
    levels: 3,
    onLearn: pet => {
      pet.dodgeRating = pet.dodgeRating + 10;
    }
  },
  moreArmor: {
    getName: () => "Tough",
    desc: () => "Your pet is more resistant to damage.",
    levels: 3,
    onLearn: pet => {
      pet.defaultArmor = Object.keys(pet.defaultArmor).toObject(
        damageType => damageType,
        damageType => pet.defaultArmor[damageType] + 2
      );
    }
  },
  fasterMovement: {
    getName: () => "Swift",
    desc: () => "Your pet moves faster.",
    levels: 3,
    invalidPets: ["Bear"],
    onLearn: pet => {
      pet.travelSpeed = pet.travelSpeed + 0.2;
    }
  },
  moreWebs: {
    getName: () => "Spinner",
    desc: () => "Your pet spins more webs.",
    validPets: ["ForestSpider", "CaveSpider"],
    levels: 3
  },
  websInTheHouse: {
    getName: () => "Homespinner",
    desc: () => "Your pet will spin their webs in your house when possible.",
    requiredBond: 5,
    validPets: ["ForestSpider", "CaveSpider"]
  },
  nuzzleOften: {
    getName: () => "Cuddly",
    desc: () => "Your pet will interact with you more often.",
    levels: 3,
    invalidPets: ["ForestSpider", "CaveSpider"]
  },
  moreTrainingOptions: {
    getName: () => "Adaptable",
    desc: () =>
      "You will have more options to choose from when training your pet."
  },
  warnOfHostiles: {
    getName: () => "Cautious",
    desc: () =>
      "Your pet will try to warn you at some distance when enemies are approaching them.",
    requiredBond: 4,
    validPets: ["Wolf", "Lion"],
    soundName: {
      Wolf: "Howl",
      Lion: "Roar"
    }
  },
  stopWandering: {
    getName: () => "Composed",
    desc: () => "Your pet is less likely to wander off at times.",
    requiredBond: 2,
    levels: 3,
    validPets: ["Lion"]
  },
  stopScratching: {
    getName: () => "Careful",
    desc: () =>
      "Your pet is less likely to injure you when you try to interact with it.",
    levels: 3
  },
  stopPooping: {
    getName: () => "Obedient",
    desc: () =>
      "Your pet is less likely to leave their droppings in your house.",
    requiredBond: 3,
    levels: 3,
    invalidPets: ["ForestSpider", "CaveSpider"]
  },
  ...hunting("Rabbits", ["Wolf", "Bear", "ForestSpider", "CaveSpider"]),
  ...hunting("TurodoHerd", ["Direwolf", "Wolf", "Bear", "CaveSpider"]),
  ...hunting("Deers", ["Direwolf", "Wolf", "Lion"])

  // Tracking dens (?)
  // Nuzzle more effective (?)
};

const buffFactory = props => {
  const classNamePiece = props.name.replace(/ [a-z]/g, l => l[1].toUpperCase());
  const buff = utils.newClassExtending(
    `BuffPetInteract${classNamePiece}`,
    Buff
  );
  Object.assign(buff.prototype, props);
  return buff;
};

global.PET_INTERACTIONS = {
  "Play Fight": {
    buff: buffFactory({
      name: "Play Fight",
      icon: `/${ICONS_PATH}/pets/red.png`,
      category: Buff.CATEGORIES.INTERACTION,
      visible: true,
      duration: 2 * HOURS,
      effects: {
        [BUFFS.COMBAT_STRENGTH]: 125
      }
    }),
    failRating: pet =>
      calculateRating(pet, 70, {
        byPetType: {
          ForestSpider: +15,
          CaveSpider: +25
        },
        whenSick: -5,
        whenInPain: -5,
        byBond: -60
      }),
    bondGain: pet =>
      calculateRating(pet, 10, {
        byPetType: {
          ForestSpider: -20,
          CaveSpider: -30,
          Direwolf: +5,
          Wolf: +5
        },
        whenSick: -10,
        whenInPain: -10,
        byBond: +10
      })
  },
  "Rub Belly": {
    buff: buffFactory({
      name: "Rub Belly",
      icon: `/${ICONS_PATH}/pets/purple.png`,
      category: Buff.CATEGORIES.INTERACTION,
      visible: true,
      duration: 2 * HOURS,
      effects: {
        [BUFFS.BLEEDING_MULTIPLIER]: 60
      }
    }),
    failRating: pet =>
      calculateRating(pet, 35, {
        byPetType: {
          Lion: +35
        },
        whenSick: +20,
        whenInPain: -10,
        byBond: -35
      }),
    bondGain: pet =>
      calculateRating(pet, 10, {
        byPetType: {
          Lion: +5
        },
        whenSick: +2,
        whenInPain: +2,
        byBond: +5
      })
  },
  "Pat on the Head": {
    buff: buffFactory({
      name: "Pat on the Head",
      icon: `/${ICONS_PATH}/pets/green.png`,
      category: Buff.CATEGORIES.INTERACTION,
      visible: true,
      duration: 2 * HOURS,
      effects: {
        [BUFFS.ACTION_SPEED]: 130
      }
    }),
    failRating: pet =>
      calculateRating(pet, 25, {
        byPetType: {
          Bear: +10
        },
        whenSick: -5,
        whenInPain: -5,
        byBond: -40
      }),
    bondGain: pet =>
      calculateRating(pet, 10, {
        byPetType: {
          Bear: +5
        },
        whenSick: +2,
        whenInPain: +2,
        byBond: -2
      })
  },
  "Caress Back": {
    buff: buffFactory({
      name: "Caress Back",
      icon: `/${ICONS_PATH}/pets/yellow.png`,
      category: Buff.CATEGORIES.INTERACTION,
      visible: true,
      duration: 2 * HOURS,
      effects: {
        [BUFFS.PAIN]: -20
      }
    }),
    failRating: pet =>
      calculateRating(pet, 15, {
        byPetType: {
          Wolf: +5,
          Direwolf: +15
        },
        whenSick: -10,
        whenInPain: -10,
        byBond: -45
      }),
    bondGain: pet =>
      calculateRating(pet, 5, {
        byPetType: {
          Lion: +5,
          ForestSpider: -6,
          CaveSpider: -4
        },
        whenSick: +20,
        whenInPain: -10,
        byBond: -4
      })
  },
  "Play fetch": {
    buff: buffFactory({
      name: "Play Fetch",
      icon: `/${ICONS_PATH}/pets/blue.png`,
      category: Buff.CATEGORIES.INTERACTION,
      visible: true,
      duration: 2 * HOURS,
      effects: {
        [BUFFS.DODGE_MULTIPLIER]: 120
      }
    }),
    failRating: pet =>
      calculateRating(pet, 0, {
        byPetType: {
          Lion: +15,
          ForestSpider: +15,
          CaveSpider: +25
        },
        whenSick: 0,
        whenInPain: 0,
        byBond: 0
      }),
    bondGain: pet =>
      calculateRating(pet, 3, {
        byPetType: {
          Lion: -15,
          ForestSpider: -4,
          CaveSpider: -4,
          Wolf: +2,
          Direwolf: +1
        },
        whenSick: -20,
        whenInPain: -5,
        byBond: +5
      })
  }
};

class BuffTaming extends Buff {}
Object.assign(BuffTaming.prototype, {
  name: "Taming",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/gray_10.png`,
  duration: 15 * MINUTES,
  visible: true,
  category: Buff.CATEGORIES.WOUND
});
global.BuffTaming = BuffTaming;

const trainableValid = (trainable, petTypeId) =>
  (!trainable.invalidPets || !trainable.invalidPets.includes(petTypeId)) &&
  (!trainable.validPets || trainable.validPets.includes(petTypeId));

const interactionAction = (name, overrides = {}) => {
  return new Action({
    name: `InteractPet${name}`,
    dynamicLabel: () => name,
    notification: false,
    quickAction: true,
    repeatable: false,
    secondaryAction: true,
    valid(target, creature) {
      if (target === creature) {
        return false;
      }
      if (creature.isHostile(target)) {
        return false;
      }
      if (!target.tamed) {
        return false;
      }
      if (target.tamed.owner !== creature) {
        return false;
      }
      if (target.isDead()) {
        return false;
      }
      if (overrides.extraValid) {
        return overrides.extraValid(target, creature);
      }
      return true;
    },
    runCheck(target, creature) {
      if (
        (!PetTrainingSystem.getTrainingLevel(target, "callOver") ||
          !creature.seesNode(target.getNode())) &&
        creature.getNode() !== target.getNode()
      ) {
        return "You must be in the same location to interact";
      }
      return true;
    },
    ...overrides
  });
};

const actions = [
  new Action({
    name: "Tame",
    icon: "/actions/icons8-bell-100.png",
    notification: true,
    repeatable: false,
    breaksHiding: true,
    difficulty: (entity, creature) =>
      creature.getDifficultyLabel(SKILLS.TAMING, entity.getTamingSkillLevel()),
    valid(entity, creature) {
      if (!entity.taming) {
        return false;
      }
      if (entity.isDead()) {
        return false;
      }
      if (!creature.knowsItem(global[entity.taming.tool].name)) {
        return false;
      }
      if (!creature.isHostile(entity)) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (creature.getNode() !== entity.getNode()) {
        return "You must be in the same location to do this.";
      }
      if (!creature.hasItemType(global[entity.taming.food].name)) {
        return `You need ${global[entity.taming.food].getName()} to do this.`;
      }
      if (!(creature.getTool() instanceof global[entity.taming.tool])) {
        return `You need ${global[
          entity.taming.tool
        ].getName()} equipped as a tool.`;
      }
      return true;
    },
    run(entity, creature, seconds) {
      creature.actionProgress +=
        (seconds * utils.random(50, 150)) / creature.attackDelay;

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        // creature.attemptToTame(entity);
        const tamingSuccess = creature.getSkillSuccessChance(
          SKILLS.TAMING,
          entity.getTamingSkillLevel()
        );

        const experienceGained = 5 * MINUTES;
        const skillGainMultiplier = creature.getSkillGainDifficultyMultiplier(
          SKILLS.TAMING,
          entity.getTamingSkillLevel()
        );

        const success = utils.chance(tamingSuccess);
        const consumeMeatHit = global[entity.taming.food];
        const useMeat = success || utils.chance(10);

        if (useMeat) {
          creature.spendMaterials({
            [global[entity.taming.food].name]: 1
          });
        }

        if (success) {
          creature.gainSkill(
            SKILLS.TAMING,
            experienceGained,
            skillGainMultiplier
          );
          creature.gainStatsFromSkill(
            SKILLS.TAMING,
            creature.getTimeSpentOnAction() * 2
          );

          const buff = entity.addBuff(BuffTaming, {
            source: creature,
            stacks: utils.random(...entity.taming.tamenessGains)
          });

          const tameness = entity
            .getBuffs()
            .filter(b => b instanceof BuffTaming)
            .reduce((acc, b) => acc + b.stacks, 0);

          if (tameness >= 100) {
            const potentialOwners = entity
              .getBuffs()
              .filter(b => b instanceof BuffTaming)
              .filter(b =>
                b.source.hasItemType(global[entity.taming.tool].name)
              )
              .reduce((acc, b) => {
                acc[b.source.id] = acc[b.source.id] || 0;
                acc[b.source.id] += b.stacks;
                return acc;
              }, {});
            const max = Object.values(potentialOwners).reduce(
              (acc, v) => Math.max(acc, v),
              0
            );
            const newOwnerId = utils.randomItem(
              Object.keys(potentialOwners).filter(
                id => potentialOwners[id] === max
              )
            );

            const newOwner = Entity.getById(newOwnerId);
            creature.spendMaterials({
              [global[entity.taming.tool].name]: 1
            });

            newOwner.triggerQuestEvent("animalTamed", entity);
            entity.turnTamed(newOwner);
            newOwner.stopAction(true, false, true);
          }

          fightingFeedback.reportHit(creature, entity, [
            buff,
            ...(useMeat ? [consumeMeatHit] : [])
          ]);
        } else {
          creature.gainSkill(
            SKILLS.TAMING,
            experienceGained / 2,
            skillGainMultiplier
          );
          creature.gainStatsFromSkill(
            SKILLS.TAMING,
            creature.getTimeSpentOnAction() * 2
          );
          if (useMeat) {
            fightingFeedback.reportHit(
              creature,
              entity,
              useMeat ? [consumeMeatHit] : []
            );
          } else {
            fightingFeedback.reportMiss(creature, entity);
          }
        }
        entity.attack(creature);
      }
      return ACTION.CONTINUE;
    }
  }),
  interactionAction("Feed", {
    icon: "/actions/icons8-restaurant-100.png",
    secondaryAction: false,
    run: (target, creature) => {
      const foodName = global[target.taming.food].name;
      const nutrition = global[foodName].prototype.nutrition;
      if (target.satiated + nutrition > 100) {
        creature.logging(
          `${target.name} is too full to eat right now.`,
          LOGGING.IMMEDIATE_ERROR
        );
        return;
      }
      if (!creature.hasItemType(foodName)) {
        creature.logging(
          `You need ${global[foodName].getName()} to do this.`,
          LOGGING.IMMEDIATE_ERROR
        );
        return;
      }
      while (
        target.satiated + nutrition <= 100 &&
        creature.hasItemType(foodName)
      ) {
        creature.spendMaterials({
          [foodName]: 1
        });
        target.satiated += nutrition;
        PetTrainingSystem.gainBondPoints(target, nutrition / 10);
      }
    },
    extraValid(target, creature) {
      return target.satiated <= 85;
    }
  }),
  interactionAction("Stop following me", {
    icon: "/actions/icons8-treasure-map-off-100.png",
    run: (target, creature) => {
      FollowSystem.stopFollowing(target);
    },
    extraValid(target, creature) {
      return FollowSystem.isFollowing(target, creature);
    }
  }),
  interactionAction("Follow me", {
    icon: "/actions/icons8-treasure-map-100.png",
    run: (target, creature) => {
      FollowSystem.makeFollow(target, target.tamed.owner);
    },
    extraValid(target, creature) {
      return !FollowSystem.isFollowing(target, creature);
    }
  }),
  interactionAction("Rename", {
    icon: "/actions/icons8-chat-bubble-100.png",
    run: (target, creature) => {
      const newName = creature.currentAction.extra.name;
      if (
        DISALLOWED_USERNAME_WORDS.some(word =>
          newName.toLowerCase().includes(word)
        )
      ) {
        creature.logging(
          "Provided name includes forbidden word",
          LOGGING.IMMEDIATE_ERROR
        );
        return;
      }
      if (
        !/^[A-Za-z]+( [A-Za-z]+)?$/.test(newName) ||
        newName.length > 12 ||
        newName.length < 4
      ) {
        creature.logging(
          "Pet name must be between 4 and 12 characters and include only letters and up to one space.",
          LOGGING.IMMEDIATE_ERROR
        );
        return;
      }
      target.name = newName;
    },
    ...utils.jsAction("/js/actions/pet-rename")
  }),
  interactionAction("Assign new owner", {
    icon: "/actions/icons8-user-male-arrow-100.png",
    run: (target, creature) => {
      const newOwner = Entity.getById(creature.currentAction.extra.creatureId);

      if (
        !(newOwner instanceof Humanoid) ||
        creature.isHostile(newOwner) ||
        newOwner.isDead() ||
        newOwner.getNode() !== creature.getNode()
      ) {
        creature.logging("Invalid action", LOGGING.IMMEDIATE_ERROR);
        return;
      }
      target.tamed.owner = newOwner;
      FollowSystem.makeFollow(target, target.tamed.owner);
    },
    ...utils.jsAction("/js/actions/pet-reassign")
  }),
  new Action({
    name: "PetInteract",
    dynamicLabel: () => "Interact",
    icon: "/actions/icons8-dog-sit-2-100.png",
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
      if (!target.tamed) {
        return false;
      }
      if (target.tamed.owner !== creature) {
        return false;
      }
      if (target.isDead()) {
        return false;
      }
      if (!PetTrainingSystem.canBeInteracted(target)) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to train the pet";
      }
      return true;
    },
    difficulty: (target, creature) =>
      creature.getDifficultyLabel(
        SKILLS.TAMING,
        target.taming.skillLevel + INTERACT_DIFFICULTY_MOD
      ),
    payloadExtras(target, creature) {
      return {
        interactions: PetTrainingSystem.getInteractionsPayload(target)
      };
    },
    run(target, creature, seconds) {
      const actionTime = 8 * SECONDS;
      const baseTime = 20 * MINUTES;
      const skillLevel = target.taming.skillLevel + INTERACT_DIFFICULTY_MOD;
      if (creature.progressingAction(seconds, actionTime, SKILLS.TAMING)) {
        const successChance = creature.getSkillSuccessChance(
          SKILLS.TAMING,
          skillLevel
        );

        let skillExperience = baseTime;
        const extra = creature.currentAction.extra;

        const successRating = successChance + utils.random(1, 100);
        creature.gainSkill(
          SKILLS.TAMING,
          (skillExperience * successRating) / 100,
          creature.getSkillGainDifficultyMultiplier(SKILLS.TAMING, skillLevel)
        );
        creature.gainStatsFromSkill(
          SKILLS.TAMING,
          creature.getTimeSpentOnAction()
        );

        PetTrainingSystem.interact(target, extra, successRating, successChance);
        return false;
      }
      return true;
    },
    ...utils.jsAction("/js/actions/pet-interact")
  }),
  new Action({
    name: "PetTrain",
    dynamicLabel: () => "Train",
    icon: "/actions/icons8-dog-sit-100.png",
    notification: false,
    quickAction: false,
    repeatable: false,
    valid(target, creature) {
      if (target === creature) {
        return false;
      }
      if (creature.isHostile(target)) {
        return false;
      }
      if (!target.tamed) {
        return false;
      }
      if (target.tamed.owner !== creature) {
        return false;
      }
      if (target.isDead()) {
        return false;
      }
      if (!PetTrainingSystem.canGetTrained(target)) {
        return false;
      }
      return true;
    },
    runCheck(target, creature) {
      if (creature.getNode() !== target.getNode()) {
        return "You must be in the same location to train the pet";
      }
      return true;
    },
    payloadExtras(target, creature) {
      return {
        trainingOptions: PetTrainingSystem.availableTrainings(target).map(
          trainableId => ({
            trainingId: trainableId,
            name: TRAINABLES[trainableId].getName(),
            description: TRAINABLES[trainableId].desc(),
            level: TRAINABLES[trainableId].levels
              ? utils.romanLiterals(
                  PetTrainingSystem.getTrainingLevel(target, trainableId) + 1
                )
              : null
          })
        )
      };
    },
    difficulty: (target, creature) =>
      creature.getDifficultyLabel(
        SKILLS.TAMING,
        target.taming.skillLevel + TRAIN_DIFFICULTY_MOD
      ),
    run(target, creature, seconds) {
      const baseTime = 1 * HOURS;
      const skillLevel = target.taming.skillLevel + TRAIN_DIFFICULTY_MOD;
      if (creature.progressingAction(seconds, baseTime, SKILLS.TAMING)) {
        const successChance = creature.getSkillSuccessChance(
          SKILLS.TAMING,
          skillLevel
        );

        let skillExperience = baseTime;
        const skillGainMultiplier = creature.getSkillGainDifficultyMultiplier(
          SKILLS.TAMING,
          skillLevel
        );
        const extra = creature.currentAction.extra;

        if (utils.chance(successChance)) {
          creature.gainSkill(
            SKILLS.TAMING,
            skillExperience,
            skillGainMultiplier
          );
          creature.gainStatsFromSkill(
            SKILLS.TAMING,
            creature.getTimeSpentOnAction()
          );

          PetTrainingSystem.gainTrainable(target, extra);
          creature.logging(
            `${target.getName()} is very receptive to your training attempts. They learned "${TRAINABLES[
              extra
            ].getName()}".`
          );
        } else {
          creature.gainSkill(
            SKILLS.TAMING,
            skillExperience / 6,
            skillGainMultiplier
          );
          creature.gainStatsFromSkill(
            SKILLS.TAMING,
            creature.getTimeSpentOnAction()
          );
          creature.logging(
            `You are having difficulties training ${target.getName()}. You didn't manage to teach them "${TRAINABLES[
              extra
            ].getName()}".`
          );
        }
        return ACTION.FINISHED;
      }

      return ACTION.CONTINUE;
    },
    ...utils.jsAction("/js/actions/pet-train")
  })
];

module.exports = global.PetTrainingSystem = {
  getTrainings(pet) {
    return (pet.tamed && pet.tamed.trainings) || {};
  },

  getBondLevelName(level) {
    switch (level) {
      case 0:
        return "Rebellious";
      case 1:
        return "Unruly";
      case 2:
        return "Submissive";
      case 3:
        return "Biddable";
      case 4:
        return "Dependable";
      case 5:
        return "Trusty";
      case 6:
        return "Fond";
      case 7:
        return "Attached";
      default:
        return "Faithful";
    }
  },

  getTrainingsPayload(pet) {
    const trainings = PetTrainingSystem.getTrainings(pet);
    return Object.keys(trainings).map(trainableId => {
      const trainable = TRAINABLES[trainableId];
      return {
        name: `${trainable.getName()}${
          trainable.levels
            ? " " + utils.romanLiterals(trainings[trainableId])
            : ""
        }`,
        description: trainable.desc()
      };
    });
  },

  getInteractionsPayload(pet) {
    return Object.keys(PET_INTERACTIONS);
  },

  getBond(pet) {
    if (!pet.tamed) {
      return false;
    }
    const ownerId = pet.tamed.owner.getEntityId();
    const bonds = (pet.tamed.bonds = pet.tamed.bonds || {});
    const bond = (bonds[ownerId] = bonds[ownerId] || {});
    bond.points = bond.points || 0;
    bond.level = bond.level || 0;
    pet.tamed.trainings = pet.tamed.trainings || {};
    pet.tamed.trainingsLevel = pet.tamed.trainingsLevel || 0;
    return bond;
  },

  gainBondPoints(pet, points) {
    const bond = PetTrainingSystem.getBond(pet);
    if (!bond) {
      return false;
    }
    bond.points += points;

    const mult = 100;
    const base = 1.5;
    // const expNeeded = level => mult * ((1 - Math.pow(base, level)) / (1 - base));
    const levelGained = exp =>
      utils.mathLog(base, 1 - (exp / mult) * (1 - base));

    bond.level = Math.floor(levelGained(bond.points));

    return true;
  },

  getCurrentOwnerBondLevel(pet) {
    const bond = PetTrainingSystem.getBond(pet);
    return bond.level || 0;
  },

  canGetTrained(pet) {
    const bond = PetTrainingSystem.getBond(pet);
    if (!bond) {
      return false;
    }
    if (
      pet.tamed.trainingsLevel >=
      PetTrainingSystem.getCurrentOwnerBondLevel(pet)
    ) {
      return false;
    }
    return true;
  },

  canBeInteracted(pet) {
    if (!pet.tamed) {
      return;
    }
    let { nextInteraction } = pet.tamed;
    pet.tamed.availableInteractions = pet.tamed.availableInteractions || 0;

    if (!nextInteraction) {
      nextInteraction = world.getCurrentTime().getTime();
    }

    const fasterBondLevel = PetTrainingSystem.getTrainingLevel(pet, "bondMore");
    const minTime = (3 - fasterBondLevel * 0.3) * HOURS;
    const maxTime = (5 - fasterBondLevel * 0.5) * HOURS;
    while (nextInteraction <= world.getCurrentTime().getTime()) {
      pet.tamed.availableInteractions += 1;
      pet.tamed.availableInteractions = utils.limit(
        pet.tamed.availableInteractions,
        0,
        5 + fasterBondLevel
      );
      nextInteraction += utils.random(minTime, maxTime) * IN_MILISECONDS;
    }
    pet.tamed.nextInteraction = nextInteraction;

    return pet.tamed.availableInteractions > 0;
  },

  interact(pet, actionCode, successRating, successChance) {
    if (!pet.tamed) {
      return;
    }
    const action = PET_INTERACTIONS[actionCode];
    if (!action) {
      return;
    }
    pet.tamed.availableInteractions -= 1;

    const baseFailRating = action.failRating(pet);
    const baseBondGain = action.bondGain(pet);

    successRating = utils.limit(successRating, 0, 100);
    const injuryChance = 100 - ((100 - baseFailRating) * successRating) / 100;
    const bondGain = (baseBondGain * successRating) / 100;

    let message = "";

    pet.removeBuff(action.buff.name);

    const bondLevel = PetTrainingSystem.getCurrentOwnerBondLevel(pet);
    const buffLevel = Math.min(1, Math.round(bondGain * (2 + bondLevel)) / 100);
    if (buffLevel > 0) {
      pet.addBuff(action.buff, {
        level: buffLevel
      });
    }

    PetTrainingSystem.gainBondPoints(pet, bondGain);
    let notify = false;
    switch (true) {
      case bondGain < 0.1:
        message = `${pet.getName()} seems disengaged. `;
        break;
      case bondGain < 2:
        message = `${pet.getName()} seems to engage with you reluctantly. `;
        break;
      case bondGain < 5:
        message = `${pet.getName()} seems to enjoy your attention. `;
        break;
      default:
        message = `${pet.getName()} seems thrilled to receive your attention. `;
    }

    const injuryAvoidance = PetTrainingSystem.getTrainingLevel(
      pet,
      "stopScratching"
    );
    if (utils.chance(injuryChance)) {
      if (utils.chance(100 - injuryAvoidance * 35)) {
        const damage = pet.dealDamage(
          pet.tamed.owner,
          (4 * (120 - successChance)) / 100
        );
        if (damage && damage.length) {
          message += `${
            bondGain < 0.1
              ? "Worse yet they assaulted and injured you!"
              : "However, they injured you by accident!"
          } (${damage
            .map(b => b.stacks + " " + utils.pluralize(b.name, b.stacks))
            .join(", ")})`;
          notify = true;
        } else {
          message +=
            bondGain < 0.1
              ? "Worse yet they assaulted you, but luckily you suffered no injuries!"
              : "They took a swing at you, but you suffered no injuries!";
        }
      } else {
        message +=
          "For a moment it seemed like they considered assaulting you, but they restrained themselves.";
      }
    }

    pet.tamed.owner.logging(message, LOGGING.NORMAL, notify);

    return true;
  },

  availableTrainings(pet) {
    if (!PetTrainingSystem.canGetTrained(pet)) {
      return [];
    }
    const currentBondTrained = pet.tamed.trainingsLevel;
    const petTypeId = pet.constructor.name;
    const potentialTrainings = Object.keys(TRAINABLES).filter(trainableId => {
      const trainable = TRAINABLES[trainableId];
      return (
        trainableValid(trainable, petTypeId) &&
        (pet.tamed.trainings[trainableId] || 0) < (trainable.levels || 1) &&
        currentBondTrained >= (trainable.requiredBond || 0)
      );
    });
    const trainings = utils
      .randomizeArray(
        potentialTrainings,
        pet.getEntityId() * (currentBondTrained + 1)
      )
      .slice(
        0,
        PetTrainingSystem.getTrainingLevel(pet, "moreTrainingOptions") ? 4 : 3
      );
    return trainings;
  },

  gainTrainable(pet, trainableId) {
    const available = PetTrainingSystem.availableTrainings(pet);
    if (!available.includes(trainableId)) {
      utils.error(
        `INVALID TRAINING - POSSIBLE HACKING: ${pet.id} ${available.join(
          ", "
        )} ${trainableId}`
      );
    }
    pet.tamed.trainings[trainableId] = pet.tamed.trainings[trainableId] || 0;
    pet.tamed.trainings[trainableId] += 1;
    pet.tamed.trainingsLevel += 1;
    if (TRAINABLES[trainableId].onLearn) {
      TRAINABLES[trainableId].onLearn(pet);
    }
  },

  getTrainingLevel(pet, trainableId) {
    if (!TRAINABLES[trainableId]) {
      console.error("Invalid trainable: ", trainableId);
    }
    return (
      (pet.tamed && pet.tamed.trainings && pet.tamed.trainings[trainableId]) ||
      0
    );
  },

  actions
};

server.preFlightCheck(() => {
  const tamablePredators = utils.getClasses(Predator).filter(p => p.taming);
  const doings = ["tryNuzzle", "leaveDroppings", "wanderOff", "doHunting"];
  const hunts = Object.keys(PET_HUNTS);
  const relevantTrainables = [
    "moreWebs",
    "websInTheHouse",
    "nuzzleOften",
    "stopWandering",
    "stopPooping",
    ...hunts
  ];

  tamablePredators
    .map(predatorProto => {
      const functionBody =
        (predatorProto.taming.tamedCycle &&
          predatorProto.taming.tamedCycle.toString()) ||
        "";
      const petTypeId = predatorProto.constructor.name;
      return {
        className: petTypeId,
        proto: predatorProto,
        actions: doings.filter(d => functionBody.includes(d)),
        trainables: relevantTrainables.filter(trainableId =>
          trainableValid(TRAINABLES[trainableId], petTypeId)
        )
      };
    })
    .forEach(definition => {
      const isSpider = !!(definition.proto instanceof Spider);
      if (isSpider !== definition.trainables.includes("moreWebs")) {
        throw new Error(
          `${definition.className} - spider vs "moreWebs" conflict`
        );
      }
      if (isSpider !== definition.trainables.includes("websInTheHouse")) {
        throw new Error(
          `${definition.className} - spider vs "websInTheHouse" conflict`
        );
      }
      if (
        definition.actions.includes("doHunting") !==
        definition.trainables.some(t => hunts.includes(t))
      ) {
        throw new Error(
          `${definition.className} - doHunting and trainables conflict`
        );
      }
      if (
        definition.actions.includes("leaveDroppings") !==
        definition.trainables.includes("stopPooping")
      ) {
        throw new Error(
          `${definition.className} - leaveDroppings vs stopPooping conflict`
        );
      }
      if (
        definition.actions.includes("tryNuzzle") !==
        definition.trainables.includes("nuzzleOften")
      ) {
        throw new Error(
          `${definition.className} - tryNuzzle vs nuzzleOften conflict`
        );
      }
      if (
        definition.actions.includes("wanderOff") !==
        definition.trainables.includes("stopWandering")
      ) {
        throw new Error(
          `${definition.className} - wanderOff vs stopWandering conflict`
        );
      }
    });
});

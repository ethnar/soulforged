require("../.popping-resource");

const actions = Action.groupById([
  new Action({
    name: "Trap",
    icon: "/actions/icons8-receive-cash-100.png",
    difficulty: (resource, creature) =>
      resource.getDifficultyLabel(
        creature,
        resource.trappable.difficultyModifier
      ),
    valid(entity, creature) {
      if (!entity.trappable) {
        return false;
      }
      const foodRequired = entity.trappable.itemClass.prototype.foodRequired;
      if (!Object.keys(foodRequired).every(name => creature.knowsItem(name))) {
        return false;
      }
      const containerItemType = entity.trappable.itemClass.getContainerItemType();
      if (containerItemType && !creature.knowsItem(containerItemType.name)) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (
        entity.getNode() !== creature.getNode() &&
        !entity.getNode().isConnectedTo(creature.getNode())
      ) {
        return "You need to be within immediate distance to the location to gather this resource";
      }
      const containerItemType = entity.trappable.itemClass.getContainerItemType();
      if (containerItemType && !creature.hasItemType(containerItemType.name)) {
        return `You need a ${containerItemType.getName()} for this`;
      }

      const foodRequired = entity.trappable.itemClass.prototype.foodRequired;
      if (!creature.hasMaterials(foodRequired)) {
        const foodDescription = Object.keys(foodRequired)
          .map(
            className =>
              `${global[className].getName()} (${foodRequired[className]})`
          )
          .join(", ");
        return `You need ${foodDescription} for this`;
      }
      return true;
    },
    run(entity, creature, seconds) {
      const efficiency = creature.getEfficiency(entity.skill);

      creature.actionProgress +=
        (seconds * efficiency * 100) / (entity.baseTime * 3);

      if (creature.actionProgress >= 100) {
        creature.actionProgress -= 100;

        let skillExperience = entity.baseTime;

        const foodRequired = entity.trappable.itemClass.prototype.foodRequired;
        const foodUsed = Object.keys(foodRequired).toObject(
          key => key,
          key => utils.random(1, foodRequired[key])
        );
        creature.spendMaterials(foodUsed);

        creature.triggerQuestEvent("trapFinished", entity);

        if (utils.random(1, 100) <= entity.getGatherChance(creature)) {
          creature.addItemByType(entity.trappable.itemClass);
          entity.useUpResource(1);

          const containerItemType = entity.trappable.itemClass.getContainerItemType();
          if (containerItemType) {
            creature.spendMaterials({
              [containerItemType.name]: 1
            });
          }

          creature.gainSkill(
            entity.skill,
            skillExperience,
            entity.getSkillGainDifficultyMultiplier(creature)
          );
          creature.gainStatsFromSkill(
            entity.skill,
            creature.getTimeSpentOnAction()
          );

          creature.triggerQuestEvent("trapSuccess", entity);
        } else {
          creature.logging(
            `The ${entity.getName()} escaped your trap.`,
            LOGGING.WARN,
            false
          );
          creature.gainSkill(
            entity.skill,
            skillExperience / 2,
            entity.getSkillGainDifficultyMultiplier(creature)
          );
          creature.gainStatsFromSkill(
            entity.skill,
            creature.getTimeSpentOnAction()
          );

          creature.triggerQuestEvent("trapFailure", entity);

          return true;
        }

        return false;
      }
      return true;
    }
  }),
  ...Object.values(Resource.actions())
]);

class Prey extends PoppingResource {
  static actions() {
    return actions;
  }

  dynamicName() {
    return Nameable.getName(this.constructor.name);
  }
}
Object.assign(Prey.prototype, {
  nameable: true,
  gatherActionLabel: "Hunt",
  failMessageGenerator(entity, creature) {
    if (utils.chance(30)) {
      return `You've made too much noise and the ${entity
        .getProduce(creature, true)
        .getName()} ran off.`;
    }
    return `The ${entity
      .getProduce(creature, true)
      .getName()} caught your scent and escaped.`;
  }
});

const trappedActions = Action.groupById([
  new Action({
    name: "Feed",
    icon: "/actions/icons8-restaurant-100.png",
    quickAction: true,
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    runCheck(item, creature) {
      const foodRequired = Object.keys(item.foodRequired).pop();
      const countRequired = Object.values(item.foodRequired).pop();
      if (100 - item.integrity < 100 / (countRequired * item.qty)) {
        return "The animal is too full to eat right now";
      }
      if (!creature.hasItemType(foodRequired)) {
        return `You need ${global[
          foodRequired
        ].getName()} to feed ${item.getName()}`;
      }
      return true;
    },
    run(item, creature, seconds) {
      creature.actionProgress += (seconds * 100) / item.timeToFeed;

      if (creature.actionProgress >= 100) {
        const foodRequired = Object.keys(item.foodRequired).pop();
        const countRequired = Object.values(item.foodRequired).pop();
        item.modifyIntegrity(100 / (countRequired * item.qty));

        creature.spendMaterials({
          [foodRequired]: 1
        });
        creature.actionProgress -= 100;
        return false;
      }
      return true;
    }
  }),
  new Action({
    name: "Kill",
    icon: "/actions/icons8-sword-100.png",
    quickAction: true,
    valid(item, creature) {
      if (!creature.hasItem(item)) {
        return false;
      }
      return true;
    },
    runCheck(item, creature) {
      const tool = creature.getTool();
      if (!tool || !tool.getUtilityLevel(TOOL_UTILS.CUTTING)) {
        return `You need a cutting tool`;
      }
      return true;
    },
    run(item, creature, seconds) {
      creature.actionProgress += (seconds * 100) / 5;

      const tool = creature.getTool();
      tool.reduceIntegrity(0.0002);

      if (creature.actionProgress >= 100) {
        const split = item.split(1);
        split.expire();

        creature.actionProgress -= 100;
        return false;
      }
      return true;
    }
  }),
  ...Object.values(ExpirableItem.actions())
]);

class TrappedPrey extends ExpirableItem {
  static actions() {
    return trappedActions;
  }

  static getFoodType() {
    return global[Object.keys(this.prototype.foodRequired).pop()];
  }

  static getFoodAmount() {
    return Object.values(this.prototype.foodRequired).pop();
  }

  static getPayload(creature) {
    const result = super.getPayload(creature);
    result.integrityType = "living";
    return result;
  }

  getPayload(creature) {
    const result = super.getPayload(creature);
    result.integrityType = "living";
    return result;
  }
}
Object.assign(TrappedPrey.prototype, {
  expiresIn: 2 * DAYS,
  timeToFeed: 2 * SECONDS,
  expiresInto: {}
});

module.exports = global.TrappedPrey = TrappedPrey;
module.exports = global.Prey = Prey;

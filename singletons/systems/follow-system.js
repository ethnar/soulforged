require("../../class/buffs/buff");

const action = new Action({
  name: "Follow",
  icon: "/actions/icons8-treasure-map-100.png",
  repeatable: false,
  notification: false,
  quickAction: true,
  secondaryAction: true,
  dynamicLabel: (target, creature) => {
    if (!creature.followSystem || creature.followSystem.who !== target) {
      return "Follow";
    } else {
      return "Stop following";
    }
  },
  valid(target, creature) {
    if (target === creature) {
      return false;
    }
    if (target.isDead()) {
      return false;
    }
    if (creature.isHostile(target)) {
      return false;
    }
    if (creature.canSeeCreatureDetails(target) < 2) {
      return false;
    }
    if (!creature.seesNode(target.getNode())) {
      return false;
    }
    return true;
  },
  run(target, creature, seconds, context) {
    if (
      (!creature.followSystem || creature.followSystem.who !== target) &&
      Object.values(context).some(enabled => !!enabled)
    ) {
      FollowSystem.makeFollow(creature, target, context);
    } else {
      FollowSystem.stopFollowing(creature);
    }
    return false;
  },
  ...utils.jsAction("/js/actions/follow")
});

const buffBase = {
  name: "Following",
  dynamicName: (buff, creature, observer) =>
    creature.followSystem &&
    `Following ${observer.getCreatureName(creature.followSystem.who)}`,
  category: Buff.CATEGORIES.OTHER,
  visible: true,
  severity: -1
};

class BuffFollowSystem extends Buff {}
Object.assign(BuffFollowSystem.prototype, {
  ...buffBase,
  icon: `/${ICONS_PATH}/creatures/compass_t.png`
});
global.BuffFollowSystem = BuffFollowSystem;

class BuffFollowSystemBattle extends Buff {}
Object.assign(BuffFollowSystemBattle.prototype, {
  ...buffBase,
  description: ["Battle"],
  icon: `/${ICONS_PATH}/creatures/shield2.png`
});
global.BuffFollowSystemBattle = BuffFollowSystemBattle;

class BuffFollowSystemTravel extends Buff {}
Object.assign(BuffFollowSystemTravel.prototype, {
  ...buffBase,
  description: ["Travel"],
  icon: `/${ICONS_PATH}/creatures/boots2.png`
});
global.BuffFollowSystemTravel = BuffFollowSystemTravel;

class BuffFollowSystemBoth extends Buff {}
Object.assign(BuffFollowSystemBoth.prototype, {
  ...buffBase,
  description: [
    ...BuffFollowSystemBattle.prototype.description,
    ...BuffFollowSystemTravel.prototype.description
  ],
  icon: `/${ICONS_PATH}/creatures/boots_shield2.png`
});
global.BuffFollowSystemBoth = BuffFollowSystemBoth;

const FollowSystem = {
  getFollowAction() {
    return action;
  },

  cycle(creature, seconds) {
    if (!creature.followSystem) {
      return;
    }

    const { followSystem } = creature;

    if (followSystem.who.isDead() || followSystem.who.isHostile(creature)) {
      FollowSystem.stopFollowing(creature);
      return;
    }

    if (followSystem.modes.travel && creature.isDoingAction("Travel")) {
      const sameLocation = creature.getNode() === followSystem.who.getNode();
      if (!sameLocation || followSystem.who.isDoingAction("Travel")) {
        const theirContext =
          (followSystem.who.currentAction &&
            followSystem.who.currentAction.context) ||
          {};
        creature.currentAction.context = creature.currentAction.context || {};
        creature.currentAction.context.skipUnknowns =
          !sameLocation || theirContext.skipUnknowns;
        creature.currentAction.context.disregard =
          !sameLocation || theirContext.disregard;
        creature.currentAction.context.assault =
          !sameLocation || theirContext.assault;
      }
    }

    if (followSystem.lastSeenLocation !== followSystem.who.getNode()) {
      if (!creature.seesNode(followSystem.who.getNode())) {
        creature.logging(`You lost view of the character you were following`);
        FollowSystem.stopFollowing(creature);
      } else {
        followSystem.lastSeenLocation = followSystem.who.getNode();

        if (
          followSystem.modes.travel &&
          followSystem.who.getNode() !== creature.getNode()
        ) {
          const goTo = followSystem.who.getNode();
          creature.stopAction(false);
          if (FollowSystem.tryFollowTravel(creature, goTo)) {
            const theirContext =
              (followSystem.who.currentAction &&
                followSystem.who.currentAction.context) ||
              {};
            creature.currentAction.context =
              creature.currentAction.context || {};
            creature.currentAction.context.skipUnknowns =
              theirContext.skipUnknowns;
            creature.currentAction.context.disregard = theirContext.disregard;
            creature.currentAction.context.assault = theirContext.assault;
          }
        }
      }
    }

    if (followSystem.who.getNode() === creature.getNode()) {
      if (
        followSystem.modes.travel &&
        followSystem.who.isDoingAction("Travel") &&
        !creature.hasPostponedAction("Travel") &&
        (!creature.isProtected() ||
          !followSystem.who.isAmbushing() ||
          (followSystem.who.isDoingAction("Travel") &&
            followSystem.who.actionProgress >= 1 &&
            followSystem.who.actionProgress <= 99)) &&
        (!creature.isDoingAction("Travel") ||
          followSystem.who.getActionTarget() !== creature.getActionTarget())
      ) {
        if (!creature.isDoingAction("Sleep")) {
          creature.stopAction(false);
          creature.logging(
            `Your action was interrupted as you follow ${creature.getCreatureName(
              followSystem.who
            )}.`
          );
        }

        const goTo = followSystem.who.getActionTarget();
        if (FollowSystem.tryFollowTravel(creature, goTo)) {
          creature.currentAction.context = creature.currentAction.context || {};
          creature.currentAction.context.skipUnknowns = true;
          creature.currentAction.context.disregard = true;
          creature.currentAction.context.assault = true;
        }
        return;
      }

      if (
        followSystem.modes.travel &&
        creature.isDoingAction("Travel") &&
        !followSystem.who.isDoingAction("Travel") &&
        !followSystem.who.hasPostponedAction("Travel")
      ) {
        creature.stopAction(false);
        return;
      }

      if (
        followSystem.modes.battle &&
        followSystem.who.isDoingAction("Fight") &&
        !creature.isDoingAction("Fight") &&
        !creature.hasPostponedAction("Fight") &&
        creature.hasEnemies()
      ) {
        creature.logging(
          `You are joining ${creature.getCreatureName(
            followSystem.who
          )} in their fight.`
        );
        creature.startAction(creature, creature.getActionById("Fight"));
      }
    }
  },

  tryFollowTravel(creature, goTo) {
    if (creature.energy && creature.energy < 1) {
      const { followSystem } = creature;
      FollowSystem.stopFollowing(creature, false);
      creature.logging(
        `You are no longer following ${creature.getCreatureName(
          followSystem.who
        )} do to exhaustion.`,
        LOGGING.WARN
      );
      return false;
    }
    creature.startAction(goTo, goTo.getActionById("Travel"));
  },

  shouldBlockTravelAction(creature) {
    if (!creature.followSystem) {
      return false;
    }

    const { followSystem } = creature;
    if (
      creature.actionProgress >= 100 &&
      creature.getNode() === followSystem.who.getNode()
    ) {
      creature.currentAction.blocked = `Waiting for the character you're following`;
      return true;
    }
  },

  stopFollowing(follower, logIt = true) {
    if (!follower.followSystem) {
      return;
    }
    follower.removeBuff("BuffFollowSystem");
    follower.removeBuff("BuffFollowSystemBattle");
    follower.removeBuff("BuffFollowSystemTravel");
    follower.removeBuff("BuffFollowSystemBoth");
    if (logIt) {
      const { followSystem } = follower;
      follower.logging(
        `You are no longer following ${follower.getCreatureName(
          followSystem.who
        )}.`,
        LOGGING.WARN
      );
    }
    delete follower.followSystem;
  },

  makeFollow(follower, following, modes) {
    if (!modes) {
      modes = {
        battle: true,
        travel: true
      };
    }
    follower.removeBuff("BuffFollowSystem");
    follower.removeBuff("BuffFollowSystemBattle");
    follower.removeBuff("BuffFollowSystemTravel");
    follower.removeBuff("BuffFollowSystemBoth");
    switch (true) {
      case modes.battle && modes.travel:
        follower.addBuff(BuffFollowSystemBoth);
        break;
      case modes.battle:
        follower.addBuff(BuffFollowSystemBattle);
        break;
      case modes.travel:
        follower.addBuff(BuffFollowSystemTravel);
        break;
      default:
        follower.addBuff(BuffFollowSystem);
    }

    follower.followSystem = {
      who: following,
      lastSeenLocation: null,
      modes
    };
  },

  followingWho(creature) {
    return creature.followSystem && creature.followSystem.who;
  },

  isFollowing(follower, who) {
    return FollowSystem.followingWho(follower) === who;
  }
};

module.exports = global.FollowSystem = FollowSystem;

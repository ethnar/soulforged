const Event = require("../../events/.event");
const InformationProvider = require("../../../singletons/information-provider");

const GLOW_MENHIR_ICON = `/${ICONS_PATH}/quests/world-quests/sgi_115_glow.png`;

/******* STRUCTURES *******/
const actions = Action.groupById([
  new Action({
    name: "Touch",
    icon: "/actions/icons8-so-so-100.png",
    notification: false,
    repeatable: false,
    valid(entity, creature) {
      const player = creature.getPlayer();
      if (!player) {
        return false;
      }
      if (!player.isOnAQuest(QUESTS.WORLD_QUESTS_TREASURE_HUNT)) {
        return false;
      }
      return true;
    },
    runCheck(entity, creature) {
      if (entity.getNode() !== creature.getNode()) {
        return "You must be in the same location to do that";
      }
      return true;
    },
    run(entity, creature) {
      const player = creature.getPlayer();
      const questObject = player.getQuestObject(
        QUESTS.WORLD_QUESTS_TREASURE_HUNT
      );
      questObject.currentMark = questObject.currentMark || 0;
      if (entity.order === questObject.currentMark + 1) {
        questObject.currentMark += 1;
        creature.sendError(
          `The stone is warm to the touch, you feel a sense of progress.`
        );
      } else {
        questObject.currentMark = 0;
        creature.sendError(
          `The stone is cold to the touch, you feel a sense of loss.`
        );
      }
      return false;
    }
  })
]);

class WorldQuestObelisk extends Structure {
  static actions() {
    return { ...actions, ...Structure.actions() };
  }
}
Object.assign(WorldQuestObelisk.prototype, {
  name: "Obelisk",
  icon: `/${ICONS_PATH}/structures/runestone_b_04.png`,
  mapGraphic: {
    7: "tiles/custom/obelisk.png"
  }
});
global.WorldQuestObelisk = WorldQuestObelisk;

/******* EVENT ONE *******/
class TreasureHuntEventOne extends WorldEvent {
  destroy() {
    world.startNewEvent(TreasureHuntEventTwo);
    super.destroy();
  }
}
Object.assign(TreasureHuntEventOne.prototype, {
  name: "A light in the sky",
  icon: `/${ICONS_PATH}/quests/world-quests/spellbook01_88.png`,
  eventDuration: 24 * HOURS,
  plotText:
    "A bright light appeared far in the sky to the west. What could this mean?",
  visibilityCondition(creature) {
    return (
      WorldEvent.prototype.visibilityCondition(creature) &&
      creature.isOverground()
    );
  }
});
global.TreasureHuntEventOne = TreasureHuntEventOne;

/******* EVENT TWO *******/
class TreasureHuntEventTwo extends WorldEvent {
  destroy() {
    world.startNewEvent(TreasureHuntEventThree);
    super.destroy();
  }
}
Object.assign(TreasureHuntEventTwo.prototype, {
  name: "Falling stars",
  icon: `/${ICONS_PATH}/quests/world-quests/spellbookpreface_03.png`,
  eventDuration: 24 * HOURS,
  plotText:
    "As the light grew bigger you can now discern what appears to be four meteors, with one of them heading towards the menhir.",
  visibilityCondition(creature) {
    return (
      WorldEvent.prototype.visibilityCondition(creature) &&
      creature.isOverground()
    );
  }
});
global.TreasureHuntEventTwo = TreasureHuntEventTwo;

const firstObeliskNodeId = 405;
/******* EVENT THREE *******/
class TreasureHuntEventThree extends WorldEvent {
  constructor(args) {
    super(args);
    Entity.getById(firstObeliskNodeId).addStructure(
      new WorldQuestObelisk({
        order: 1,
        plotLanguage: LANGUAGES.HUMAN,
        plotText: `
§Falling from the sky<br/>
Ingrained with mystery<br/>
Reach my subsequent<br/>
Scouring the southern hills<br/>
Touch will open the way§`
      })
    );
    Entity.getById(493).addStructure(
      new WorldQuestObelisk({
        order: 2,
        plotLanguage: LANGUAGES.HUMAN,
        plotText: `
§Stone that follows<br/>
Embracing the frogs<br/>
Connect the dots<br/>
Order which matters<br/>
Now go find us all to<br/>
Draw from our power§`
      })
    );
    Entity.getById(3100).addStructure(
      new WorldQuestObelisk({
        order: 3,
        plotLanguage: LANGUAGES.HUMAN,
        plotText: `
§Threading the uneven routing<br/>
Hiding in the mountains<br/>
Inspect all five carefully<br/>
Reward shall be powerful<br/>
Delivered upon triumphant§`
      })
    );
    Entity.getById(1190).addStructure(
      new WorldQuestObelisk({
        order: 4,
        plotLanguage: LANGUAGES.HUMAN,
        plotText: `
§Follow the trail<br/>
Of us that are veiled<br/>
Upon the grassy vantage<br/>
Rests the next stage<br/>
Try not to subvert<br/>
Helping others won't hurt§`
      })
    );
    Entity.getById(774).addStructure(
      new WorldQuestObelisk({
        order: 5,
        plotLanguage: LANGUAGES.HUMAN,
        plotText: `
§Forming all around<br/>
I feel others aground<br/>
Find our meaning<br/>
The time is fleeting<br/>
Hasten the seeking§`
      })
    );
  }
  destroy() {
    world.startNewEvent(TreasureHuntEventFour);
    super.destroy();
  }
}
Object.assign(TreasureHuntEventThree.prototype, {
  name: "A fallen star",
  icon: GLOW_MENHIR_ICON,
  eventDuration: 60 * DAYS,
  plotText:
    "One of the meteors must have landed where the menhir is, emitting a purple aura.",
  visibilityCondition(creature) {
    return (
      WorldEvent.prototype.visibilityCondition(creature) &&
      creature.isOverground()
    );
  }
});
global.TreasureHuntEventThree = TreasureHuntEventThree;

/******* EVENT FOUR *******/
class TreasureHuntEventFour extends WorldEvent {
  destroy() {
    Entity.getEntities(WorldQuestObelisk).forEach(ob => ob.destroy());
    Player.list.forEach(p => p.cancelQuest(QUESTS.WORLD_QUESTS_TREASURE_HUNT));
    super.destroy();
  }
}
Object.assign(TreasureHuntEventFour.prototype, {
  name: "Dimming light",
  icon: Menhir.prototype.icon,
  eventDuration: 7 * DAYS,
  plotText: `The glow around the menhir that was once so prominent seems to be fading away. Whatever's happening won't last for long.`,
  visibilityCondition(creature) {
    return (
      WorldEvent.prototype.visibilityCondition(creature) &&
      creature.isOverground()
    );
  }
});
global.TreasureHuntEventFour = TreasureHuntEventFour;

/*********** QUEST ***********/
new Quest((QUESTS.WORLD_QUESTS_TREASURE_HUNT = "wq_treasure"), {
  title: "Mystery of the obelisks",
  description:
    "Mysterious obelisk appeared in the world with a puzzling inscription written on each.",
  icon: GLOW_MENHIR_ICON,
  autoAcquireConditions: [
    creature =>
      creature.isPlayableCharacter() &&
      creature.getNode().getEntityId() === firstObeliskNodeId &&
      (world.isEventInProgress("TreasureHuntEventThree") ||
        world.isEventInProgress("TreasureHuntEventFour"))
  ],
  objectives: [
    {
      label: `Solve the puzzle`,
      progress: (creature, seconds, quest) => {
        return quest.currentMark || 0;
      },
      target: 5,
      dynamic: true
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `A mysterious obelisk has appeared near the Menhir. The inscription on the obelisk invited me to touch it. Could it be there is more than one obelisk to be found?`,
      options: []
    },
    initComplete: {
      label: (quest, creature) => ``,
      text: (quest, creature) =>
        `As you touched the last stone a comforting feeling filled your body. A tiny item appears in your hand.`,
      options: [],
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      }
    }
  },
  onFinish: player => {
    player.getCreature().addItem(new WorldQuestTreasureHuntReward());
    player.gainSoulXp(300);
    world.finishEvent(TreasureHuntEventThree);
  }
});

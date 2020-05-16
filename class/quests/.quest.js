const server = require("../../singletons/server");

const questById = {};

class Quest {
  getQuestId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  constructor(id, args) {
    Object.assign(this, args);
    this.id = id;

    if (questById[this.id]) {
      throw new Error("Conflicting quest id", this.id);
    }

    if (args.autoAcquireConditions) {
      new Inspiration({
        name: `Quest_${this.id}`,
        requirements: [
          creature => !creature.getPlayer().isQuestFinished(id),
          ...args.autoAcquireConditions
        ],
        onInspire: player => {
          player.startQuest(this.id);
        }
      });
    }

    questById[this.id] = this;
  }

  getPayload(creature, playerQuest) {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: playerQuest.completed,
      reviewed: playerQuest.reviewed,
      hasDialogue: !!this.dialogue,
      objectives: Object.keys(this.objectives).map(idx => {
        const obj = this.objectives[idx];

        return {
          label:
            typeof obj.label === "function"
              ? obj.label(creature, playerQuest)
              : obj.label,
          target: obj.target,
          progress: playerQuest.objectives[idx]
        };
      })
    };
  }

  getIcon(icon, creature) {
    return server.getImage(creature, icon || this.icon);
  }

  getDialogueStep(option, creature) {
    // TODO: almost copy-pasted from NPC, unify
    const complete = creature.isQuestComplete(this.getQuestId());
    creature.markQuestReviewed(this.getQuestId());
    const dialogueOption = this.dialogue[
      option ||
        (complete && this.dialogue.initComplete ? "initComplete" : "init")
    ];
    if (
      dialogueOption &&
      (!dialogueOption.valid || dialogueOption.valid(this, creature)) &&
      (!dialogueOption.available ||
        dialogueOption.available(this, creature) === true)
    ) {
      if (dialogueOption.onTrigger) {
        dialogueOption.onTrigger(this, creature);
      }
      return {
        label: dialogueOption.label && dialogueOption.label(this, creature),
        text: dialogueOption.text(this, creature),
        icon: this.getIcon(dialogueOption.icon, creature),
        options: (dialogueOption.options || [])
          .map(option => ({
            ...this.dialogue[option || "init"],
            option: option
          }))
          .filter(
            followingDialogue =>
              !followingDialogue.valid ||
              followingDialogue.valid(this, creature)
          )
          .filter(followingDialogue => followingDialogue.label)
          .map(followingDialogue => ({
            label: followingDialogue.label(this, creature),
            option: followingDialogue.option,
            available:
              !followingDialogue.available ||
              followingDialogue.available(this, creature)
          }))
      };
    }
    return false;
  }

  complete(creature) {
    creature.getPlayer().finishQuest(this.getQuestId());
  }

  static getById(questId) {
    return questById[questId];
  }

  static updateCustomProgress(string, quest, mod) {
    quest.progress = quest.progress || {};
    if (typeof mod === "number") {
      quest.progress[string] = quest.progress[string] || 0;
      quest.progress[string] += mod;
    } else {
      quest.progress[string] = mod;
    }
  }

  static setCustomProgress(string, quest, mod) {
    quest.progress = quest.progress || {};
    quest.progress[string] = mod;
  }

  static getCustomProgress(string, quest) {
    quest.progress = quest.progress || {};
    quest.progress[string] = quest.progress[string] || 0;
    return quest.progress[string];
  }

  static customProgressCallback(string) {
    return (humanoid, seconds, quest) => Quest.getCustomProgress(string, quest);
  }

  static resetCustomProgress(humanoid, { questData }) {
    questData.progress = {};
  }

  static failQuest(humanoid, { questDetails }) {
    if (humanoid.getPlayer()) {
      humanoid.getPlayer().cancelQuest(questDetails.id);
      if (humanoid.getPlayer().inspirations) {
        delete humanoid.getPlayer().inspirations[`Quest_${questDetails.id}`];
      }
    }
  }
}
Quest.LIFETIME_QUEST_ICON = `/${ICONS_PATH}/quests/sgi_97.png`;
module.exports = global.Quest = Quest;
global.QUESTS = {};

Quest.objectiveDoNotDie = {
  label: "Do not die",
  progress: () => 1,
  target: 1
};

server.registerHandler("questDialogue", (params, player) => {
  const quest = Quest.getById(params.questId);
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }

  if ((params.option && typeof params.option !== "string") || !quest) {
    return false;
  }

  return quest.getDialogueStep(params.option, creature);
});

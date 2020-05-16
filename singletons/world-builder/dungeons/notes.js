const onRead = creature => {
  if (creature.isPlayableCharacter()) {
    const player = creature.getPlayer();
    for (let i = 1; i <= 5; i++) {
      const questId = getQuestId(i);
      if (player.isOnAQuest(questId)) {
        return;
      }
      if (!player.isQuestFinished(questId)) {
        player.startQuest(questId);
        return;
      }
    }
  }
};

class DungeonNoteStructure extends Structure {
  getName() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].name;
  }

  getIconPath() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].icon;
  }

  getIcon(creature) {
    return server.getImage(creature, this.getIconPath());
  }

  getPlotLanguage() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].language;
  }

  getPlotText() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].text;
  }

  constructor(args = {}) {
    super(args);
    this.noteId = args.noteId;
  }

  onRead(creature) {
    onRead(creature);
  }
}

Entity.factory(DungeonNoteStructure, {
  name: "?DungeonNoteStructure?",
  cannotBeOccupied: true
});

require("./notes-copy");
require("../../../class/items/.expirable-item");
require("../../../class/quests/.quest");

const getQuestId = level => `learning_ancient_${level}`;

class DungeonNoteItem extends ExpirableItem {
  static actions() {
    return { ...inscriptionActions, ...Item.actions() };
  }

  getName() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].name;
  }

  getIconPath() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].icon;
  }

  getIcon(creature) {
    return server.getImage(creature, this.getIconPath());
  }

  getPlotLanguage() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].language;
  }

  getPlotText() {
    if (!this.noteId) return;
    return DUNGEON_NOTES[this.noteId].text;
  }

  constructor(args) {
    super(args);
    this.noteId = args.noteId;
    this.expiring = Infinity;
  }

  getPayload(creature, ...args) {
    if (this.expiring === Infinity) {
      console.log(
        `Note ID ${this.id} starting to expire, seen by ${creature.getName()}`
      );
      this.expiring = 0;
    }
    return super.getPayload(creature, ...args);
  }

  static getTradeId() {
    return null;
  }

  getTradeId() {
    return [
      ...super.getTradeId(),
      this.noteId,
      this.getName(),
      this.getIconPath()
    ];
  }

  onRead(creature) {
    onRead(creature);
  }

  static inferPayload(creature, tradeId) {
    const result = Item.inferPayload(creature, tradeId);
    result.name = tradeId[4];
    result.icon = server.getImage(creature, tradeId[5]);
    return result;
  }
}
Entity.factory(DungeonNoteItem, {
  name: "?DungeonNoteItem?",
  order: ITEMS_ORDER.NOTES,
  expiresIn: 1 * DAYS,
  weight: 0.1,
  nonResearchable: true
});

const buildQuest = (level, notesNeeded) => {
  new Quest((QUESTS[`LEARNING_AERIAN_${level}`] = getQuestId(level)), {
    title: `Ancient Language ${level}`,
    description: `Study scripts and learn more about the ancient language.`,
    icon: Quest.LIFETIME_QUEST_ICON,
    questEventsHandler: {
      die: Quest.failQuest,
      readInscription: (humanoid, { questData }, entity) => {
        if (
          entity.noteId &&
          DUNGEON_NOTES[entity.noteId] &&
          DUNGEON_NOTES[entity.noteId].language === LANGUAGES.AERIAN
        ) {
          noteId = entity.noteId;
          const notesRegister =
            Quest.getCustomProgress("notesRegister", questData) || {};
          notesRegister[noteId] = true;

          Quest.setCustomProgress("notesRegister", questData, notesRegister);
          Quest.setCustomProgress(
            "differentNotes",
            questData,
            Object.keys(notesRegister).length
          );
        }
      }
    },
    objectives: [
      {
        label: `Read ${notesNeeded} inscriptions written in the ancient language`,
        progress: Quest.customProgressCallback("differentNotes"),
        target: notesNeeded
      },
      Quest.objectiveDoNotDie
    ],
    dialogue: {
      init: {
        text: () =>
          `I found an inscription written in what seems to be some ancient language. If I discover more of them, I should be able to learn more about this language.`,
        options: []
      },
      initComplete: {
        text: () => `I feel I get more understanding of this ancient language.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    },
    onFinish: (player, questData) => {
      player.gainSoulXp(500 + 300 * level);
      player.learnLanguage(LANGUAGES.AERIAN, level * 20);
      if (level < 5) {
        const newQuest = player.startQuest(getQuestId(level + 1));
        const notesRegister =
          Quest.getCustomProgress("notesRegister", questData) || {};
        const count = Object.keys(notesRegister).length;
        Quest.setCustomProgress("notesRegister", newQuest, notesRegister);
        Quest.setCustomProgress("differentNotes", newQuest, count);
      }
    }
  });
};

buildQuest(1, 2);
buildQuest(2, 5);
buildQuest(3, 9);
buildQuest(4, 15);
buildQuest(5, 22);

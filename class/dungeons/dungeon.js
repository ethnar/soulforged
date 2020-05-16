class Dungeon extends Entity {
  constructor(args) {
    super(args);
    this.roomNodes = [];
    this.entryNodes = [];
    world.registerCyclable(this);
  }

  destroy() {
    super.destroy();
    [...this.roomNodes].forEach(node => node.destroy());
    world.deregisterCyclable(this);
  }

  characterDied() {}

  addNode(node) {
    if (node instanceof Room) {
      node.dungeon = this;
      this.roomNodes.push(node);
    } else {
      this.entryNodes.push(node);
    }
  }

  cycle(seconds) {
    if (TimeCheck.atHour(8, seconds)) {
      this.checkReset();
    }
    if (this.isTrialDungeon()) {
      DungeonTrials.cycle(seconds);
    }
  }

  isTrialDungeon() {
    return (
      world.trialDungeon && this.id === world.trialDungeon.entrance.dungeon.id
    );
  }

  customReset() {
    if (utils.chance(25)) {
      switch (this.id) {
        case 14244:
          Entity.getById(34252).addItemByType(AStatue14332);
          break;
        case 34791:
          Entity.getById(36189).addItemByType(AStatue14327);
          break;
        case 37501:
          Entity.getById(38444).addItemByType(AStatue14200);
          break;
        case 38749:
          Entity.getById(39164).addItemByType(AStatue14338);
          break;
      }
    }
    if (this.isTrialDungeon()) {
      // this is trial dungeon
      if (!DungeonTrials.isTrialInProgress()) {
        const trialType = utils.randomItem(["combat", "wisdom"]);
        world.trialDungeon.entrance.addStructure(
          new DungeonNoteStructure({
            noteId: `D5_TRIAL_${trialType}`,
            roomPlacement: "W"
          })
        );
        world.trialDungeon.entrance.trialType = trialType;
        world.trialDungeon.seed = utils.random(1, 10000000000);
      }
    }
  }

  checkReset() {
    if (this.noPlayersInDungeon()) {
      this.resetDungeon();
    }
  }

  entranceNotSeen() {
    return this.entryNodes.every(node => !node.seenRecentlyByPlayer());
  }

  noPlayersInDungeon() {
    return !this.roomNodes.some(node =>
      node.getCreatures().some(c => c.isPlayableCharacter())
    );
  }

  resetDungeon() {
    this.roomNodes.forEach(n => n.reset());
    this.resetNotes();
    this.customReset();
  }

  resetNotes() {
    const roomRegistry = {};
    this.roomNodes.forEach(room => {
      roomRegistry[room.constructor.name] =
        roomRegistry[room.constructor.name] || [];
      roomRegistry[room.constructor.name].push(room);
      room
        .getAllStructures()
        .filter(s => s instanceof DungeonNoteStructure)
        .forEach(s => s.destroy());
    });

    if (this.notes) {
      this.notes.forEach(definition => {
        const { noteType, roomType, roomIds } = definition;

        if (utils.chance(definition.chance)) {
          if (
            !roomIds &&
            (!roomRegistry[roomType] || !roomRegistry[roomType].length)
          ) {
            console.error(
              `Non-placeable notes: ${definition.noteIds.join(
                ","
              )} - room of that type was not found`
            );
            return;
          }
          const noteId = utils.randomItem(definition.noteIds);
          if (!DUNGEON_NOTES[noteId]) {
            console.error(`Non-placeable note: ${noteId} - invalid note`);
            return;
          }

          const room = roomIds
            ? Entity.getById(utils.randomItem(roomIds))
            : utils.randomItem(roomRegistry[roomType]);

          if (global[noteType].prototype instanceof Item) {
            room.addItem(
              new global[noteType]({
                noteId: noteId
              })
            );
          } else {
            room.addStructure(
              new global[noteType]({
                noteId: noteId,
                roomPlacement: definition.roomPlacement
              })
            );
          }
        }
      });
    }
  }

  static getFromNode(node) {
    return Entity.getEntities(Dungeon).find(d => d.roomNodes.includes(node));
  }
}

module.exports = global.Dungeon = Dungeon;

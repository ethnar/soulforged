const Entity = require("./.entity");
const slack = require("../singletons/slack");
const discord = require("../singletons/discord");
const pushNotifications = require("../singletons/push-notifications");
const jd = require("../client/libs/json-delta");

const changeRole = (roleName, method, member) => {
  const role = global.discordClient.guilds
    .first()
    .roles.find(r => r.name === roleName);

  if (role && member) {
    member[method](role);
  }
};
const addRole = (roleName, member) => changeRole(roleName, "addRole", member);
const removeRole = (roleName, member) =>
  changeRole(roleName, "removeRole", member);

class Player extends Entity {
  constructor(args = {}) {
    super(args);
    this.accessResQ = {};
    this.soulXP = 0;

    this.craftingRecipes = [];
    this.buildingPlans = [];
    this.currentQuests = {};
    this.completedQuests = {};

    this.relationships = this.relationships || {};
    this.relationships.friends = this.relationships.friends || {};
    this.relationships.rivals = this.relationships.rivals || {};

    this.mapData = {};

    Player.list.push(this);
  }

  hasFeatureBadge(badge) {
    this.featureBadges = this.featureBadges || {};
    return this.featureBadges[badge];
  }

  knowsIcon(icon) {
    return this.accessResQ && this.accessResQ[server.filePathToKey(icon)];
  }

  getEncryptedText(languageCode, text) {
    return text
      .split("§")
      .map((line, idx) =>
        idx % 2 === 0
          ? line
          : `<span class="mystery-font">${utils.scrambleLanguage(line)}</span>`
      )
      .join("");
  }

  getInterpretation(languageCode, text) {
    const languageLevel = this.knowsLanguage(languageCode);
    if (languageLevel === 0) {
      return undefined;
    }
    return text
      .split("§")
      .map((line, idx) =>
        idx % 2 === 0 ? line : utils.translationSaveWords(line, languageLevel)
      )
      .join("");
  }

  learnLanguage(languageCode, level = 100) {
    this.languages = this.languages || {};
    this.languages[languageCode] = level;
  }

  knowsLanguage(languageCode) {
    this.languages = this.languages || {};
    return this.languages[languageCode] || 0;
  }

  connected(connection) {
    const creature = this.getCreature();

    if (creature) {
      creature.connected(connection);
    }
  }

  getCraftingRecipes() {
    this.craftingRecipes = this.craftingRecipes || [];
    return this.craftingRecipes;
  }

  getBuildingPlansIds() {
    this.buildingPlans = this.buildingPlans || [];
    return this.buildingPlans;
  }

  getMapData() {
    this.mapData = this.mapData || {};
    return this.mapData;
  }

  getKnownNodeTypes() {
    this.knownNodeTypes = this.knownNodeTypes || {};
    return this.knownNodeTypes;
  }

  getRaces() {
    return this.races ? this.races : ["Human"];
  }

  gainSoulXp(points) {
    this.soulXP += points;
    this.updateDiscordRole();
    const creature = this.getCreature();
    if (creature) {
      creature.logging(
        `Your soul has gained ${points} experience.`,
        LOGGING.GOOD
      );
    }
  }

  updateDiscordRole() {
    if (global.discordClient && this.discord) {
      const member = global.discordClient.guilds
        .first()
        .member(this.discord.id);

      if (!this.getCreature() || this.getCreature().isDead()) {
        addRole("Dead", member);

        removeRole("In Tutorial", member);
        removeRole("Player", member);
        removeRole("Veteran Player", member);
      } else {
        removeRole("Dead", member);

        addRole("Player", member);
        if (this.getSoulLevel() >= 4) {
          addRole("Veteran Player", member);
        }
        if (this.onRookIsland) {
          addRole("In Tutorial", member);
        } else {
          removeRole("In Tutorial", member);
        }
      }
    }
  }

  makeVeteran() {
    if (global.discordClient && this.discord) {
      const member = global.discordClient.guilds
        .first()
        .member(this.discord.id);

      const role = global.discordClient.guilds
        .first()
        .roles.find(r => r.name === "Veteran Player");

      if (role && member) {
        member.addRole(role);
      }
    }
  }

  getSoulLevel() {
    return Math.sqrt(this.soulXP) / 10;
  }

  getPerkPoints() {
    return Math.floor(this.getSoulLevel()) * 10;
  }

  possessCreature(creature) {
    this.creature = creature;
    if (creature) {
      this.creature.setPlayer(this);
    }
    this.updateHttpServer();
  }

  getCreature() {
    return this.creature;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  destroy() {
    const idx = Player.list.indexOf(this);
    Player.list.splice(idx, 1);
    if (this.getCreature()) {
      this.getCreature().player = null;
    }
    super.destroy();
  }

  recordEpitaph() {
    const creature = this.getCreature();
    if (creature) {
      const skillLevels = Object.keys(creature.skills)
        .filter(code => +creature.getSkillLevel(code, false, false).toFixed(2))
        .sort((a, b) => creature.skills[b] - creature.skills[a])
        .map(
          code =>
            `${SKILL_NAMES[code]}: ${creature
              .getSkillLevel(code, false, false)
              .toFixed(2)}`
        )
        .join("<br/>");
      creature.logging(
        `Final skill levels:<br/>${skillLevels}`,
        LOGGING.GOOD,
        false
      );
    }
  }

  static getByProfile(authProfile) {
    const existing = Player.list.find(
      player => `${player.profileId}` === `${authProfile.id}`
    );
    if (existing) {
      return existing;
    }
    return Player.createNew(authProfile);
  }

  static createNew(authProfile) {
    const player = new Player({
      profileId: authProfile.id,
      email: authProfile.emails.pop().value,
      onRookIsland: true
    });
    player.learnLanguage(LANGUAGES.HUMAN);
    player.startQuest(QUESTS.TUTORIAL_1);
    player.updateHttpServer();
    return player;
  }

  cycle(seconds) {
    this.updateQuests(seconds);
  }

  getCurrentQuests() {
    return Object.keys(this.currentQuests).map(questId => ({
      questDetails: Quest.getById(questId),
      questData: this.currentQuests[questId]
    }));
  }

  isOnAQuest(questId) {
    return !!this.currentQuests[questId];
  }

  getQuestObject(questId) {
    return this.currentQuests[questId];
  }

  isQuestComplete(questId) {
    return this.currentQuests[questId] && this.currentQuests[questId].completed;
  }

  cancelQuest(questId) {
    if (!questId) {
      throw new Error("Invalid quest ID", questId);
    }
    if (this.currentQuests[questId]) {
      delete this.currentQuests[questId];
    }
  }

  startQuest(questId) {
    if (!questId) {
      throw new Error("Invalid quest ID", questId);
    }
    const creature = this.getCreature();
    if (creature) {
      const quest = Quest.getById(questId);
      creature.logging(`You have a new quest: ${quest.getTitle()}.`);
      if (quest.onStart) {
        quest.onStart(this);
      }
    }
    this.currentQuests[questId] = {
      objectives: []
    };
    return this.currentQuests[questId];
  }

  updateQuests(seconds) {
    if (!this.getCreature()) {
      return;
    }

    Object.keys(utils.cleanup(this.currentQuests)).forEach(questId => {
      const playerQuest = this.currentQuests[questId];
      if (playerQuest.completed) {
        return;
      }

      const quest = Quest.getById(questId);
      let completed = true;

      playerQuest.objectives = Object.keys(quest.objectives).map(idx => {
        const obj = quest.objectives[idx];

        if (!obj.dynamic && playerQuest.objectives[idx] >= 1) {
          return playerQuest.objectives[idx];
        }
        let progress = obj.progress(this.getCreature(), seconds, playerQuest);
        const target = obj.target || 1;

        if (progress === true) progress = target;
        if (progress === false || !progress) progress = 0;

        const result = progress / target;
        completed = completed && result >= 1;
        return result;
      });

      playerQuest.completed = completed;

      if (completed) {
        this.getCreature().markQuestReviewed(questId, false);
        const creature = this.getCreature();
        creature.logging(
          `You completed a quest: ${quest.getTitle()}.`,
          LOGGING.GOOD
        );
        Inspiration.checkForInspiration(creature.getPlayer());
      }
    });
  }

  finishQuest(questId) {
    this.completedQuests = this.completedQuests || {};
    const quest = Quest.getById(questId);
    if (this.currentQuests[questId]) {
      const questData = this.currentQuests[questId];
      delete this.currentQuests[questId];
      this.completedQuests[questId] = true;
      quest.onFinish(this, questData);

      Inspiration.checkForInspiration(this);
    }
  }

  isQuestFinished(questId) {
    this.completedQuests = this.completedQuests || {};
    return this.completedQuests[questId];
  }

  getQuestsPayload(creature) {
    return Object.keys(utils.cleanup(this.currentQuests)).map(questId => {
      const quest = Quest.getById(questId);

      return quest.getPayload(creature, this.currentQuests[questId]);
    });
  }

  hasAcceptedLegalTerms() {
    return this.acceptedLegalTerms;
  }

  npcFavour(npc) {
    this.favours = this.favours || {};
    return this.favours[npc] || 0;
  }

  getRelationships() {
    this.relationships = this.relationships || {};
    this.relationships.friends = this.relationships.friends || {};
    this.relationships.rivals = this.relationships.rivals || {};
    return this.relationships;
  }

  logging(message, level, notify = true, emoji) {
    const name = this.creature ? this.creature.getName() : this.email;
    utils.log(`${name}: ${message}`, notify);
    const gameChat = require("../singletons/game-chat-server");
    gameChat.sendToPlayer(this, {
      message,
      level
    });
    if (notify) {
      if (server.isFocused(this) && !this.getUserSettings("alwaysNotify")) {
        utils.log(`GAME FOCUSED, NOT SENT: ${name}: ${message}`);
        return;
      }

      if (notify !== true) {
        this.notifyCooldowns = this.notifyCooldowns || {};
        const currentTime = world.getCurrentTime().getTime();
        const disabledUntil = this.notifyCooldowns[notify];
        if (disabledUntil && currentTime < disabledUntil) {
          utils.log(`ANTI-SPAM, NOT SENT: ${name}: ${message}`);
          return;
        }
        this.notifyCooldowns[notify] =
          currentTime + 15 * MINUTES * IN_MILISECONDS;
      }

      utils.log(`Notify: ${this.email} ${message}`);
      if (program.dev) {
        return;
      }

      const stripped = message
        .replace(/<br\/?>/g, " \n")
        .replace(/<[^>]+>/g, "");
      const emojiedMessage = `${emoji ? emoji + " " : ""}${stripped}`;
      pushNotifications.send(this, emojiedMessage);
      if (this.getUserSettings("notifications.slack")) {
        slack.sendMessage(this, emojiedMessage);
      }
      if (this.getUserSettings("notifications.discord")) {
        discord.sendMessage(this, emojiedMessage);
      }
    }
  }

  gainNpcFavour(npc, gain) {
    this.favours = this.favours || {};
    this.favours[npc] = this.favours[npc] || 0;
    this.favours[npc] += gain;
  }

  sendDiscordData() {
    server.sendToPlayer(this, "discord-info", this.discord);
  }

  getUserSettings(key) {
    this.userSettings = this.userSettings || {};
    this.userSettings.recipeSort = this.userSettings.recipeSort || "";
    this.userSettings.recipeToolFilter =
      this.userSettings.recipeToolFilter || "";
    this.userSettings.craftTextFilter = this.userSettings.craftTextFilter || "";
    this.userSettings.buildTextFilter = this.userSettings.buildTextFilter || "";
    this.userSettings.skillFilter = this.userSettings.skillFilter || false;
    this.userSettings.itemPurposeFilter =
      this.userSettings.itemPurposeFilter || false;
    this.userSettings.alwaysNotify = this.userSettings.alwaysNotify || false;
    this.userSettings.notifications = this.userSettings.notifications || {
      discord: true
    };
    this.userSettings.safeties = this.userSettings.safeties || {
      blood: 4,
      pain: 4
    };
    if (!key) {
      return utils.cleanup(this.userSettings);
    }
    return key
      .split(".")
      .reduce((acc, key) => (acc || {})[key], this.userSettings);
  }

  sendUserSettings() {
    server.sendToPlayer(this, "user-settings", this.getUserSettings());
  }

  updateUserSettings(key, value) {
    const path = key.split(".");
    const previousValue = path.reduce(
      (acc, key) => (acc || {})[key],
      this.userSettings
    );
    if (
      typeof value === "object" ||
      typeof previousValue === "object" ||
      previousValue === undefined
    ) {
      utils.error("Invalid user setting", key, value);
      return;
    }

    const containingObject = path
      .slice(0, -1)
      .reduce((acc, key) => (acc || {})[key], this.userSettings);
    containingObject[path[path.length - 1]] = value;

    this.sendUserSettings();
  }

  httpServerData() {
    return {
      id: this.getEntityId(),
      creature: !!this.getCreature(),
      characterName: this.creature && this.creature.getName(),
      email: this.email,
      httpResources: this.accessResQ,
      profileId: this.profileId,
      hasAcceptedLegalTerms: this.hasAcceptedLegalTerms()
    };
  }

  updateHttpServer() {
    if (global.httpServerFork) {
      global.httpServerFork.send({
        type: "player-data",
        playerId: this.getEntityId(),
        data: this.httpServerData()
      });
    }
  }

  static sendMapPayload(connection) {
    const player = server.getPlayer(connection);
    const creature = player.getCreature();
    let data;
    const fullMapData = creature.getCreaturesMapPayload(
      !!connection.lastUpdatePayload,
      connection
    );
    if (!connection.mapDiffActivated) {
      data = fullMapData;
      if (connection.lastUpdatePayload) {
        connection.mapDiffActivated = true;
      }
    } else {
      data = jd.diff(connection.lastUpdatePayload.map, fullMapData);
    }
    if (data) {
      server.sendText(
        connection,
        JSON.stringify({
          u5: "mapData",
          data
        })
      );
    }

    connection.lastUpdatePayload = {
      map: fullMapData
    };
  }

  static updateHttpServer() {
    global.httpServerFork.send({
      type: "players-data",
      data: Player.list.toObject(
        p => p.id,
        p => p.httpServerData()
      )
    });
    global.httpServerFork.send({
      type: "auth-tokens",
      data: Object.keys(world.authTokens).toObject(
        token => token,
        token =>
          world.authTokens[token] &&
          world.authTokens[token].player &&
          world.authTokens[token].player.id
      )
    });
  }

  static httpServerData() {}

  static updateProfiles() {
    const playersByDiscordId = {};
    Player.list.forEach(player => {
      discord.updateProfile(player);
      if (player.discord) {
        playersByDiscordId[player.discord.id] = player;
      }
    });

    if (global.discordClient) {
      global.discordClient.guilds
        .first()
        .members.filter(
          m =>
            `${m.user.username}#${m.user.discriminator}` !== `Soulforged#9436`
        )
        .forEach(member => {
          if (!playersByDiscordId[member.user.id]) {
            utils.log(
              `Invalid discord player: ${member.user.username}#${member.user.discriminator}`
            );
            removeRole("Dead", member);
            removeRole("In Tutorial", member);
            removeRole("Player", member);
            removeRole("Veteran Player", member);
          }
        });
    }
  }

  static purgeInactive() {
    Player.list.forEach(player => {
      const creature = player.getCreature();

      if (creature && !creature.isDead()) {
        delete player.warningLastIssued;
        return;
      }
      if (!player.discord) {
        delete player.warningLastIssued;
        return;
      }

      if (!player.lastAlive) {
        if (creature && creature.timeOfDeath) {
          player.lastAlive = creature.timeOfDeath;
        } else {
          player.lastAlive = world.currentTime;
        }
      }

      if (!player.warningLastIssued) {
        const lastAliveAgoMs =
          world.currentTime.getTime() - player.lastAlive.getTime();

        if (lastAliveAgoMs > 2 * MONTHS * IN_MILISECONDS) {
          Player.issueDiscordWarning(player);
          utils.log(
            `Warning player about discord: ${creature &&
              creature.getName()} - ${player.email} - ${player.discord.name}`
          );
        }
      } else {
        const warnedAgoMs =
          world.currentTime.getTime() - player.warningLastIssued.getTime();

        if (warnedAgoMs > 7 * DAYS * IN_MILISECONDS) {
          utils.log(
            `Removing player about discord: ${creature &&
              creature.getName()} - ${player.email} - ${player.discord.name}`
          );
          Player.removeFromDiscord(player);
        }
      }
    });
  }

  static issueDiscordWarning(player) {
    player.warningLastIssued = world.currentTime;
    discord.sendMessage(
      player,
      `Hi there! First let me thank you for giving my game a try! Hope you found it fun or at least interesting, even if in a quirky way. :) I noticed that for a while now you haven't been playing and we will soon be removing your account from our Discord server. Don't worry! Your player account will remain with us, along with your soul experience and recipes you learned. Should you later choose to return to the game, you will be able to join the discord server same as before.
      
      I'd really appreciate if you could take a few minutes to fill this feedback form to help me better understand which areas need improvement the most: https://forms.gle/Xy7LRis3XsASjZKT6`
    );
  }

  static removeFromDiscord(player) {
    discord.removePlayer(player);
  }

  static freeInactiveHomes() {
    Entity.getEntities(Home).forEach(h => {
      const owner = h.getOwner();
      if (
        owner &&
        owner.isDead() &&
        owner.timeOfDeath &&
        owner.timeOfDeath.getTime() + 1 * MONTHS * IN_MILISECONDS <
          world.getCurrentTime().getTime()
      ) {
        // const player = Player.list.find(p => p.creature === owner);
        // console.log(player.creature.name, owner.name);
        utils.log(
          `Home owned by ${
            owner.name
          } at node ${h.getNode().getEntityId()} is now being made vacant.`
        );
        h.setOwner(null);
      }
    });
  }
}

setInterval(() => {
  Player.updateProfiles();
  Player.purgeInactive();
}, 6 * HOURS * IN_MILISECONDS);

setInterval(() => {
  Player.freeInactiveHomes();
}, 18 * HOURS * IN_MILISECONDS);

Player.list = [];

module.exports = global.Player = Player;

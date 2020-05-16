require("./.quest");

const AYMAR_ICON = `/${ICONS_PATH}/quests/dark_knight_01.png`;

const tutorialDialogue = {
  tutorialInit: {
    label: (quest, creature) => `I have some other questions...`,
    text: (quest, creature) => `What do you need to know?`,
    options: [
      "aboutYou",
      "theWorld",
      "otherHumanoids",
      "death",
      "tutorialReturn"
    ]
  },
  aboutYou: {
    label: (quest, creature) => `I'd like to know more about you...`,
    text: (quest, creature) =>
      `Who I am is of little importance to you if you won't first learn to take care of yourself in this world. But tell me, what is it that you'd like to know exactly?`,
    options: ["whereAreYou", "whatCanYouDo", "tutorialInit", "tutorialReturn"]
  },
  whereAreYou: {
    label: (quest, creature) =>
      `Where are you exactly? I can't really see you anywhere here.`,
    text: (quest, creature) =>
      `I'm very far away from you, but my powers allow me to communicate with you despite the distance. I'm afraid we won't be able to see each other, not for a long while at least.`,
    options: ["whatCanYouDo", "tutorialInit", "tutorialReturn"]
  },
  whatCanYouDo: {
    label: (quest, creature) => `Is there a limit to your power?`,
    text: (quest, creature) =>
      `My powers are vast and way beyond your comprehension. What you need to know right now is that I am capable of creating this avatar for you in this remote location.`,
    options: [
      "whereAreYou",
      "soWhyDoYouNeedMe",
      "tutorialInit",
      "tutorialReturn"
    ]
  },
  soWhyDoYouNeedMe: {
    label: (quest, creature) =>
      `If you are this powerful, why do you need my help at all?`,
    text: (quest, creature) =>
      `My power is immeasurable, but not unlimited. In time when you learn more about this world you will understand. You have an important role to play in protecting this world.`,
    options: ["tutorialInit", "tutorialReturn"]
  },
  theWorld: {
    label: (quest, creature) => `What can you tell me more about this world?`,
    text: (quest, creature) =>
      `The realm is called Xendar and has been my home for centuries. It's home to many creatures and animals, most of them wild or savage. The island you are on is called Rook Island and we are here to test your resolve..`,
    options: [
      "tellMeAboutIsland",
      "otherHumanoids",
      "tutorialInit",
      "tutorialReturn"
    ]
  },
  tellMeAboutIsland: {
    label: (quest, creature) =>
      `Can you tell me anything else about this island?`,
    text: (quest, creature) =>
      `It's a small parcel of land that you'll find is relatively safe and rich with food and materials. But be careful about venturing into the hills to the west - a powerful beast lives there and you are best to avoid that place for the time being.`,
    options: ["tutorialInit", "tutorialReturn"]
  },
  otherHumanoids: {
    label: (quest, creature) => `Are there other people here? Like me or you?`,
    text: (quest, creature) =>
      `I expect you will meet other humans in this world. Some of them will have a Soul controlling them, one that is just like yours. But you may meet others as well, ones that have merely a Spark inside them - you will find that interacting with them may be somewhat... limited.`,
    options: ["tutorialInit", "tutorialReturn"]
  },
  death: {
    label: (quest, creature) => `Is it possible for me to die here?`,
    text: (quest, creature) =>
      `I'm afraid so. This world is full of danger and your avatar, while capable, may still perish. Even if you survive the dangers, the avatar will not live forever. Your soul however is immortal and I'll make sure you always have an avatar you can take control of.`,
    options: ["lifeLength", "deathPenalty", "tutorialInit", "tutorialReturn"]
  },
  lifeLength: {
    label: (quest, creature) => `How long do I have exactly?`,
    text: (quest, creature) =>
      `You shouldn't expect your avatar to live much longer than 150 days. But a dangerous creature or an accident can shorten your lifespan significantly.`,
    options: [
      "explainAccidents",
      "deathPenalty",
      "tutorialInit",
      "tutorialReturn"
    ]
  },
  explainAccidents: {
    label: (quest, creature) => `Accidents? What do you mean accidents?`,
    text: (quest, creature) =>
      `As you go about the world, you should be mindful of the skillfulness of your avatar. Some of the tasks, be it crafting or gathering, they will be extremely difficult or even insurmountable for you. If you attempt such a task there's a fair chance you can get seriously injured.`,
    options: ["avoidingAccidents", "tutorialInit", "tutorialReturn"]
  },
  avoidingAccidents: {
    label: (quest, creature) =>
      `So there are tasks I won't be able to do at all?`,
    text: (quest, creature) =>
      `By using your skills on some slightly easier tasks, the skills will increase and make it easier to perform those very difficult tasks. Through practice you can achieve feats others can't even dream of trying.`,
    options: ["tutorialInit", "tutorialReturn"]
  },
  deathPenalty: {
    label: (quest, creature) => `What happens if I die?`,
    text: (quest, creature) =>
      `Your avatar will be dead, and along with it all of its physical characteristics, skills and memories of the world you explored. The items you have with you - they will all be dropped on the ground.`,
    options: [
      "deathWhatDoIKeep",
      "lifeLength",
      "tutorialInit",
      "tutorialReturn"
    ]
  },
  deathWhatDoIKeep: {
    label: (quest, creature) => `So I lose absolutely everything when I die?`,
    text: (quest, creature) =>
      `Not everything. Your soul is capable of retaining crafting and construction recipes that you discovered. New avatars will be able to use them, but be warned they may lack the skill to be successful. Your soul will also grow closer to this realm and this will enable you to empower your future avatars and unlock their potential. And finally - if you built any houses, they can still be used by any of your future avatars.`,
    options: ["lifeLength", "tutorialInit", "tutorialReturn"]
  }
};

new Quest((QUESTS.TUTORIAL_1 = "tut1"), {
  title: "Welcome",
  description: "Welcome to the world",
  icon: AYMAR_ICON,
  objectives: [],
  dialogue: {
    initComplete: {
      label: (quest, creature) => ``,
      text: (quest, creature) => `Welcome to my world!`,
      options: ["meet"]
    },
    meet: {
      label: (quest, creature) => `Who are you?`,
      text: (quest, creature) =>
        `My name is Aymar and I am the guardian of this world. I have provided you with this vessel and I will need your help. But first you must show me what you are capable of.`,
      options: ["finish", "tutorialInit"]
    },
    tutorialReturn: {
      label: (quest, creature) => `Let's get back on topic...`,
      text: (quest, creature) => `As I was saying, I will need your help.`,
      options: ["finish"]
    },
    finish: {
      label: (quest, creature) => `What do you need from me?`,
      text: (quest, creature) =>
        `We'll start small, but this world is vast and you must learn to adapt. I have high hopes for you.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.startQuest(QUESTS.TUTORIAL_1_5);
  }
});

new Quest((QUESTS.TUTORIAL_1_5 = "tut1.5"), {
  title: "Your needs",
  description:
    "Your character has needs and they have to rely on your to help to meet them.",
  icon: AYMAR_ICON,
  objectives: [
    {
      label: "Satisfy the hunger",
      progress: creature => creature.satiatedTiered >= 100
    }
  ],
  dialogue: {
    init: {
      label: (quest, creature) => ``,
      text: (quest, creature) =>
        `The avatar that I made for you has needs and they need to be looked after. It appears your character is hungry right now - I have provided you with some sustenance to help you get going.`,
      options: ["thank", "tutorialInit"]
    },
    thank: {
      valid: (quest, creature) => creature.getPlayer().npcFavour("Aymar") < 1,
      label: (quest, creature) => `Thank you.`,
      text: (quest, creature) => `You are most welcome, little one.`,
      options: ["tutorialInit"],
      onTrigger: (quest, creature) => {
        creature.getPlayer().gainNpcFavour("Aymar", 1);
      }
    },
    initComplete: {
      label: (quest, creature) => ``,
      text: (quest, creature) =>
        `I see you are well fed now, that's good. Keep in mind to keep yourself well fed in the future.`,
      options: ["tutorialInit", "finish"]
    },
    finish: {
      label: (quest, creature) => `So, what's next?`,
      text: (quest, creature) =>
        `Next I'll help you learn how to take care of yourself.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onStart: player => {
    player.getCreature().addItemByType(Bread, 6);
  },
  onFinish: player => {
    player.startQuest(QUESTS.TUTORIAL_DISCORD);
    player.startQuest(QUESTS.TUTORIAL_2);
  }
});

new Quest((QUESTS.TUTORIAL_2 = "tut2"), {
  title: "Gather",
  description: "Gather required materials",
  icon: AYMAR_ICON,
  objectives: [
    {
      label: "Start gathering stones",
      progress: creature =>
        creature.isDoingAction("Gather") &&
        creature.getActionTarget() instanceof Pebbles
    },
    {
      label: "Collect 5 stones",
      progress: creature => creature.getItemQty("Stone", false),
      target: 5,
      dynamic: true
    },
    {
      label: "Start gathering twigs",
      progress: creature =>
        creature.isDoingAction("Gather") &&
        creature.getActionTarget() instanceof Twigs
    },
    {
      label: "Collect 5 twigs",
      progress: creature => creature.getItemQty("Twig", false),
      target: 5,
      dynamic: true
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `All you need to live and prosper is available to you in this land. Start off by gathering some basic materials.`,
      options: ["tutorialInit"]
    },
    initComplete: {
      text: (quest, creature) => `Have you gathered everything I asked?`,
      options: ["finish"]
    },
    finish: {
      label: (quest, creature) => "I have all the materials.",
      text: (quest, creature) =>
        `Good. Keep them, as you will need them later.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(30);
    player.startQuest(QUESTS.TUTORIAL_3);
  }
});

new Quest((QUESTS.TUTORIAL_3 = "tut3"), {
  title: "Research",
  description: `By conducting research you will have access to new tool and items that will help you survive and explore the land.`,
  icon: AYMAR_ICON,
  objectives: [
    /*{
        label: 'Start researching',
        progress: (creature) =>
            creature.isDoingAction('Research'),
    }, */ {
      label: "Research a crafting recipe",
      progress: creature => creature.getCraftingRecipes().length >= 1
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `This world can be a perilous place and you will need tools and equipment to survive. The most reliable way to get them is using your skills and ingenuity.`,
      options: ["tutorialInit"]
    },
    initComplete: {
      text: (quest, creature) =>
        `I see you now know how to make a ${Recipe.getRecipeById(
          creature.getCraftingRecipes()[0]
        )
          .getName()
          .toLowerCase()}. It's good progress, but remember there's still much for you to learn.`,
      options: [],
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      }
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(30);
    player.startQuest(QUESTS.TUTORIAL_4A);
    player.startQuest(QUESTS.TUTORIAL_4B);
    player.startQuest(QUESTS.TUTORIAL_4C);
  }
});

new Quest((QUESTS.TUTORIAL_DISCORD = "tut4discord"), {
  title: "Connecting with others",
  description: `There are others souls in this realm and there are ways to contact them`,
  icon: AYMAR_ICON,
  autoAcquireConditions: [
    creature =>
      creature.isPlayableCharacter() &&
      (creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_1_5) ||
        creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_5))
  ],
  objectives: [
    {
      label: `Join Discord server`,
      progress: creature => !!creature.getPlayer().discord
    }
  ],
  dialogue: {
    init: {
      label: (quest, creature) => "[Back to conversation]",
      text: (quest, creature) =>
        `Your avatar makes for a powerful vessel, potentially. But even then - there's strength in numbers. You will meet others like yourself, commanded by souls, and they can be of great help. To enable you to connect with them I have employed a particular tool - I believe in your realm it is known as "Discord". You will find me there as well and if you are in dire need, know that you can always ask for help.`,
      options: ["howToJoin", "tutorialInit"]
    },
    howToJoin: {
      icon: `/${ICONS_PATH}/quests/sgi_03.png`,
      label: (quest, creature) => '[How do I use "Discord"?]',
      text: (quest, creature) =>
        `Discord is a chat & voice chat application that is popular in gaming communities. Using Discord requires a free account set up at their <a target="_blank" href="http://discordapp.com">website</a>. Once you have an account created there, go back to the game, open the Character panel and go to Settings tab (indicated by a cogs icon). That's where you'll find a button to connect your in-game account with discord and by following the instructions you will gain access to Soulforged's Discord server & notifications via Discord.`,
      options: ["init"]
    },
    initComplete: {
      text: (quest, creature) =>
        `I see you have connected with others through this tool I mentioned. Good.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(15);
  }
});

const nutritionRequired = 50;
new Quest((QUESTS.TUTORIAL_4A = "tut4a"), {
  title: "Sustenance",
  description: `Your character needs food to sustain themselves.`,
  icon: AYMAR_ICON,
  objectives: [
    {
      label: `Collect ${nutritionRequired} nutrition worth of food`,
      progress: creature =>
        creature
          .getItems()
          .filter(i => i instanceof Edible)
          .reduce((acc, i) => acc + (i.nutrition * i.qty || 0), 0),
      target: nutritionRequired,
      dynamic: true
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `Your avatar requires food to sustain themselves. There's multiple food sources out there for you to find, you should always make sure that you have enough to keep yourself well fed at least for the next day.`,
      options: ["tutorialInit"]
    },
    initComplete: {
      text: (quest, creature) => `Good, I see you have food with you now.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(15);
    if (
      player.isQuestFinished(QUESTS.TUTORIAL_4A) &&
      player.isQuestFinished(QUESTS.TUTORIAL_4B) &&
      player.isQuestFinished(QUESTS.TUTORIAL_4C)
    ) {
      player.startQuest(QUESTS.TUTORIAL_5);
    }
  }
});

new Quest((QUESTS.TUTORIAL_4B = "tut4b"), {
  title: "Exploration",
  description: `Explore Rook Island`,
  icon: AYMAR_ICON,
  objectives: [
    {
      label: "Reach western coast of the Rook Island",
      progress: creature => creature.isNodeMapped(Entity.getById(1141))
    },
    {
      label: "Step into the forest",
      progress: creature =>
        creature.getNode().isType(NODE_TYPES.BROADLEAF_FOREST)
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `Explore the surrounding lands to find new resources. Be sure to visit places you've been to before every few days, as now and again you will find there are some new resources available there.`,
      options: ["tutorialInit"]
    },
    initComplete: {
      text: (quest, creature) =>
        `You have seen what Rook Island has to offer. This is just a tiny island, soon you will have a much larger world to explore.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(15);
    if (
      player.isQuestFinished(QUESTS.TUTORIAL_4A) &&
      player.isQuestFinished(QUESTS.TUTORIAL_4B) &&
      player.isQuestFinished(QUESTS.TUTORIAL_4C)
    ) {
      player.startQuest(QUESTS.TUTORIAL_5);
    }
  }
});

new Quest((QUESTS.TUTORIAL_4C = "tut4c"), {
  title: "Equipment",
  description: `Collect and put on some equipment.`,
  icon: AYMAR_ICON,
  objectives: [
    {
      label: "Equip a weapon",
      progress: creature => !!creature.getEquipment(EQUIPMENT_SLOTS.WEAPON)
    },
    {
      label: "Equip a piece of clothing",
      progress: creature =>
        !!creature.getEquipment(EQUIPMENT_SLOTS.CHEST) ||
        !!creature.getEquipment(EQUIPMENT_SLOTS.FEET) ||
        !!creature.getEquipment(EQUIPMENT_SLOTS.HANDS) ||
        !!creature.getEquipment(EQUIPMENT_SLOTS.TROUSERS)
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `Use the resources you can find on the island to craft yourself some equipment.`,
      options: ["gettingWeapon", "gettingClothing", "tutorialInit"]
    },
    gettingWeapon: {
      label: (quest, creature) => `What can I use as a weapon?`,
      text: (quest, creature) =>
        `Many basic tools can be used as a weapon and while not ideal, you can still rely on stone tool to suffice. At least for now.`,
      options: ["gettingClothing", "tutorialInit"]
    },
    gettingClothing: {
      label: (quest, creature) => "How do I get some clothing?",
      text: (quest, creature) =>
        `If you scour the island you'll find some rabbits. It isn't much, but I'm certain you can tie together some clothing made out of their pelt.`,
      options: ["gettingWeapon", "tutorialInit"]
    },
    initComplete: {
      text: (quest, creature) =>
        `I see you now have some equipment with you, good. It's basic for now, but I trust you will find ways to get better equipment. You must.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(15);
    if (
      player.isQuestFinished(QUESTS.TUTORIAL_4A) &&
      player.isQuestFinished(QUESTS.TUTORIAL_4B) &&
      player.isQuestFinished(QUESTS.TUTORIAL_4C)
    ) {
      player.startQuest(QUESTS.TUTORIAL_5);
    }
  }
});

new Quest((QUESTS.TUTORIAL_5 = "tut5"), {
  title: "The final challenge",
  description: `Attack the troll`,
  icon: AYMAR_ICON,
  objectives: [
    {
      label: "Attack the troll",
      progress: creature => {
        const fightingTroll =
          creature.isDoingAction("Fight") &&
          creature.getNode().getEntityId() === 1752;

        creature.getPlayer().onRookIsland = false;

        return fightingTroll;
      }
    },
    {
      label: "Finish the fight",
      progress: creature => {
        return creature.isOnMainland;
      }
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `You now know the basics of surviving in this world. Soon you will set out on a much bigger journey far from Rook Island. Where you are going, I'm afraid I won't be able to help you much. And worse yet, I'm afraid you can't take this avatar there with you. You will have to leave it behind.`,
      options: ["whatNext", "tutorialInit"]
    },
    whatNext: {
      label: (quest, creature) =>
        `So what happens next, does this mean I'll have to die?`,
      text: (quest, creature) =>
        `It is necessary. There's a troll on this island. He's an aggresive and dangerous creature, lives in the hills to the west. Show me your bravery and face off the beast.`,
      options: []
    },
    initComplete: {
      text: (quest, creature) =>
        `You fought bravely, but the result is no surprise. You did well. From now on, I'm afraid, you will be on your own. But we will meet again, I look forward to the day.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(50);
  }
});

new Quest((QUESTS.TUTORIAL_CUT = "tut4cut"), {
  title: "Tending wounds",
  description: `If your avatar gets hurt it's a good idea to take care of their wounds`,
  icon: AYMAR_ICON,
  autoAcquireConditions: [
    creature => creature.isPlayableCharacter() && !!creature.hasBuff("BuffCut")
  ],
  objectives: [
    {
      label: `Discover how to make Tourniquet`,
      progress: creature =>
        creature.knowsCraftingRecipe(
          Recipe.getRecipeById("PrimitiveTourniquet")
        )
    },
    {
      label: `Make a Tourniquet`,
      progress: creature => creature.hasItemType("PrimitiveTourniquet")
    },
    {
      label: `Tend to your wounds`,
      progress: creature => creature.hasBuff("BuffCutPrimitiveTourniquet")
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `I see that you have suffered an injury. Even a simple cut can have consequences - most threatening of which is losing your blood. There are items you can craft that will help you with that. ${
          creature.hasBuff("BuffCut")
            ? ``
            : `And while the injury is no longer your concern you best prepare yourself to handle this in the future.`
        }`,
      options: ["howDoICraft", "tutorialInit"]
    },
    howDoICraft: {
      label: (quest, creature) => "How do I make this item?",
      text: (quest, creature) =>
        `Bark rope can be cut up into a primitive tourniquet, all you need is to research how exactly that is done.`,
      options: ["iDontHaveMaterials", "tutorialInit"]
    },
    iDontHaveMaterials: {
      valid: (quest, creature) =>
        !quest.receivedMaterials &&
        !creature.hasItemType("BarkRope") &&
        creature.hasBuff("BuffCut"),
      label: (quest, creature) => `But I don't have any bark rope with me.`,
      text: (quest, creature) =>
        `I see. Very well, I will provide you with some.`,
      options: ["tutorialInit"],
      onTrigger: (quest, creature) => {
        quest.receivedMaterials = true;
        creature.addItemByType(BarkRope, 5);
      }
    },
    initComplete: {
      text: (quest, creature) =>
        `I see you took care of your wounds. Good, be sure to do that in the future, when the need arises.`,
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      },
      options: []
    },
    ...tutorialDialogue
  },
  onFinish: player => {
    player.gainSoulXp(5);
  }
});

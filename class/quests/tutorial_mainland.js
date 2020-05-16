require("./.quest");

const GUIDE_ICON = `/${ICONS_PATH}/quests/sgi_03.png`;

new Quest((QUESTS.TUTORIAL_MAINLAND_CRAFTING_10 = "tut_main_crafting10"), {
  title: "Learning the craft",
  description: "Discover new crafting recipes",
  icon: GUIDE_ICON,
  autoAcquireConditions: [
    creature =>
      creature.getPlayer() &&
      creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_5)
  ],
  objectives: [
    {
      label: "Learn 10 crafting recipes",
      progress: creature => creature.getCraftingRecipes().length,
      target: 10
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `To survive and thrive in this world I must learn to use the resources available in this world. I need to learn new crafting recipes to access new tools, equipment and other useful items.`,
      options: []
    },
    initComplete: {
      text: (quest, creature) =>
        `This is just the beginning, I feel there's much more to learn yet.`,
      options: [],
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      }
    }
  },
  onFinish: player => {
    player.gainSoulXp(20);
  }
});

new Quest((QUESTS.TUTORIAL_MAINLAND_SHELTER_1 = "tut_main_shelter1"), {
  title: "Making a shelter",
  description: "Discover a recipe and build any shelter",
  icon: GUIDE_ICON,
  autoAcquireConditions: [
    creature =>
      creature.getPlayer() &&
      creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_5)
  ],
  objectives: [
    {
      label: "Discover the recipe for building a shelter",
      progress: creature =>
        creature
          .getBuildingPlansIds()
          .some(
            b => Plan.getPlanById(b).getConstructor().prototype instanceof Home
          )
    },
    {
      label: "Build a shelter",
      progress: creature => !!creature.getHome(),
      dynamic: true
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `I should be able to make a shelter that will protect me from elements and provide me with some storage space. Having a shelter would really make this place start to feel like home.`,
      options: []
    },
    initComplete: {
      text: (quest, creature) =>
        creature.getHome() instanceof LeanTo
          ? `This may look shoddy, but it'll have to do for now.`
          : `That's a proper shelter, something to be proud of.`,
      options: [],
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      }
    }
  },
  onFinish: player => {
    player.gainSoulXp(20);
    player.startQuest(QUESTS.TUTORIAL_MAINLAND_SHELTER_2);

    const creature = player.getCreature();
    if (!(creature.getHome() instanceof LeanTo)) {
      player.finishQuest(QUESTS.TUTORIAL_MAINLAND_SHELTER_2);
    }
  }
});

new Quest((QUESTS.TUTORIAL_MAINLAND_SHELTER_2 = "tut_main_shelter2"), {
  title: "Getting comfortable",
  description: "Discover and build a better shelter than a Lean-To",
  icon: GUIDE_ICON,
  objectives: [
    {
      label: "Discover the recipe to build an improved shelter",
      progress: creature =>
        creature
          .getBuildingPlansIds()
          .some(
            b =>
              Plan.getPlanById(b).getConstructor().prototype instanceof Home &&
              !(Plan.getPlanById(b).getConstructor() === LeanTo)
          ),
      dynamic: true
    },
    {
      label: "Build a better shelter",
      progress: creature =>
        creature.getHome() &&
        creature.getHome().getHomeLevel() > LeanTo.prototype.homeLevel,
      dynamic: true
    }
  ],
  dialogue: {
    init: {
      text: (quest, creature) =>
        `The Lean-To marks a place to call home, but I know I can do better than this`,
      options: []
    },
    initComplete: {
      text: (quest, creature) => `That should keep me comfortable for a while.`,
      options: [],
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      }
    }
  },
  onFinish: player => {
    player.gainSoulXp(40);
  }
});

new Quest(
  (QUESTS.TUTORIAL_MAINLAND_EXPLORATION_AREA = "tut_main_explor_area"),
  {
    title: "Mapping the land",
    description: "Scout out a wide area",
    icon: GUIDE_ICON,
    autoAcquireConditions: [
      creature =>
        creature.getPlayer() &&
        creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_5) &&
        creature.getKnownNodes().length >= 15
    ],
    objectives: [
      {
        label: "Map out 100 locations",
        progress: creature => creature.getKnownNodes().length,
        target: 100,
        dynamic: true
      }
    ],
    dialogue: {
      init: {
        text: (quest, creature) =>
          `I have scouted the immediate surroundings, but with some further exploration I may find new lands and resources. There must be more to see here than this.`,
        options: []
      },
      initComplete: {
        text: (quest, creature) =>
          `I have a feeling this is just a tip of an iceberg.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    },
    onFinish: player => {
      player.gainSoulXp(40);
    }
  }
);

new Quest(
  (QUESTS.TUTORIAL_MAINLAND_EXPLORATION_TYPES = "tut_main_explor_type"),
  {
    title: "The far away lands",
    description: "Discover different types of land",
    icon: GUIDE_ICON,
    autoAcquireConditions: [
      creature =>
        creature.getPlayer() &&
        creature
          .getPlayer()
          .isQuestFinished(QUESTS.TUTORIAL_MAINLAND_EXPLORATION_AREA) &&
        Object.keys(creature.getKnownNodeTypes()).length >= 6 &&
        creature.getSkillLevel(SKILLS.PATHFINDING) >= 1
    ],
    objectives: [
      {
        label: "Discover 14 different terrain types",
        progress: creature =>
          Object.keys(creature.getKnownNodeTypes()).length - 1, // account for water
        target: 14,
        dynamic: true
      }
    ],
    dialogue: {
      init: {
        text: (quest, creature) =>
          `I have seen vast swathes of land, but some places seem very different than others. There must be more to see in this world, I will need to explore more to see it.`,
        options: []
      },
      initComplete: {
        text: (quest, creature) =>
          `This world doesn't seem to be much different to ours from what I saw... so far.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    },
    onFinish: player => {
      player.gainSoulXp(40);
    }
  }
);

new Quest(
  (QUESTS.TUTORIAL_MAINLAND_ITEM_KNOWLEDGE = "tut_main_item_knowledge"),
  {
    title: "Knowledge is Power",
    description: `Learn about different item types in this world`,
    icon: GUIDE_ICON,
    autoAcquireConditions: [
      creature =>
        creature.getPlayer() &&
        creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_5) &&
        Object.keys(creature.getKnownItems()).length >= 15
    ],
    objectives: [
      {
        label: "Discover 60 different items",
        progress: creature => Object.keys(creature.getKnownItems()).length,
        target: 60,
        dynamic: true
      }
    ],
    dialogue: {
      init: {
        text: (quest, creature) =>
          `There are many items in this world, made by nature, crafted and otherwise. It might be worthwhile to learn about these items. Just need to make sure I get my hands on any new item I learn about.`,
        options: []
      },
      initComplete: {
        text: (quest, creature) =>
          `This world doesn't seem to be much different to ours from what I saw... so far.`,
        options: [],
        onTrigger: (quest, creature) => {
          quest.complete(creature);
        }
      }
    },
    onFinish: player => {
      player.gainSoulXp(40);
    }
  }
);

function hasAccessToProperWeapons(creature) {
  return Object.keys(creature.getKnownItems()).some(
    itemClass =>
      global[itemClass] &&
      global[itemClass].prototype.damage &&
      Object.values(global[itemClass].prototype.damage).some(v => v >= 15)
  );
}
new Quest((QUESTS.TUTORIAL_MAINLAND_FIGHTING_1 = "tut_main_fighting1"), {
  title: "The Brawn",
  description: `Defeat a hostile creature`,
  icon: GUIDE_ICON,
  autoAcquireConditions: [creature => hasAccessToProperWeapons(creature)],
  objectives: [
    {
      label: "Defeat an enemy",
      progress: creature =>
        creature
          .getNode()
          .getCreatures()
          .some(
            c => c.isHostile(creature) && c.isDead() && c.deterioration <= 3
          )
    }
  ],
  dialogue: {
    init: {
      text: () =>
        `Now that I have access to some proper weapons, I should be able to handle some hostiles - some of them don't look that threatening after all.`,
      options: []
    },
    initComplete: {
      text: () =>
        `That wasn't too bad. I wonder what other dangerous creatures await in this world.`,
      options: [],
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      }
    }
  },
  onFinish: player => {
    player.gainSoulXp(50);
  }
});

const creaturesTypesNeeded = ["ForestSpider", "Snake", "Wolf", "DuskCrow"];
new Quest((QUESTS.TUTORIAL_MAINLAND_FIGHTING_2 = "tut_main_fighting2"), {
  title: "Apex predator",
  description: `Defeat a number of predator animals`,
  icon: GUIDE_ICON,
  autoAcquireConditions: [
    creature =>
      creature.getPlayer() &&
      creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_MAINLAND_FIGHTING_1)
  ],
  questEventsHandler: {
    kill: (humanoid, { questData }, creature) => {
      if (creaturesTypesNeeded.includes(creature.constructor.name)) {
        const prop = `kills${creature.constructor.name}`;
        questData[prop] = questData[prop] || 0;
        questData[prop] += 1;
      }
    }
  },
  objectives: creaturesTypesNeeded.map(className => ({
    label: creature =>
      creature.getPlayer().knowsIcon(global[className].prototype.icon)
        ? `Kill 5 ${global[className].getName()}`
        : "(unknown objective)",
    progress: (creature, seconds, quest) => quest[`kills${className}`],
    target: 5
  })),
  dialogue: {
    init: {
      text: (quest, creature) =>
        `If I want to tame this land, I need to face off with the predators of the land. If I defeat a number of them that should give me more insight into how I can conquer this land.`,
      options: []
    },
    initComplete: {
      text: (quest, creature) =>
        `I feel a new level of familiarity with the land and the animals of this world. There might be more that I can do with this knowledge.`,
      options: [],
      onTrigger: (quest, creature) => {
        quest.complete(creature);
      }
    }
  },
  onFinish: player => {
    player.gainSoulXp(100);
  }
});

new ResearchConcept({
  name: "Animal Taming",
  className: "ResearchConcept_Taming",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    creature =>
      creature.getPlayer().isQuestFinished(QUESTS.TUTORIAL_MAINLAND_FIGHTING_2)
  ]
});

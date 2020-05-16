require("./.bootstrap");

const worldFactory = () => {
  global.world = new World();
  const player = new Player();
  const human = new Human();
  player.featureBadges = {};
  player.possessCreature(human);
  const wolf = new Wolf();
  const lion = new Lion();
  const plaguebeast = new Plaguebeast();
  const troll = new Troll();
  const node1 = new Node({ type: NODE_TYPES.PLAINS });
  const node2 = new Node({ type: NODE_TYPES.PLAINS });
  const node3 = new Node({ type: NODE_TYPES.PLAINS });
  new Path({}, node1, node2);
  new Path({}, node2, node3);
  node2.addCreature(human);
  node1.addCreature(wolf);
  node1.addCreature(lion);
  node1.addCreature(plaguebeast);
  node1.addCreature(troll);

  return {
    node1,
    node2,
    node3,
    human,
    wolf,
    lion,
    plaguebeast,
    troll
  };
};

const payloads = {
  unknown: {
    icon: server.filePathToKey("/resources/icons96/creatures/checkbox_02.png"),
    name: "Unknown"
  },
  unknownFriendly: {
    icon: server.filePathToKey(
      "/resources/icons96/creatures/checkbox_02_green.png"
    ),
    name: "Unknown (friendly)"
  },
  unknownHostile: {
    icon: server.filePathToKey(
      "/resources/icons96/creatures/checkbox_02_red.png"
    ),
    name: "Unknown (hostile)",
    hostile: true
  },
  wolf: {
    self: false,
    name: "Unnamed",
    icon: server.filePathToKey(
      "/resources/icons96/creatures/monsters/animals/arctic_wolf.png"
    ),
    dead: undefined,
    isPlayer: null
  },
  buffs: {
    unknown: Creature.getUnknownBuffsPayload({ getPlayer: () => ({}) })
  }
};

const scoutOut = (human, creatures, times = 1) => {
  creatures.forEach(creature => {
    for (let i = 0; i < times; i += 1) human.scoutOut(creature);
  });
};

const moveCreatures = (creatures, where) => {
  creatures.forEach(creature => {
    creature.move(where);
  });
};

test("You get minimum information on nearby creatures without any tracking", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();

  expect(human.canSeeCreatureDetails(wolf)).toBe(0);
  expect(human.canSeeCreatureDetails(lion)).toBe(0);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(0);
  expect(human.canSeeCreatureDetails(troll)).toBe(0);
});

test("You get some information on nearby creatures when you scout them", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();
  scoutOut(human, [wolf, lion, plaguebeast, troll]);

  expect(human.canSeeCreatureDetails(wolf)).toBe(1);
  expect(human.canSeeCreatureDetails(lion)).toBe(1);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(1);
  expect(human.canSeeCreatureDetails(troll)).toBe(1);
});

test("You get some information on nearby creatures when you scout them few times", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();
  scoutOut(human, [wolf, lion, plaguebeast, troll], 3);

  expect(human.canSeeCreatureDetails(wolf)).toBe(3);
  expect(human.canSeeCreatureDetails(lion)).toBe(3);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(3);
  expect(human.canSeeCreatureDetails(troll)).toBe(3);
});

test("Scouting more than 3 times does not add more info", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();
  scoutOut(human, [wolf, lion, plaguebeast, troll], 10);

  expect(human.canSeeCreatureDetails(wolf)).toBe(3);
  expect(human.canSeeCreatureDetails(lion)).toBe(3);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(3);
  expect(human.canSeeCreatureDetails(troll)).toBe(3);
});

test("You get some of the information on nearby creatures depending on tracking", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 2);

  expect(human.canSeeCreatureDetails(wolf)).toBe(2);
  expect(human.canSeeCreatureDetails(lion)).toBe(2);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(2);
  expect(human.canSeeCreatureDetails(troll)).toBe(2);
});

test("You get some of the information on nearby creatures depending on tracking", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 3);

  expect(human.canSeeCreatureDetails(wolf)).toBe(3);
  expect(human.canSeeCreatureDetails(lion)).toBe(3);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(3);
  expect(human.canSeeCreatureDetails(troll)).toBe(3);
});

test("You get more information on nearby creatures depending on tracking", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 2);
  scoutOut(human, [wolf, lion, plaguebeast, troll]);

  expect(human.canSeeCreatureDetails(wolf)).toBe(3);
  expect(human.canSeeCreatureDetails(lion)).toBe(3);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(3);
  expect(human.canSeeCreatureDetails(troll)).toBe(3);
});

test("You get lots of information with legendary tracking", () => {
  const { human, wolf, lion, plaguebeast, troll } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 5);

  expect(human.canSeeCreatureDetails(wolf)).toBe(5);
  expect(human.canSeeCreatureDetails(lion)).toBe(5);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(5);
  expect(human.canSeeCreatureDetails(troll)).toBe(5);
});

test("You get all the information when you move to the location as the creature", () => {
  const { human, wolf, lion, plaguebeast, troll, node1 } = worldFactory();
  human.move(node1);

  expect(human.canSeeCreatureDetails(wolf)).toBe(6);
  expect(human.canSeeCreatureDetails(lion)).toBe(6);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(6);
  expect(human.canSeeCreatureDetails(troll)).toBe(6);
});

test("You get all the information when the creature moves to your location", () => {
  const { human, wolf, lion, plaguebeast, troll, node2 } = worldFactory();
  wolf.move(node2);
  lion.move(node2);
  plaguebeast.move(node2);
  troll.move(node2);

  expect(human.canSeeCreatureDetails(wolf)).toBe(6);
  expect(human.canSeeCreatureDetails(lion)).toBe(6);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(6);
  expect(human.canSeeCreatureDetails(troll)).toBe(6);
});

test("The information is retained, even if you move away", () => {
  const {
    human,
    wolf,
    lion,
    plaguebeast,
    troll,
    node1,
    node2
  } = worldFactory();
  human.move(node1);
  human.move(node2);

  expect(human.canSeeCreatureDetails(wolf)).toBe(6);
  expect(human.canSeeCreatureDetails(lion)).toBe(6);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(6);
  expect(human.canSeeCreatureDetails(troll)).toBe(6);
});

test("Moving reduces the scouting level others have on the creature", () => {
  const {
    human,
    wolf,
    lion,
    plaguebeast,
    troll,
    node1,
    node3
  } = worldFactory();
  human.move(node1);

  expect(human.canSeeCreatureDetails(wolf)).toBe(6);
  expect(human.canSeeCreatureDetails(lion)).toBe(6);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(6);
  expect(human.canSeeCreatureDetails(troll)).toBe(6);

  moveCreatures([wolf, lion], node3);
  moveCreatures([wolf, lion], node3);
  moveCreatures([wolf, lion], node3);

  expect(human.canSeeCreatureDetails(wolf)).toBe(4);
  expect(human.canSeeCreatureDetails(lion)).toBe(4);
  expect(human.canSeeCreatureDetails(plaguebeast)).toBe(6);
  expect(human.canSeeCreatureDetails(troll)).toBe(6);
});

test("There is a limit on how much traveling reduces tracking", () => {
  const { human, wolf, node1, node3 } = worldFactory();
  human.move(node1);

  expect(human.canSeeCreatureDetails(wolf)).toBe(6);

  for (let i = 0; i < 50; i++) moveCreatures([wolf], node3);

  expect(human.canSeeCreatureDetails(wolf)).toBe(0);
});

test("Provides no details when information level is 0", () => {
  const { human, wolf } = worldFactory();

  human.canSeeCreatureDetails = jest.fn(() => 0);

  const payload = wolf.getPayload(human);
  expect(payload).toEqual(expect.objectContaining(payloads.unknown));
  expect(payload).toEqual(expect.not.objectContaining(payloads.wolf));
  // expect(payload.info).toEqual([]);
});

test("Provides one piece of information at level 1", () => {
  const { human, wolf } = worldFactory();

  human.canSeeCreatureDetails = jest.fn(() => 1);

  const payload = wolf.getPayload(human);
  expect(payload).toEqual(expect.objectContaining(payloads.unknown));
  expect(payload).toEqual(expect.not.objectContaining(payloads.wolf));
  // expect(payload.info.length).toEqual(1);
});

test("Provides details regarding hostility at level 2", () => {
  const { human, wolf } = worldFactory();

  human.canSeeCreatureDetails = jest.fn(() => 2);

  const payload = wolf.getPayload(human);
  expect(payload).toEqual(expect.objectContaining(payloads.unknownHostile));
  expect(payload).toEqual(expect.not.objectContaining(payloads.wolf));
});

test("Provides several pieces of information at level 8", () => {
  const { human, wolf } = worldFactory();

  human.canSeeCreatureDetails = jest.fn(() => 4);

  const payload = wolf.getPayload(human);
  expect(payload).toEqual(expect.objectContaining(payloads.unknownHostile));
  expect(payload).toEqual(expect.not.objectContaining(payloads.wolf));
  // expect(payload.info.length).toEqual(3);
});

test("Provides everything except buffs at level 9", () => {
  const { human, wolf } = worldFactory();

  human.canSeeCreatureDetails = jest.fn(() => 5);

  const payload = wolf.getPayload(human);
  expect(payload).toEqual(expect.not.objectContaining(payloads.unknown));
  expect(payload).toEqual(expect.objectContaining(payloads.wolf));
  expect(payload.buffs).toEqual(expect.arrayContaining(payloads.buffs.unknown));
  // expect(payload.info.length).toEqual(3);
});

test("Provides all details at level 10", () => {
  const { human, wolf } = worldFactory();

  human.canSeeCreatureDetails = jest.fn(() => 6);

  const payload = wolf.getPayload(human);
  expect(payload).toEqual(expect.not.objectContaining(payloads.unknown));
  expect(payload).toEqual(expect.objectContaining(payloads.wolf));
  expect(payload.buffs).toEqual(
    expect.not.arrayContaining(payloads.buffs.unknown)
  );
  // expect(payload.info.length).toEqual(3);
});

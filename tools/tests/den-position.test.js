require("./.bootstrap");

const expandLand = (node, xMod, yMod, distance = 1) => {
  const newNode = new Node({
    x: node.x + xMod,
    y: node.y + yMod,
    type: NODE_TYPES.PLAINS
  });
  new Path({}, node, newNode);
  if (distance > 1) {
    return expandLand(newNode, xMod, yMod, distance - 1);
  }
  return newNode;
};

const worldFactory = () => {
  global.world = new World();
  const player = new Player();
  const human = new Human();
  player.possessCreature(human);

  const startNode = new Node({ x: 0, y: 0, type: NODE_TYPES.PLAINS });
  startNode.addCreature(human);

  return {
    human,
    startNode
  };
};

test("No dens around", () => {
  const { human, startNode } = worldFactory();

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe("You find no dens in your vicinity.");
});

test("One den close, no tracking", () => {
  const { human, startNode } = worldFactory();
  new MonsterDen({
    atLocation: expandLand(startNode, -10, -10),
    denType: "WolfDen"
  });

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe("You scout one den close by to the north-west.");
});

test("One den at your location, too hard to track", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, -3);
  new MonsterDen({
    atLocation: startNode,
    denType: "WolfDen"
  });

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe(
    "You scout one den at your current location, but you cannot find the entrance."
  );
});

test("One den at your location, easy enough to track", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 0);
  new MonsterDen({
    atLocation: startNode,
    denType: "WolfDen"
  });

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe("You scout one den at your current location.");
});

test("One den close, max tracking", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 10);
  new MonsterDen({
    atLocation: expandLand(startNode, -10, -10),
    denType: "WolfDen"
  });

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe("You scout one den close by to the north-west.");
});

test("One den close, barely enough tracking", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, -2);
  new MonsterDen({
    atLocation: expandLand(startNode, -10, -10),
    denType: "WolfDen"
  });

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe("You scout one den close by.");
});

test("Two dens in the same direction", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 10);
  new MonsterDen({
    atLocation: expandLand(startNode, -10, -10),
    denType: "WolfDen"
  });
  new MonsterDen({
    atLocation: expandLand(startNode, -20, -20),
    denType: "WolfDen"
  });

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe("You scout a few dens close by to the north-west.");
});

test("Two dens in different directions", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 10);
  new MonsterDen({
    atLocation: expandLand(startNode, -10, -10),
    denType: "WolfDen"
  });
  new MonsterDen({
    atLocation: expandLand(startNode, 10, 10),
    denType: "WolfDen"
  });

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe(
    "You scout one den close by to the north-west and another one close by to the south-east."
  );
});

test("Multiple dens in two different directions", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 10);
  new MonsterDen({
    atLocation: expandLand(startNode, -10, -10),
    denType: "WolfDen"
  });
  const southEast = () =>
    new MonsterDen({
      atLocation: expandLand(startNode, 10, 10),
      denType: "WolfDen"
    });
  southEast();
  southEast();
  southEast();
  southEast();

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe(
    "You scout one den close by to the north-west and several more close by to the south-east."
  );
});
test("Multiple dens in three different directions", () => {
  const { human, startNode } = worldFactory();
  human.setSkillLevel(SKILLS.TRACKING, 10);
  new MonsterDen({
    atLocation: expandLand(startNode, -10, -10),
    denType: "WolfDen"
  });
  const southEast = () =>
    new MonsterDen({
      atLocation: expandLand(startNode, 10, 10),
      denType: "WolfDen"
    });
  const northEast = () =>
    new MonsterDen({
      atLocation: expandLand(startNode, 10, -10, 4),
      denType: "WolfDen"
    });
  southEast();
  southEast();
  southEast();
  southEast();
  northEast();
  northEast();

  const result = MonsterDen.scanForDens(human);

  expect(result).toBe(
    "You scout one den close by to the north-west, several more close by to the south-east and a few more some distance away to the north-east."
  );
});

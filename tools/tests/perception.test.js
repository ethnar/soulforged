require("./.bootstrap");

test("Humanoid with perception 50 can see 2 tiles away", () => {
  global.world = new World();
  const human = new Human();
  const node = new Node({
    type: NODE_TYPES.PLAINS
  });
  node.addCreature(human);
  human.stats[STATS.PERCEPTION] = 50;

  expect(human.getViewRange()).toBe(2);
});

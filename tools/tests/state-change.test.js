require("./.bootstrap");

const worldFactory = () => {
  global.world = new World();
  const player = new Player();
  const human = new Human();
  player.possessCreature(human);

  const node = new Node({ type: NODE_TYPES.PLAINS });
  node.addCreature(human);

  return {
    human
  };
};

test("Going from 99 to 100 energy should trigger fully rested notification", () => {
  const { human } = worldFactory();

  human.logging = jest.fn();

  human.energy = 99;
  human.notifications();
  human.energy = 100;
  human.notifications();

  expect(human.logging).toBeCalledTimes(1);
  expect(human.logging).toBeCalledWith(
    "You are now fully rested!",
    expect.anything(),
    expect.anything(),
    expect.anything()
  );
});

test("Going from 99 -> 100 -> 95 -> 100 should trigger two fully rested notification", () => {
  const { human } = worldFactory();

  human.logging = jest.fn();

  human.energy = 99;
  human.notifications();
  human.energy = 100;
  human.notifications();

  expect(human.logging).toBeCalledWith(
    "You are now fully rested!",
    expect.anything(),
    expect.anything(),
    expect.anything()
  );

  human.energy = 95;
  human.notifications();
  human.energy = 100;
  human.notifications();

  expect(human.logging).toBeCalledTimes(2);
  expect(human.logging).toBeCalledWith(
    "You are now fully rested!",
    expect.anything(),
    expect.anything(),
    expect.anything()
  );
});

test("Going from 99 -> 100 -> 99 -> 100 should trigger only one fully rested notification", () => {
  const { human } = worldFactory();

  human.logging = jest.fn();

  human.energy = 99;
  human.notifications();
  human.energy = 100;
  human.notifications();

  expect(human.logging).toBeCalledWith(
    "You are now fully rested!",
    expect.anything(),
    expect.anything(),
    expect.anything()
  );

  human.energy = 99;
  human.notifications();
  human.energy = 100;
  human.notifications();

  expect(human.logging).toBeCalledTimes(1);
});

test("Going from 28 -> 24 -> 26 -> 24 should trigger only one very tired notification", () => {
  const { human } = worldFactory();

  human.lastChecks = {};
  human.lastChecks.isTired1 = true;
  human.lastChecks.isTired2 = true;
  human.logging = jest.fn();

  human.energy = 28;
  human.notifications();
  human.energy = 24;
  human.notifications();

  expect(human.logging).toBeCalledWith(
    "You are very tired!",
    expect.anything(),
    expect.anything(),
    expect.anything()
  );

  human.energy = 26;
  human.notifications();
  human.energy = 24;
  human.notifications();

  expect(human.logging).toBeCalledTimes(1);
});

test("Going from 99 -> 75 -> 50 -> 25 should trigger the right notifications", () => {
  const { human } = worldFactory();

  human.logging = jest.fn();

  human.energy = 99;
  human.notifications();

  human.energy = 75;
  human.notifications();

  human.energy = 50;
  human.notifications();
  expect(human.logging).lastCalledWith(
    "You are tired.",
    expect.anything(),
    expect.anything(),
    expect.anything()
  );

  human.energy = 25;
  human.notifications();
  expect(human.logging).lastCalledWith(
    "You are very tired!",
    expect.anything(),
    expect.anything(),
    expect.anything()
  );

  expect(human.logging).toBeCalledTimes(2);
});

test("Going from 100 -> 1 -> 100 -> 1 should trigger the right notifications", () => {
  const { human } = worldFactory();

  human.logging = jest.fn();

  human.energy = 100;
  human.notifications();

  human.energy = 1;
  human.notifications();
  expect(human.logging).toBeCalledTimes(3);

  human.energy = 100;
  human.notifications();

  human.energy = 1;
  human.notifications();
  expect(human.logging).toBeCalledTimes(6);
});

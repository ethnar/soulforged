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

test("Having dependency and when resistance expires causes withdrawal", () => {
  const { human } = worldFactory();

  const dependence = HealingPowderDependence.applyBuff(human);
  const withdrawalRes = HealingPowderWithdrawalRes.applyBuff(human);
  withdrawalRes.duration = 1;
  human.expireTimedBuffs(1);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderWithdrawal")).toBeTruthy();
});

test("Expiring dependency and then resistance does not cause withdrawal", () => {
  const { human } = worldFactory();

  const dependence = HealingPowderDependence.applyBuff(human);
  const withdrawalRes = HealingPowderWithdrawalRes.applyBuff(human);

  dependence.duration = 1;
  human.expireTimedBuffs(1);

  withdrawalRes.duration = 1;
  human.expireTimedBuffs(1);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderWithdrawal")).toBeFalsy();
});

test("Expiring resistance and then dependency does not cause withdrawal", () => {
  const { human } = worldFactory();

  const dependence = HealingPowderDependence.applyBuff(human);
  const withdrawalRes = HealingPowderWithdrawalRes.applyBuff(human);

  withdrawalRes.duration = 1;
  human.expireTimedBuffs(1);

  dependence.duration = 1;
  human.expireTimedBuffs(1);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderWithdrawal")).toBeFalsy();
});

test("Expiring resistance and dependency at the same time does not cause withdrawal", () => {
  const { human } = worldFactory();

  const withdrawalRes = HealingPowderWithdrawalRes.applyBuff(human);
  const dependence = HealingPowderDependence.applyBuff(human);

  withdrawalRes.duration = 1;
  dependence.duration = 1;
  human.expireTimedBuffs(1);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderWithdrawal")).toBeFalsy();

  const dependence2 = HealingPowderDependence.applyBuff(human);
  const withdrawalRes2 = HealingPowderWithdrawalRes.applyBuff(human);

  withdrawalRes2.duration = 1;
  dependence2.duration = 1;
  human.expireTimedBuffs(1);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderWithdrawal")).toBeFalsy();
});

test("Expiring higher level dependence does not remove it", () => {
  const { human } = worldFactory();

  HealingPowderDependence.applyBuff(human);
  const dependence = HealingPowderDependence.applyBuff(human);
  const withdrawalRes = HealingPowderWithdrawalRes.applyBuff(human);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderDependence")).toBeTruthy();

  dependence.duration = 1;
  human.expireTimedBuffs(1);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderWithdrawal")).toBeFalsy();
  expect(human.hasBuff("HealingPowderDependence")).toBeTruthy();

  withdrawalRes.duration = 1;
  human.expireTimedBuffs(1);

  human.recalculateBuffs();
  expect(human.hasBuff("HealingPowderWithdrawal")).toBeTruthy();
  expect(human.hasBuff("HealingPowderDependence")).toBeTruthy();
});

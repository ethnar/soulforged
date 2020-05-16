require("./.bootstrap");

const worldFactory = () => {
  global.world = new World();
  const humanAdultAxe = new Human();
  const humanKidHammer = new Human();
  const humanAdultHammer = new Human();
  const trainingDummy = new PrimitiveTrainingDummy();
  const node = new Node({ type: NODE_TYPES.PLAINS });
  node.addCreature(humanAdultAxe);
  node.addCreature(humanKidHammer);
  node.addCreature(humanAdultHammer);
  node.addCreature(trainingDummy);

  const axe = new CopperAxe();
  humanAdultAxe.addItem(axe);
  humanAdultAxe.equip(axe, EQUIPMENT_SLOTS.WEAPON);
  humanAdultAxe.debugMakeAdult();

  const hammer = new TrainingHammer();
  humanKidHammer.addItem(hammer);
  humanKidHammer.equip(hammer, EQUIPMENT_SLOTS.WEAPON);

  const hammer2 = new TrainingHammer();
  humanAdultHammer.addItem(hammer2);
  humanAdultHammer.equip(hammer2, EQUIPMENT_SLOTS.WEAPON);
  humanAdultHammer.debugMakeAdult();

  const monsterMaker = type => {
    const monster = new type();
    node.addCreature(monster);
    return monster;
  };

  return {
    humanAdultAxe,
    humanKidHammer,
    humanAdultHammer,
    trainingDummy,
    monsterMaker,
    baseExp: 300
  };
};

test("One adult hitting another grants base experience", () => {
  const { humanAdultAxe, humanAdultHammer, baseExp } = worldFactory();

  humanAdultHammer.getChanceToHit = jest.fn(() => 100);
  humanAdultHammer.cycle(1);

  humanAdultAxe.getDodgeChance = jest.fn(() => 0);
  humanAdultAxe.cycle(1);

  humanAdultHammer.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_HAMMER);
    expect(exp).toEqual(baseExp);
  });

  humanAdultHammer.attack(humanAdultAxe);
});

test("Kid hitting fully healed adult grants 5% experience", () => {
  const { humanAdultAxe, humanKidHammer, baseExp } = worldFactory();

  humanKidHammer.getChanceToHit = jest.fn(() => 100);
  humanKidHammer.cycle(1);

  humanAdultAxe.getDodgeChance = jest.fn(() => 0);
  humanAdultAxe.cycle(1);

  humanKidHammer.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_HAMMER);
    expect(exp).toEqual(baseExp / 20);
  });

  humanKidHammer.attack(humanAdultAxe);
});

test("Hitting a gloomy adult grants 5% experience", () => {
  const { humanAdultAxe, humanKidHammer, baseExp } = worldFactory();

  humanKidHammer.getChanceToHit = jest.fn(() => 100);

  humanAdultAxe.getDodgeChance = jest.fn(() => 0);
  humanAdultAxe.damageBruised(500);
  humanAdultAxe.cycle(1);
  humanAdultAxe.cycle(1);
  humanAdultAxe.cycle(1);

  humanKidHammer.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_HAMMER);
    expect(exp).toEqual(baseExp / (20 * 20));
  });

  humanKidHammer.attack(humanAdultAxe);
});

test("Being gloomy grants 5% experience", () => {
  const { humanAdultAxe, humanAdultHammer, baseExp } = worldFactory();

  humanAdultAxe.getDodgeChance = jest.fn(() => 0);

  humanAdultHammer.getChanceToHit = jest.fn(() => 100);
  humanAdultHammer.damageBruised(500);
  humanAdultHammer.cycle(1);
  humanAdultHammer.cycle(1);
  humanAdultHammer.cycle(1);
  humanAdultHammer.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_HAMMER);
    expect(exp).toEqual(baseExp / 20);
  });

  humanAdultHammer.attack(humanAdultAxe);
});

test("Hitting a kid grants 5% of regular experience", () => {
  const { humanAdultAxe, humanKidHammer, baseExp } = worldFactory();

  humanKidHammer.getChanceToHit = jest.fn(() => 100);
  humanKidHammer.cycle(1);

  humanAdultAxe.getChanceToHit = jest.fn(() => 100);
  humanAdultAxe.getDodgeChance = jest.fn(() => 0);
  humanAdultAxe.cycle(1);
  humanAdultAxe.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_AXE);
    expect(exp).toEqual(baseExp / 20);
  });

  humanAdultAxe.attack(humanKidHammer);
});

test("Hitting a training dummy grants correct amount of experience", () => {
  const { humanAdultAxe, trainingDummy } = worldFactory();

  humanAdultAxe.getChanceToHit = jest.fn(() => 100);
  humanAdultAxe.cycle(1);

  trainingDummy.getDodgeChance = jest.fn(() => 0);
  trainingDummy.cycle(1);

  humanAdultAxe.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_AXE);
    expect(exp).toEqual(125);
  });

  humanAdultAxe.attack(trainingDummy);
});

test("Hitting a troll grants correct amount of experience", () => {
  const { humanAdultAxe, monsterMaker } = worldFactory();

  const monster = monsterMaker(Troll);

  humanAdultAxe.getChanceToHit = jest.fn(() => 100);
  humanAdultAxe.cycle(1);

  monster.getDodgeChance = jest.fn(() => 0);
  monster.cycle(1);

  humanAdultAxe.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_AXE);
    expect(exp).toEqual(1500);
  });

  humanAdultAxe.attack(monster);
});

test("Hitting a wolf grants correct amount of experience", () => {
  const { humanAdultAxe, monsterMaker } = worldFactory();

  const monster = monsterMaker(Wolf);

  humanAdultAxe.getChanceToHit = jest.fn(() => 100);
  humanAdultAxe.cycle(1);

  monster.getDodgeChance = jest.fn(() => 0);
  monster.cycle(1);

  humanAdultAxe.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_AXE);
    expect(exp).toEqual(300);
  });

  humanAdultAxe.attack(monster);
});

test("Hitting a gloomy wolf grants correct amount of experience", () => {
  const { humanAdultAxe, monsterMaker } = worldFactory();

  const monster = monsterMaker(Wolf);

  humanAdultAxe.getChanceToHit = jest.fn(() => 100);
  humanAdultAxe.cycle(1);

  monster.getDodgeChance = jest.fn(() => 0);
  monster.damageBruised(500);
  monster.cycle(1);
  monster.cycle(1);
  monster.cycle(1);

  humanAdultAxe.gainSkill = jest.fn((skill, exp) => {
    expect(skill).toEqual(SKILLS.FIGHTING_AXE);
    expect(exp).toEqual(300 / 20);
  });

  humanAdultAxe.attack(monster);
});

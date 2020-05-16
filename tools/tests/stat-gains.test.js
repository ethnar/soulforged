require("./.bootstrap");

const worldFactory = () => {
  global.world = new World();
  const humanAdultAxe = new Human();
  const humanAdultAxe2 = new Human();
  const humanKidAxe = new Human();
  const node = new Node({ type: NODE_TYPES.PLAINS });
  node.addCreature(humanAdultAxe);
  node.addCreature(humanAdultAxe2);
  node.addCreature(humanKidAxe);

  const axe = new CopperAxe();
  humanAdultAxe.addItem(axe);
  humanAdultAxe.equip(axe, EQUIPMENT_SLOTS.WEAPON);
  humanAdultAxe.debugMakeAdult();

  const axe2 = new CopperAxe();
  humanAdultAxe2.addItem(axe2);
  humanAdultAxe2.equip(axe2, EQUIPMENT_SLOTS.WEAPON);
  humanAdultAxe2.debugMakeAdult();

  const axe3 = new CopperAxe();
  humanKidAxe.addItem(axe3);
  humanKidAxe.equip(axe3, EQUIPMENT_SLOTS.WEAPON);

  return {
    humanKidAxe,
    humanAdultAxe,
    humanAdultAxe2,
    baseExp: 300,
    baseGain: 0.022222222222222
  };
};

test("Validate stat gains when using weapons", () => {
  expect.assertions(2);

  const { humanAdultAxe, humanAdultAxe2 } = worldFactory();

  Object.keys(humanAdultAxe.stats).forEach(
    stat => (humanAdultAxe.stats[stat] = 10)
  );

  humanAdultAxe.getChanceToHit = jest.fn(() => 100);
  humanAdultAxe.cycle(1);

  humanAdultAxe2.getDodgeChance = jest.fn(() => 0);
  humanAdultAxe2.cycle(1);

  humanAdultAxe.setStatValue = jest.fn((stat, value) => {
    switch (stat) {
      case STATS.PERCEPTION:
      case STATS.ENDURANCE:
      case STATS.DEXTERITY:
        expect(value).toEqual(10 + 0.005555055648149);
        break;
      default:
        throw new Error(`Invalid stat updated: ${STAT_NAMES[stat]}`);
    }
  });

  humanAdultAxe.attack(humanAdultAxe2);
});

test("Validate gains at stat of 10 for a skill spread across 3 stats", () => {
  expect.assertions(3);

  const { humanAdultAxe, baseExp, baseGain } = worldFactory();

  Object.keys(humanAdultAxe.stats).forEach(
    stat => (humanAdultAxe.stats[stat] = 10)
  );

  humanAdultAxe.setStatValue = jest.fn((stat, value) => {
    switch (stat) {
      case STATS.PERCEPTION:
      case STATS.ENDURANCE:
      case STATS.DEXTERITY:
        expect(value).toEqual(10 + baseGain / 3);
        break;
      default:
        throw new Error(`Invalid stat updated: ${STAT_NAMES[stat]}`);
    }
  });

  humanAdultAxe.gainSkill(SKILLS.PATHFINDING, baseExp);
  humanAdultAxe.gainStatsFromSkill(SKILLS.PATHFINDING, baseExp);
});

test("Validate gains at stat of 10 for a skill linked to just 1 stat", () => {
  expect.assertions(1);

  const { humanAdultAxe, baseExp, baseGain } = worldFactory();

  Object.keys(humanAdultAxe.stats).forEach(
    stat => (humanAdultAxe.stats[stat] = 10)
  );

  humanAdultAxe.setStatValue = jest.fn((stat, value) => {
    switch (stat) {
      case STATS.INTELLIGENCE:
        expect(value).toEqual(10 + baseGain);
        break;
      default:
        throw new Error(`Invalid stat updated: ${STAT_NAMES[stat]}`);
    }
  });

  humanAdultAxe.gainSkill(SKILLS.COOKING, baseExp);
  humanAdultAxe.gainStatsFromSkill(SKILLS.COOKING, baseExp);
});

test("Validate gains at stat of 90 for a skill linked to just 1 stat", () => {
  expect.assertions(1);

  const { humanAdultAxe, baseExp } = worldFactory();

  Object.keys(humanAdultAxe.stats).forEach(
    stat => (humanAdultAxe.stats[stat] = 90)
  );

  humanAdultAxe.setStatValue = jest.fn((stat, value) => {
    switch (stat) {
      case STATS.INTELLIGENCE:
        expect(value).toEqual(90 + 0.0060606060606);
        break;
      default:
        throw new Error(`Invalid stat updated: ${STAT_NAMES[stat]}`);
    }
  });

  humanAdultAxe.gainSkill(SKILLS.COOKING, baseExp);
  humanAdultAxe.gainStatsFromSkill(SKILLS.COOKING, baseExp);
});

test("Validate gains at stat of 110 for a skill linked to just 1 stat", () => {
  expect.assertions(1);

  const { humanAdultAxe, baseExp } = worldFactory();

  Object.keys(humanAdultAxe.stats).forEach(
    stat => (humanAdultAxe.stats[stat] = 110)
  );

  humanAdultAxe.setStatValue = jest.fn((stat, value) => {
    switch (stat) {
      case STATS.INTELLIGENCE:
        expect(value).toEqual(110 + 0.0051282051282);
        break;
      default:
        throw new Error(`Invalid stat updated: ${STAT_NAMES[stat]}`);
    }
  });

  humanAdultAxe.gainSkill(SKILLS.COOKING, baseExp);
  humanAdultAxe.gainStatsFromSkill(SKILLS.COOKING, baseExp);
});

test("Validate gains spanning the entire lifetime for single stat", () => {
  const { humanKidAxe } = worldFactory();

  const expMultiplier = 2;

  for (let i = 0; i < 150; i++) {
    for (let i = 0; i < 12 * 4; i++) {
      humanKidAxe.gainSkill(SKILLS.COOKING, expMultiplier * 15 * MINUTES);
      humanKidAxe.gainStatsFromSkill(SKILLS.COOKING, 15 * MINUTES);
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 12.160420039410454,
    [STATS.DEXTERITY]: 7.319014174738847,
    [STATS.ENDURANCE]: 0,
    [STATS.PERCEPTION]: 7.319014174738847,
    [STATS.INTELLIGENCE]: 138.96944547283502
  });
});

test("Validate gains spanning the entire lifetime for three stats", () => {
  const { humanKidAxe } = worldFactory();

  const expMultiplier = 2;

  for (let i = 0; i < 120; i++) {
    for (let i = 0; i < 12 * 4; i++) {
      humanKidAxe.gainSkill(SKILLS.PATHFINDING, expMultiplier * 15 * MINUTES);
      humanKidAxe.gainStatsFromSkill(SKILLS.PATHFINDING, 15 * MINUTES);
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 38.83584971048526,
    [STATS.DEXTERITY]: 78.75250286492329,
    [STATS.ENDURANCE]: 78.55365414207483,
    [STATS.PERCEPTION]: 78.75250286492329,
    [STATS.INTELLIGENCE]: 38.83584971048526
  });

  for (let i = 0; i < 30; i++) {
    for (let i = 0; i < 12 * 4; i++) {
      humanKidAxe.gainSkill(SKILLS.PATHFINDING, expMultiplier * 15 * MINUTES);
      humanKidAxe.gainStatsFromSkill(SKILLS.PATHFINDING, 15 * MINUTES);
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 12.160420039410454,
    [STATS.DEXTERITY]: 55.465741857108725,
    [STATS.ENDURANCE]: 46.28609771003577,
    [STATS.PERCEPTION]: 55.465741857108725,
    [STATS.INTELLIGENCE]: 36.399037195003416
  });
});

test("Weak diet", () => {
  const { humanKidAxe } = worldFactory();

  const food = new CookedToughMeat();
  humanKidAxe.satiated = food.nutrition;
  humanKidAxe.applyFoodBuff(food);
  humanKidAxe.recalculateBuffs();

  for (let i = 0; i < 120; i++) {
    for (let i = 0; i < 24 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 78.71141748757407,
    [STATS.DEXTERITY]: 30.167289065134213,
    [STATS.ENDURANCE]: 54.33946497691471,
    [STATS.PERCEPTION]: 30.167289065134213,
    [STATS.INTELLIGENCE]: 30.167289065134213
  });

  for (let i = 0; i < 30; i++) {
    for (let i = 0; i < 24 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 60.22159153696583,
    [STATS.DEXTERITY]: 0,
    [STATS.ENDURANCE]: 17.4301139242884,
    [STATS.PERCEPTION]: 0,
    [STATS.INTELLIGENCE]: 26.500279437048107
  });
});

test("Balanced diet", () => {
  const { humanKidAxe } = worldFactory();

  humanKidAxe.satiated = 10;
  humanKidAxe.applyFoodBuff({
    getName: () => "test",
    constructor: {},
    nutrition: 10,
    buffs: {
      [BUFFS.STATS_GAINS.STRENGTH]: 3 / 5,
      [BUFFS.STATS_GAINS.DEXTERITY]: 3 / 5,
      [BUFFS.STATS_GAINS.ENDURANCE]: 3 / 5,
      [BUFFS.STATS_GAINS.PERCEPTION]: 3 / 5,
      [BUFFS.STATS_GAINS.INTELLIGENCE]: 3 / 5
    }
  });
  humanKidAxe.recalculateBuffs();

  for (let i = 0; i < 120; i++) {
    for (let i = 0; i < 24 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 44.73052759186581,
    [STATS.DEXTERITY]: 44.73052759186581,
    [STATS.ENDURANCE]: 44.630639292427134,
    [STATS.PERCEPTION]: 44.73052759186581,
    [STATS.INTELLIGENCE]: 44.73052759186581
  });

  for (let i = 0; i < 30; i++) {
    for (let i = 0; i < 24 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 20.16058758312287,
    [STATS.DEXTERITY]: 15.471170744680954,
    [STATS.ENDURANCE]: 5.984112794619435,
    [STATS.PERCEPTION]: 15.471170744680954,
    [STATS.INTELLIGENCE]: 43.66928113155174
  });
});

test("Awesome diet", () => {
  const { humanKidAxe } = worldFactory();

  const food = new PastaAndMeatballs();
  humanKidAxe.satiated = food.nutrition;
  humanKidAxe.applyFoodBuff(food);
  humanKidAxe.recalculateBuffs();

  for (let i = 0; i < 120; i++) {
    for (let i = 0; i < 24 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 224.34380275489218,
    [STATS.DEXTERITY]: 30.167289065134213,
    [STATS.ENDURANCE]: 127.15565761057366,
    [STATS.PERCEPTION]: 30.167289065134213,
    [STATS.INTELLIGENCE]: 30.167289065134213
  });

  for (let i = 0; i < 30; i++) {
    for (let i = 0; i < 24 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 231.91160848200417,
    [STATS.DEXTERITY]: 0,
    [STATS.ENDURANCE]: 103.27512239680746,
    [STATS.PERCEPTION]: 0,
    [STATS.INTELLIGENCE]: 26.500279437048107
  });
});

test("Diet and using skills", () => {
  const { humanKidAxe } = worldFactory();

  const food = new MushroomSoup();
  humanKidAxe.satiated = food.nutrition;
  humanKidAxe.applyFoodBuff(food);
  humanKidAxe.recalculateBuffs();

  const expMultiplier = 2;

  for (let i = 0; i < 120; i++) {
    for (let i = 0; i < 12 * 4; i++) {
      humanKidAxe.gainSkill(SKILLS.PATHFINDING, expMultiplier * 15 * MINUTES);
      humanKidAxe.gainStatsFromSkill(SKILLS.PATHFINDING, 15 * MINUTES);
      humanKidAxe.updateStats(15 * MINUTES);
    }
    for (let i = 0; i < 12 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 30.167289065134213,
    [STATS.DEXTERITY]: 196.9074372838154,
    [STATS.ENDURANCE]: 67.39672719285907,
    [STATS.PERCEPTION]: 67.57097245267659,
    [STATS.INTELLIGENCE]: 102.98348169879358
  });

  for (let i = 0; i < 30; i++) {
    for (let i = 0; i < 12 * 4; i++) {
      humanKidAxe.gainSkill(SKILLS.PATHFINDING, expMultiplier * 15 * MINUTES);
      humanKidAxe.gainStatsFromSkill(SKILLS.PATHFINDING, 15 * MINUTES);
      humanKidAxe.updateStats(15 * MINUTES);
    }
    for (let i = 0; i < 12 * 4; i++) {
      humanKidAxe.updateStats(15 * MINUTES);
    }
    humanKidAxe.progressAging();
  }

  expect(humanKidAxe.stats).toEqual({
    [STATS.STRENGTH]: 2.991585888619216,
    [STATS.DEXTERITY]: 192.71695025799508,
    [STATS.ENDURANCE]: 34.603451962507954,
    [STATS.PERCEPTION]: 43.241460576837895,
    [STATS.INTELLIGENCE]: 112.34528790956762
  });
});

function testStat(value, expected) {
  test(`Stat efficiency bonuses for value: ${value}`, () => {
    const { humanKidAxe } = worldFactory();

    humanKidAxe.stats[STATS.INTELLIGENCE] = value;
    expect(humanKidAxe.getStatPercentageEfficiency(STATS.INTELLIGENCE)).toEqual(
      expected
    );
  });
}

function testStatEfficiency(value, expected) {
  test(`Stat efficiency bonuses for value: ${value}`, () => {
    const { humanKidAxe } = worldFactory();

    humanKidAxe.stats[STATS.INTELLIGENCE] = value;
    expect(humanKidAxe.getSkillEfficiencyMultiplier(SKILLS.COOKING)).toEqual(
      expected
    );
  });
}

// OLD
// testStat(0, 71);
// testStat(5, 71);
// testStat(50, 100);
// testStat(100, 235);
// testStat(150, 523);
// testStat(200, 999);

// NEW
testStat(0, 37);
testStat(5, 39);
testStat(50, 100);
testStat(100, 214);
testStat(150, 362);
testStat(200, 537);

testStatEfficiency(0, 0.1);
testStatEfficiency(5, 0.19);
testStatEfficiency(50, 1);
testStatEfficiency(100, 1.9);
testStatEfficiency(150, 2.8);
testStatEfficiency(200, 3.7);

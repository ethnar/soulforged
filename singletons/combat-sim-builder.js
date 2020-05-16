const World = require("../class/world");
const Path = require("../class/connections/path");
const Region = require("../class/region");

const Node = require("../class/nodes/node");

const Player = require("../class/player");
const Dwarf = require("../class/creatures/humanoids/dwarf");

const Menhir = require("../class/structures/menhir");

const Jimp = require("jimp");
const fs = require("fs");

utils.recursiveRequire("./class/creatures/monsters");

const NPCS = [
  // require('../class/creatures/monsters/npc/brokk')
];

let world;
let pcIdx = 0;

const n = (x, y, n = NODE_TYPES.PLAINS) => {
  const node = new Node({
    type: n,
    x,
    y,
    zLevel: 0
  });
  node.increaseTraverseFrequency = () => {};
  return node;
};

function createPc(race, items, weaponSkills = 0, adult = true) {
  const c = new race();
  c.setSkillLevel(SKILLS.TRACKING, 10);

  if (adult) {
    const adulthoodAge = +Object.keys(race.prototype.agingTiers)[1] + 1;
    for (let i = 0; i < adulthoodAge; i += 1) {
      c.progressAging();
    }
  }

  items.forEach(i => {
    const instance = new i();
    c.addItem(instance);
    let itemSlot = Object.keys(i.prototype.slots).pop();
    if (itemSlot === "932") itemSlot = "12";
    if (itemSlot === "12") {
      c.looks = null;
      c.avatarIcon = instance.icon;
    }
    c.equip(instance, itemSlot);
  });

  if (weaponSkills) {
    const BASE_SKILL = 3 * DAYS;
    const skill = BASE_SKILL * (Math.pow(2, weaponSkills) - 1);
    Object.values(SKILLS).forEach(s => (c.skills[s] = skill));
  }

  setTimeout(() => {
    pcIdx += 1;
    c.name = "PC" + pcIdx + " " + Object.values(c.getArmorValue()).join("/");
  }, 2000);

  return c;
}

const SPACING = 50;
let startNode;

const WorldBuilder = {
  buildNewWorld() {
    global.world = world = new World();

    startNode = n(0, 0);

    this.setupFightingArena();
    this.setupDedicatedWeaponsArena();
    this.setupAccidentArena();
    // this.setupMiscArena();

    utils.log("World done");

    const urist = new Human({
      name: "Urist",
      looks: {
        hairStyle: 1,
        hairColor: 1,
        skinColor: 1
      }
    });

    urist.setSkillLevel(SKILLS.TRACKING, 10);
    startNode.addCreature(urist);

    const player = new Player({
      name: "Watcher"
    });
    player.acceptedLegalTerms = true;
    player.profileId = "109066226902474935460";
    player.possessCreature(urist);
    urist.isOnMainland = true;
    player.email = ADMIN_EMAIL;

    return world;
  },

  setupFightingArena() {
    const playerSetups = [
      () => createPc(Human, []),
      () =>
        createPc(Human, [
          WolfHideVest,
          WolfSnakeTrousers,
          DeerLeatherCap,
          DeerHideBoots
        ]),
      () =>
        createPc(Human, [
          ArmorSetsLeather1_Chest,
          ArmorSetsLeather1_Feet,
          ArmorSetsLeather1_Hands,
          ArmorSetsLeather1_Head,
          ArmorSetsLeather1_Trousers
        ]),
      () =>
        createPc(Human, [
          ArmorSetsMetal1_Chest,
          ArmorSetsMetal1_Feet,
          ArmorSetsMetal1_Hands,
          ArmorSetsMetal1_Head,
          ArmorSetsMetal1_Trousers
        ]),
      () => createPc(Human, [StoneHammer]),
      () => createPc(Human, [StoneHatchet]),
      () => createPc(Human, [StoneKnife]),
      () => createPc(Human, [StoneSpear]),
      () => createPc(Human, [BoneClub]),
      () =>
        createPc(Human, [
          BoneClub,
          WolfHideVest,
          WolfSnakeTrousers,
          DeerLeatherCap,
          DeerHideBoots
        ]),
      () =>
        createPc(Human, [
          BoneClub,
          ArmorSetsLeather1_Chest,
          ArmorSetsLeather1_Feet,
          ArmorSetsLeather1_Hands,
          ArmorSetsLeather1_Head,
          ArmorSetsLeather1_Trousers
        ]),
      () =>
        createPc(Human, [
          BronzeHammer,
          ArmorSetsMetal1_Chest,
          ArmorSetsMetal1_Feet,
          ArmorSetsMetal1_Hands,
          ArmorSetsMetal1_Head,
          ArmorSetsMetal1_Trousers
        ]),
      () =>
        createPc(Human, [
          BronzeAxe,
          ArmorSetsMetal1_Chest,
          ArmorSetsMetal1_Feet,
          ArmorSetsMetal1_Hands,
          ArmorSetsMetal1_Head,
          ArmorSetsMetal1_Trousers
        ]),
      () =>
        createPc(Human, [
          BronzeKnife,
          ArmorSetsMetal1_Chest,
          ArmorSetsMetal1_Feet,
          ArmorSetsMetal1_Hands,
          ArmorSetsMetal1_Head,
          ArmorSetsMetal1_Trousers
        ]),
      () =>
        createPc(Human, [
          BronzeSpear,
          ArmorSetsMetal1_Chest,
          ArmorSetsMetal1_Feet,
          ArmorSetsMetal1_Hands,
          ArmorSetsMetal1_Head,
          ArmorSetsMetal1_Trousers
        ]),
      ...[
        Axe211,
        Axe332,
        Axe735,
        Axe249,
        Hammer31,
        Hammer214,
        Knife467,
        Knife883,
        BoneClub,
        Mace521,
        Mace252,
        Mace442,
        Spear91,
        Spear727,
        Sword335,
        Sword839,
        Sword840,
        Sword420,
        Sword638
      ].map(weapon => () =>
        createPc(
          Human,
          [
            weapon,
            ArmorSetsMetal3_Chest,
            ArmorSetsMetal3_Feet,
            ArmorSetsMetal3_Hands,
            ArmorSetsMetal3_Head,
            ArmorSetsMetal3_Trousers
          ],
          1
        )
      ),
      () =>
        createPc(
          Human,
          [
            SteelSpear,
            ArmorSetsMetal5_Chest,
            ArmorSetsMetal5_Feet,
            ArmorSetsMetal5_Hands,
            ArmorSetsMetal5_Head,
            ArmorSetsMetal5_Trousers
          ],
          10
        ),
      () =>
        createPc(
          Human,
          [
            Sword420,
            ArmorSetsMetal5_Chest,
            ArmorSetsMetal5_Feet,
            ArmorSetsMetal5_Hands,
            ArmorSetsMetal5_Head,
            ArmorSetsMetal5_Trousers
          ],
          10
        ),
      () =>
        createPc(
          Human,
          [
            Hammer214,
            ArmorSetsMetal5_Chest,
            ArmorSetsMetal5_Feet,
            ArmorSetsMetal5_Hands,
            ArmorSetsMetal5_Head,
            ArmorSetsMetal5_Trousers
          ],
          10
        ),
      () => [
        createPc(
          Human,
          [
            Sword420,
            ArmorSetsMetal5_Chest,
            ArmorSetsMetal5_Feet,
            ArmorSetsMetal5_Hands,
            ArmorSetsMetal5_Head,
            ArmorSetsMetal5_Trousers
          ],
          10
        ),
        createPc(
          Human,
          [
            Hammer214,
            ArmorSetsMetal5_Chest,
            ArmorSetsMetal5_Feet,
            ArmorSetsMetal5_Hands,
            ArmorSetsMetal5_Head,
            ArmorSetsMetal5_Trousers
          ],
          10
        )
      ]
    ];
    const enemies = utils
      .getClasses(Monster)
      .filter(m => m.name[0] !== "?")
      .sort((a, b) => a.threatLevel - b.threatLevel)
      .map(m => () => new m.constructor());

    playerSetups.forEach((playerSetup, idx1) => {
      enemies.forEach((enemy, idx2) => {
        const node = n((idx2 + 1) * SPACING, (idx1 + 1) * SPACING);
        new Path({}, node, startNode);

        let pcs = playerSetup();
        if (!Array.isArray(pcs)) {
          pcs = [pcs];
        }
        const mc = enemy();
        mc.seenByPlayer = true;
        node.addCreature(mc);

        pcs.forEach(pc => {
          node.addCreature(pc);
          pc.startAction(pc, pc.getActionById("Fight"));
        });
      });
    });
  },

  setupDedicatedWeaponsArena() {
    const armor = [
      ArmorSetsMetal1_Chest,
      ArmorSetsMetal1_Feet,
      ArmorSetsMetal1_Hands,
      ArmorSetsMetal1_Head,
      ArmorSetsMetal1_Trousers
    ];
    // const armor = [];
    const baseWeapon = Array.from(Array(11).keys()).map(skill => () =>
      createPc(Human, [...armor, CopperSpear], skill)
    );
    const specializedWeapon = Array.from(Array(11).keys()).map(skill => () =>
      createPc(Human, [...armor, Spear727], skill)
    );

    baseWeapon.forEach((playerSetup1, idx1) => {
      specializedWeapon.forEach((playerSetup2, idx2) => {
        const node = n((-idx2 - 1) * SPACING, (idx1 + 1) * SPACING);
        new Path({}, node, startNode);

        let pc = playerSetup1();
        const mc = playerSetup2();

        mc.faction = "Hostiles";

        node.addCreature(mc);
        node.addCreature(pc);

        setTimeout(() => {
          pc.startAction(pc, pc.getActionById("Fight"));
          mc.startAction(mc, mc.getActionById("Fight"));
        });
      });
    });
  },

  setupAccidentArena() {
    const sampleSize = 20;

    const playerSetups = [
      () => createPc(Human, [], 0),
      () => createPc(Human, [], 0, false)
    ];

    const nodesTypes = [
      NODE_TYPES.PLAINS, // 0
      NODE_TYPES.BROADLEAF_FOREST, // 1
      // NODE_TYPES.UNDERGROUND_FLOOR, // 1
      NODE_TYPES.HILLS_GRASS, // 2
      // NODE_TYPES.UNDERGROUND_CAVE, // 2
      NODE_TYPES.BOG, // 3
      NODE_TYPES.SWAMP, // 4
      NODE_TYPES.MOUNTAINS_COLD, // 5
      NODE_TYPES.MOUNTAINS_SNOW // 6
    ];

    playerSetups.forEach((playerSetup, idx1) => {
      nodesTypes.forEach((nodeType, idx2) => {
        const node = n((idx2 + 1) * SPACING, -(idx1 + 1) * SPACING, nodeType);
        new Path({}, node, startNode);

        for (let i = 0; i < sampleSize; i += 1) {
          const pc = playerSetup();
          startNode.addCreature(pc);
          pc.startAction(node, node.getActionById("Travel"));
        }
      });
    });
  },

  setupMiscArena() {
    const numbers = [5, 10, 15, 20, 50, 100];
    const armor = [
      ArmorSetsMetal1_Chest,
      ArmorSetsMetal1_Feet,
      ArmorSetsMetal1_Hands,
      ArmorSetsMetal1_Head,
      ArmorSetsMetal1_Trousers
    ];

    const mods = [
      c => c,
      c => c.progressAging(),
      c => {
        c.progressAging();
        c.progressAging();
      },
      c => (c.buffs = [])
    ];

    numbers.forEach((numbers, idx) => {
      mods.forEach((mod, idx2) => {
        const node = n((-idx - 1) * SPACING, (-1 - idx2) * SPACING);
        new Path({}, node, startNode);

        let pc = createPc(Human, [...armor, Mace521], 5);

        pc.faction = "Boss";
        node.addCreature(pc);

        for (let i = 0; i < numbers; i++) {
          const mc = createPc(Human, [BoneClub], 0, false);
          node.addCreature(mc);
          mod(mc);
          setTimeout(() => {
            mc.startAction(mc, mc.getActionById("Fight"));
          });
        }

        setTimeout(() => {
          pc.startAction(pc, pc.getActionById("Fight"));
        });
      });
    });
  }
};
module.exports = WorldBuilder;

const singleRoom = () => ({
  type: NODE_TYPES.ROOM_DEN,
  roomClass: "Tier1_Hallway"
});

global.MONSTER_DEN_TYPES = {
  WolfDen: {
    getLayout: singleRoom,
    guardians: {
      Direwolf: [3, 6],
      Wolf: [0, 4]
    },
    trackingDifficulty: 2,
    spawnDelay: 10 * DAYS,
    denDuration: 35 * DAYS,
    roamingSpawns: () => ({
      Direwolf: [1, 3]
    }),
    placement: () => Direwolf.prototype.placement
  },
  DesertSpider: {
    getLayout: singleRoom,
    guardians: {
      DesertSpider: [4, 10]
    },
    trackingDifficulty: 4,
    spawnDelay: 14 * DAYS,
    denDuration: 40 * DAYS,
    roamingSpawns: () => ({
      DesertSpider: [1, 2]
    }),
    placement: () => DesertSpider.prototype.placement
  },
  Lion: {
    getLayout: singleRoom,
    guardians: {
      Lion: [4, 5]
    },
    trackingDifficulty: 2,
    spawnDelay: 12 * DAYS,
    denDuration: 40 * DAYS,
    roamingSpawns: () => ({
      Lion: [0, 2]
    }),
    placement: () => Lion.prototype.placement
  },
  Screech: {
    getLayout: singleRoom,
    guardians: {
      Screech: [2]
    },
    trackingDifficulty: 3,
    spawnDelay: 15 * DAYS,
    denDuration: 40 * DAYS,
    roamingSpawns: () => ({
      Screech: [1]
    }),
    placement: () => Screech.prototype.placement
  },
  Bear: {
    getLayout: singleRoom,
    guardians: {
      Bear: [4, 6]
    },
    trackingDifficulty: 4,
    spawnDelay: 10 * DAYS,
    denDuration: 30 * DAYS,
    roamingSpawns: () => ({
      Bear: [1]
    }),
    placement: () => Bear.prototype.placement
  },
  Lurker: {
    getLayout: singleRoom,
    guardians: {
      Lurker: [1]
    },
    trackingDifficulty: 5,
    spawnDelay: 14 * DAYS,
    denDuration: 50 * DAYS,
    roamingSpawns: () => ({
      Lurker: [1]
    }),
    placement: () => Lurker.prototype.placement
  },
  Muckworm: {
    getLayout: singleRoom,
    guardians: {
      Muckworm: [5, 14]
    },
    trackingDifficulty: 1,
    spawnDelay: 8 * DAYS,
    denDuration: 25 * DAYS,
    roamingSpawns: () => ({
      Muckworm: [2, 4]
    }),
    placement: () => Muckworm.prototype.placement
  },
  FireDrake: {
    getLayout: singleRoom,
    guardians: {
      FireDrake: [4, 6]
    },
    trackingDifficulty: 2,
    spawnDelay: 15 * DAYS,
    denDuration: 50 * DAYS,
    roamingSpawns: () => ({
      FireDrake: [1]
    }),
    placement: () => FireDrake.prototype.placement
  },
  Troll: {
    getLayout: singleRoom,
    guardians: {
      Troll: [1]
    },
    trackingDifficulty: 6,
    spawnDelay: 15 * DAYS,
    denDuration: 40 * DAYS,
    roamingSpawns: () =>
      utils.chance(5)
        ? {
            Troll: [1]
          }
        : {},
    placement: () => Troll.prototype.placement
  },
  StoneGolem: {
    getLayout: singleRoom,
    guardians: {
      StoneGolem: [1]
    },
    trackingDifficulty: 8,
    spawnDelay: 15 * DAYS,
    denDuration: 60 * DAYS,
    roamingSpawns: () =>
      utils.chance(40)
        ? {
            StoneGolem: [1]
          }
        : {},
    placement: () => StoneGolem.prototype.placement
  },
  Plaguebeast: {
    getLayout: singleRoom,
    guardians: {
      Plaguebeast: [1, 2]
    },
    trackingDifficulty: 5,
    spawnDelay: 15 * DAYS,
    denDuration: 50 * DAYS,
    roamingSpawns: () =>
      utils.chance(15)
        ? {
            Plaguebeast: [1]
          }
        : {},
    placement: () => Plaguebeast.prototype.placement
  },
  Nightcrawler: {
    getLayout: singleRoom,
    guardians: {
      Nightcrawler: [1]
    },
    trackingDifficulty: 7,
    spawnDelay: 20 * DAYS,
    denDuration: 70 * DAYS,
    roamingSpawns: () =>
      utils.chance(8)
        ? {
            Nightcrawler: [1]
          }
        : {},
    placement: () => Nightcrawler.prototype.placement
  }
};

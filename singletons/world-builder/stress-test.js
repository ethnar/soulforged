const server = require("../server");

const TOTAL_TOWNS = 3;
const TOTAL_PLAYERS = 1000;
const CONNECTED_PLAYERS = 20;

module.exports = {
  upgrade(world) {
    const plains = world
      .getNodes()
      .filter(n => n.getType() === NODE_TYPES.PLAINS);

    const townNodes = [];

    for (let i = 0; i < TOTAL_TOWNS; i++) {
      const nextTown = plains.find(
        n => !townNodes.includes(n) && !townNodes.some(tn => n.hasPath(tn))
      );

      console.log("Creating town", i + 1, "node", nextTown.getEntityId());

      townNodes.push(nextTown);

      for (let j = 0; j < TOTAL_PLAYERS / TOTAL_TOWNS; j++) {
        const h = new Human({
          name: Math.random(),
          looks: {
            hairStyle: 1,
            hairColor: 1,
            skinColor: 1
          }
        });
        nextTown.addCreature(h);
        const player = new Player({
          name: h.name
        });
        player.possessCreature(h);

        // give them some items
        Object.keys(global)
          .filter(name => global[name].prototype instanceof Item)
          .filter(name => global[name].prototype.name[0] !== "?")
          .filter(() => Math.random() > 0.5)
          .forEach(i => h.addItem(new global[i]({ qty: 10 })));

        // add some buffs/debuffs
        for (let j = 0; j < 60; j++) {
          h.damageBruised(2);
          h.damageCut(2);
        }
      }
    }

    // simulate connections
    Player.list.slice(0, CONNECTED_PLAYERS).forEach(p => {
      const connection = {
        sendText: () => {}
      };
      server.connections.push(connection);
      server.setPlayer(connection, p);
    });

    console.log("*** World is set up ***");

    return world;
  }
};

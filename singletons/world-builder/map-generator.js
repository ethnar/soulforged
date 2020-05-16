const X_SIZE = 60;
const Y_SIZE = 60;
const NODE_SIZE = 80;

module.exports = {
  generateMap() {
    let nodes = [];
    const nodesConnections = {};
    const nodeTypes = {
      PLAINS: {},
      HILLS: {},
      BROADLEAF_FOREST: {},
      ROCKS: {},
      WATER: {}
    };
    const nodesById = {};

    function connect(id, id2) {
      nodesConnections[id] = nodesConnections[id] || {};
      nodesConnections[id][id2] = true;
      nodesConnections[id2] = nodesConnections[id2] || {};
      nodesConnections[id2][id] = true;
    }

    function spreadTerrainType(times, types, spreading, chance = 0.2) {
      if (!spreading) {
        spreading = types;
      }
      for (let i = 0; i < times; i += 1) {
        const water = nodes.filter(r => types[r.id]);

        water.forEach(w => {
          Object.keys(nodesConnections[w.id]).forEach(c => {
            if (!spreading[c] && Math.random() <= chance) {
              spreading[c] = true;
            }
          });
        });
      }
    }

    function generateDots(
      seedsCount,
      types,
      invalidStarting = id => nodeTypes.WATER[id] || types[id]
    ) {
      for (let i = 0; i < seedsCount; i += 1) {
        let start;

        const validStarts = nodes.filter(r => !invalidStarting(r.id));
        if (!validStarts.length) {
          return;
        }
        start = utils.randomItem(validStarts).id;

        types[start] = true;
      }
    }

    function generateContinuousLines(
      seedsCount,
      types,
      length = 1,
      invalidStarting = id => nodeTypes.WATER[id] || types[id]
    ) {
      for (let i = 0; i < seedsCount; i += 1) {
        let start;

        const validStarts = nodes.filter(r => !invalidStarting(r.id));
        if (!validStarts.length) {
          return;
        }
        start = utils.randomItem(validStarts).id;
        const startX = nodesById[start].x;
        const startY = nodesById[start].y;

        types[start] = true;

        let current = start;
        let distance = 2;
        for (let j = 0; j < (15 + 6 * i) * length; j += 1) {
          const options = Object.keys(nodesConnections[current]).filter(
            rId => !nodeTypes.WATER[rId] && !types[rId]
          );
          const bestOptions = options
            .filter(
              rId =>
                Object.keys(nodesConnections[rId]).filter(
                  second => types[second]
                ).length <= 1
            )
            .filter(
              rId =>
                Math.abs(nodesById[rId].x - startX) +
                  Math.abs(nodesById[rId].y - startY) >=
                distance
            );

          if (bestOptions.length) {
            current =
              bestOptions[Math.floor(Math.random() * bestOptions.length)];
            types[current] = true;
            distance = Math.max(
              distance,
              Math.abs(nodesById[current].x - startX) +
                Math.abs(nodesById[current].y - startY) -
                1
            );
          }
        }
      }
    }

    function fillTerrain(types) {
      nodes.forEach(r => {
        if (!Object.values(nodeTypes).some(types => types[r.id])) {
          types[r.id] = true;
        }
      });
    }

    const nodeMap = {};

    // create empty map
    let ids = 0;
    for (let x = 0; x < X_SIZE; x += 1) {
      nodeMap[x] = [];
      for (let y = 0; y < Y_SIZE; y += 1) {
        ids += 1;
        nodeMap[x][y] = {
          id: ids,
          type: null,
          x,
          y
        };
        nodes.push(nodeMap[x][y]);
        nodesById[ids] = nodeMap[x][y];
        if (x === 0 || y === 0 || x === X_SIZE - 1 || y === Y_SIZE - 1) {
          nodeTypes.WATER[ids] = true;
        }

        if (x > 0) {
          connect(ids, nodeMap[x - 1][y].id);
          if (y % 2 === 1) {
            connect(ids, nodeMap[x - 1][y - 1].id);
            if (y + 1 < Y_SIZE) {
              connect(ids, nodeMap[x - 1][y + 1].id);
            }
          }
        }
        if (y > 0) {
          connect(ids, nodeMap[x][y - 1].id);
        }
      }
    }

    const X_NODES = X_SIZE / NODE_SIZE;
    const Y_NODES = Y_SIZE / NODE_SIZE;

    // generateContinuousLines(1, nodeTypes.ROCKS, 10);

    utils.log("Defining nodes ...");
    // spread edge water
    spreadTerrainType(10, nodeTypes.WATER);

    utils.log("Defining nodes (mountains) ...");
    // mountain ranges
    generateContinuousLines(Math.sqrt(ids) / 8, nodeTypes.ROCKS, 1);
    spreadTerrainType(1, nodeTypes.ROCKS);

    utils.log("Defining nodes (rivers) ...");
    // spread edge & river water
    // rivers
    generateContinuousLines(
      Math.sqrt(ids) / 30,
      nodeTypes.WATER,
      1,
      id => !nodeTypes.WATER[id]
    );

    utils.log("Defining nodes (lakes) ...");
    // lakes
    generateContinuousLines(Math.sqrt(ids) / 30, nodeTypes.WATER, 2);

    generateContinuousLines(Math.sqrt(ids) / 20, nodeTypes.WATER, 0.5);
    spreadTerrainType(4, nodeTypes.WATER);

    utils.log("Defining nodes (hills) ...");
    // hills
    spreadTerrainType(1, nodeTypes.ROCKS, nodeTypes.HILLS, 0.8);
    // generateContinuousLines(Math.sqrt(ids) / 5, nodeTypes.HILLS, 0.5);
    generateDots(Math.sqrt(ids) * 6, nodeTypes.HILLS);
    // spreadTerrainType(2, nodeTypes.HILLS);

    // forests
    generateDots(Math.sqrt(ids) * 1.6, nodeTypes.BROADLEAF_FOREST);
    spreadTerrainType(
      1,
      nodeTypes.BROADLEAF_FOREST,
      nodeTypes.BROADLEAF_FOREST,
      0.4
    );

    utils.log("Defining nodes (fill plains) ...");
    fillTerrain(nodeTypes.PLAINS);

    const typeMapping = {
      PLAINS: node => (node.type = NODE_TYPES.PLAINS),
      HILLS: node => (node.type = NODE_TYPES.HILLS_GRASS),
      BROADLEAF_FOREST: node => (node.type = NODE_TYPES.BROADLEAF_FOREST),
      ROCKS: node => (node.type = NODE_TYPES.MOUNTAINS_SNOW),
      WATER: node => (node.type = NODE_TYPES.COAST)
    };
    Object.keys(nodeTypes).forEach(type => {
      Object.keys(nodeTypes[type]).forEach(nodeId => {
        nodesById[nodeId].creator = typeMapping[type];
      });
    });

    return Promise.resolve({
      connections: nodesConnections,
      nodes: nodes
    });
  }
};

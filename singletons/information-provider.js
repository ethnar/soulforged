const server = require("./server");

const InformationProvider = desc => {
  server.registerHandler(`info.${desc.info}`, (params, player, connection) => {
    return desc.provider(player, params);
  });
};

module.exports = global.InformationProvider = InformationProvider;

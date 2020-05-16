const Event = require("../.event");

class Drought extends Event {
  cycle(seconds) {
    super.cycle(seconds);
    world.getNodes().forEach(node => {
      node
        .getResources()
        .filter(resource => resource instanceof Plant)
        .forEach(resource => {
          resource.progressExpiration(seconds * 3);
        });
    });
  }
}
Object.assign(Drought.prototype, {
  name: "Drought",
  icon: `/${ICONS_PATH}/events/world/greenland_sgi_152_yellow.png`,
  eventChance: 1,
  eventDuration: 3 * DAYS,
  plotText:
    "It seems as if all clouds were gone, the plants will suffer from droughts.", // TODO: move to plot hint
  condition: () => {
    return !world.hasEvent(DenseFog) && !world.hasEvent(Storm);
  }
});
module.exports = global.Drought = Drought;

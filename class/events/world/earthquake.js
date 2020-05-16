const Event = require("../.event");
const server = require("../../../singletons/server");

class Earthquake extends Event {
  cycle(seconds) {
    super.cycle(seconds);

    this.timer = this.timer || 0;
    this.timer -= seconds;
    while (this.timer <= 0) {
      this.timer += seconds * utils.random(3 * MINUTES, 4 * MINUTES);

      this.damageBuildings();
      this.reshapeUnderground();
      this.specialEffects();
      this.resourcesReQuaking();
    }
  }

  resourcesReQuaking() {
    world.resourceReQuaking();
  }

  damageBuildings() {
    world.getNodes().forEach(node => {
      const buildings = node
        .getAllStructures()
        .filter(entity => entity instanceof Building);

      buildings.forEach(building => {
        if (utils.chance(40)) {
          utils.log("Earthquake: Building damaged", building.name, building.id);
          building.earthQuakeDamage(utils.random(18, 30) * HOURS);
        }
      });
    });
  }

  reshapeUnderground() {
    world
      .getNodes()
      .filter(node => node instanceof Underground)
      .forEach(node => {
        node.impactedByEarthquake();
      });
  }

  specialEffects() {
    server.sendJSToAll((main, window) => {
      const vibrate =
        window.navigator.vibrate ||
        window.navigator.webkitVibrate ||
        window.navigator.mozVibrate ||
        window.navigator.msVibrate;
      // main.

      const duration = 5000;
      const shareFrequency = 50;
      let step = 0;
      const interval = setInterval(() => {
        const delta = 40 * Math.sin((Math.PI * step) / 6000);
        step += shareFrequency;
        const x = Math.floor(Math.random() * delta) - delta / 2;
        const y = Math.floor(Math.random() * delta) - delta / 2;
        if (main) {
          main.$el.querySelector(
            ".world-map-container"
          ).style.transform = `translate(${x}px, ${y}px)`;
          if (step >= duration) {
            clearInterval(interval);
            main.$el.querySelector(
              ".world-map-container"
            ).style.transform = null;
          }
        }
      }, shareFrequency);
      vibrate.bind(window.navigator)([
        100,
        1000,
        300,
        1000,
        1000,
        600,
        1000,
        500,
        600,
        500,
        400
      ]);
    });
  }
}
Object.assign(Earthquake.prototype, {
  name: "Earthquake",
  icon: `/${ICONS_PATH}/events/world/sgi_41.png`,
  // spawned after tremors
  eventChance: 0,
  eventDuration: 14 * MINUTES,
  plotText: "The earth is shaking violently."
});
module.exports = global.Earthquake = Earthquake;

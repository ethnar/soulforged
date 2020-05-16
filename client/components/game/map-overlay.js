import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";

const mixRgba = (first, second, ratio) => {
  return [
    first[0] * (1 - ratio) + second[0] * ratio,
    first[1] * (1 - ratio) + second[1] * ratio,
    first[2] * (1 - ratio) + second[2] * ratio,
    first[3] * (1 - ratio) + second[3] * ratio
  ];
};

let intervals = [];
let animationsEnabled = true;
ServerService.getLocalSettingStream("disableWeatherEffects").subscribe(
  disableWeatherEffects => {
    animationsEnabled = !disableWeatherEffects;
  }
);

const addAnimation = (callback, time) => {
  let last = 0;
  let step = timestamp => {
    const progress = timestamp - last;

    if (progress > time) {
      last = timestamp;
      if (animationsEnabled) {
        callback(progress);
      }
    }
    window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);

  intervals.push(() => (step = () => {}));
};

const getEventStyle = name => {
  switch (name) {
    case "Strange Mist": {
      const style = {
        "background-position-x": `0px`
      };
      let i = 0;

      addAnimation(milliseconds => {
        i = (i + milliseconds / 200) % 200000;
        style["background-position-x"] = `${i}px`;
      }, 100);

      return {
        class: "strange-mist",
        style
      };
    }
    case "Dense Fog": {
      const style = {
        "background-position-x": `0px`
      };
      let i = 0;

      addAnimation(milliseconds => {
        i = (i + milliseconds / 200) % 200000;
        style["background-position-x"] = `${i}px`;
      }, 100);

      return {
        class: "dense-fog",
        style
      };
    }
    case "Storm": {
      const style = {
        "background-position": `0 0`
      };
      let i = 0;

      addAnimation(milliseconds => {
        i = (i + milliseconds) % 200000;
        style["background-position"] = `-${i / 2}px ${i}px`;
      }, 80);

      return {
        class: "thunderstorm",
        style
      };
    }
    default:
      return null;
  }
};

Vue.component("map-overlay", {
  props: {
    scale: {
      type: Number,
      default: 1
    }
  },

  data: () => ({
    weatherEffects: []
  }),

  subscriptions() {
    return {
      events: DataService.getEventsStream(),
      eventNames: DataService.getEventsStream()
        .map(events => events.map(e => e.name))
        .distinctUntilChanged(null, JSON.stringify)
        .do(names => this.updateWeatherEffects({ names })),
      climate: DataService.getPlayerInfoStream()
        .pluck("climate")
        .distinctUntilChanged(null, JSON.stringify)
        .do(climate => this.updateWeatherEffects({ climate }))
    };
  },

  computed: {
    scaleStyle() {
      return {
        transform: `scale(${this.scale})`
      };
    },

    style() {
      const night = [0, 0, 40, 0.5];
      const day = [0, 0, 0, 0];
      const sunrise = [195, 90, 0, 0.25];
      const sunset = [195, 50, 0, 0.25];

      // 22 - 6 - night
      // 6 - 7 - sunrise
      // 7 - 19 - day
      // 21 - 22 sunset

      const hasEvent = eventName => {
        return this.eventNames && this.eventNames.includes(eventName);
      };
      const getEventTimeLeft = eventName => {
        const event =
          this.events && this.events.find(e => e.name === eventName);
        return event && event.minutesLeft;
      };

      let result;
      const hourMinutes =
        60 - (getEventTimeLeft("Sunrise") || getEventTimeLeft("Sunset"));

      switch (true) {
        case hasEvent("Night"):
          result = night;
          break;
        case hasEvent("Sunrise") && hourMinutes < 30:
          result = mixRgba(night, sunrise, (hourMinutes % 60) / 30);
          break;
        case hasEvent("Sunrise"):
          result = mixRgba(sunrise, day, ((hourMinutes - 30) % 60) / 30);
          break;
        case hasEvent("Sunset") && hourMinutes < 30:
          result = mixRgba(day, sunset, (hourMinutes % 60) / 30);
          break;
        case hasEvent("Sunset"):
          result = mixRgba(sunset, night, ((hourMinutes - 30) % 60) / 30);
          break;
        default:
          result = day;
      }

      return {
        background: `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3]})`
      };
    }
  },

  methods: {
    updateWeatherEffects(data) {
      let { names, climate } = data;
      if (names) {
        this.names = names;
      } else {
        names = this.names;
      }
      if (climate) {
        this.climate = climate;
      } else {
        climate = this.climate;
      }
      if (!names || !climate) {
        return;
      }
      intervals.forEach(clear => clear());
      intervals = [];
      window.intervals = intervals;

      this.weatherEffects = names
        .map(getEventStyle)
        .filter(e => !!e)
        .map(eventProps => ({
          ...eventProps,
          class: [eventProps.class, this.climate]
        }));
    }
  },

  template: `
<div class="map-overlay">
    <div
        class="time-of-day-overlay"
        :style="style"
    />
    <div class="weather-effect" v-for="effect in weatherEffects" :style="[effect.style, scaleStyle]" :class="effect.class" />
</div>
    `
});

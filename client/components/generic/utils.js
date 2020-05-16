export const Utils = {
  isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  },

  formatFloatPoint: (number, base = 1000, ranges = []) => {
    let stage = 0;
    let float = +number;
    while (float > (950 * base) / 1000 && stage < ranges.length - 1) {
      float = float / base;
      stage += 1;
    }
    if (float < 100 && stage > 0) {
      float = float.toFixed(1);
    } else {
      if (float < 100 && float - Math.floor(float) !== 0) {
        float = float.toFixed(1);
      } else {
        float = Math.floor(float);
      }
    }
    return float + ranges[stage];
  },

  formatSize: number => {
    return Utils.formatFloatPoint(number, 1024, ["", "kB", "MB", "GB", "TB"]);
  },

  formatNumber: number => {
    return Utils.formatFloatPoint(number, 1000, ["", "k", "M", "B", "T"]);
  },

  decimalTwo: (number, round = Math.round) => {
    return round(number * 100) / 100;
  },

  formatTime: (time, precision = 100) => {
    const seconds = time % 60;
    time = Math.floor(time / 60);
    const minutes = time % 60;
    time = Math.floor(time / 60);
    const hours = time % 24;
    time = Math.floor(time / 24);
    const days = time;
    let result = [];
    if (days) result.push(`${days}d`);

    if (hours) result.push(`${hours}h`);
    else if (days) result.push("");

    if (minutes) result.push(`${minutes}m`);
    else if (days || hours) result.push("");

    if (seconds) result.push(`${seconds}s`);
    else if (days || hours || minutes) result.push("");

    return result
      .slice(0, precision)
      .join(" ")
      .trim();
  },

  formatTimeAgo(minutes) {
    let extra = "";
    switch (true) {
      case !minutes:
        return null;
      case minutes <= 1:
        return `${minutes} minute`;
      case minutes < 60:
        return `${minutes} minutes`;
      case minutes < 180:
        extra = minutes % 60 ? minutes % 60 : 0;
        extra = extra ? ` ${extra} minute${extra > 1 ? "s" : ""}` : "";
    }
    const hours = Math.floor(minutes / 60);
    switch (true) {
      case hours <= 1:
        return `${hours} hour${extra}`;
      case hours < 60:
        return `${hours} hours${extra}`;
    }
    const days = Math.floor(hours / 24);
    switch (true) {
      case days <= 1:
        return `${days} day`;
      default:
        return `${days} days`;
    }
  },

  buffSorter(a, b) {
    if (!!a.severity && !!b.severity) {
      return b.severity - a.severity;
    }
    if (!a.severity && !b.severity) {
      if (a.secondary !== b.secondary) {
        return b.secondary ? -1 : 1;
      }
      if (a.order === b.order) {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      }
      return a.order - b.order;
    }
    if (!!b.severity) {
      return 1;
    } else {
      return -1;
    }
  },

  itemsSorter(a, b) {
    const aIntegrity = a.integrity ? a.integrity[1] : 100;
    const bIntegrity = b.integrity ? b.integrity[1] : 100;
    if (!!aIntegrity !== !!bIntegrity) {
      if (!!bIntegrity) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a.order !== b.order) {
      if (a.order > b.order) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a.name !== b.name) {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    }
    if (aIntegrity !== bIntegrity) {
      return bIntegrity - aIntegrity;
    }
    if (b.qty && a.qty) {
      return b.qty - a.qty;
    }
    return 0;
  },

  linebreaks(text) {
    return text.replace(/\n/g, "<br>");
  },

  ucfirst(word) {
    if (!word) {
      return word;
    }
    return word[0].toUpperCase() + word.slice(1);
  },

  formatEffectValue(buff, value) {
    if (buff.multiplier && !buff.percentage) value /= 100;
    return (
      (buff.multiplier ? (buff.percentage ? "" : "x") : value > 0 ? "+" : "") +
      Utils.decimalTwo(value) +
      (buff.percentage ? "%" : "")
    );
  },

  formatEffects(buff) {
    return Object.keys(buff.effects || {})
      .map(stat => {
        const buffVal = buff.effects[stat];
        const value = typeof buffVal === "object" ? buffVal.value : buffVal;
        return this.formatEffectValue(buffVal, value) + " " + stat;
      })
      .concat(buff.description)
      .filter(text => !!text);
  },

  getEffectsText(buff) {
    return Utils.formatEffects(buff).join(", ");
  },

  getDomElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  },

  isDomElementDisplayed(element) {
    const center = Utils.getDomElementCenter(element);
    const elementOnPixel = document.elementFromPoint(...center);
    return element.contains(elementOnPixel);
  },

  equipmentSlotBorder(slotId) {
    switch (slotId) {
      case "Tool":
        return "2 blue";
      case "Weapon":
        return "2 red";
      default:
        return "2 green";
    }
  },

  getIntegrityClass(integrity) {
    let value;
    if (Array.isArray(integrity)) {
      value = integrity[integrity.length - 1];
    } else if (typeof integrity === "number") {
      value = integrity;
    }
    if (value === undefined) return null;
    return `integrity-${value}-value`;
  },

  addCss(css) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    document.getElementsByTagName("head")[0].appendChild(style);
  },

  isDeepSleep(currentAction) {
    return (
      currentAction &&
      currentAction.actionId === "Sleep" &&
      currentAction.progress >= 75 &&
      currentAction.ETA &&
      currentAction.ETA > 0
    );
  }
};
window.Utils = Utils;

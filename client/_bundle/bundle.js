(function () {
'use strict';

Vue.component("dialog-pane-with-logo", {
    data: () => ({
        legalText: window.LEGAL_HTML
    }),

    template: `
<div class="dialog-pane-with-logo">
    <div class="main-container-logo">
        <div class="heading">
            <header>Soulforged</header>
            <div class="logo"></div>
        </div>
        <slot></slot>
        <br/>
        <div class="legal" v-html="legalText"></div>
    </div>
</div>
`
});

const LoginView = {
    data: () => ({
        user: "",
        password: ""
    }),

    methods: {
        logIn() {
            window.location = "/api/login";
        }
    },

    template: `
<div class="Login">
    <form>
        <dialog-pane-with-logo>
            <p>
                Welcome to Soulforged!<br/>
                Find out more about the game on our
                <a target="_blank" href="https://soulforged.net/pages/#/about">website</a>.
            </p>
            <button @click.prevent="logIn()">Enter the game!</button>
        </dialog-pane-with-logo>
    </form>
</div>
`
};

let messaging;

try {
  const config = {
    apiKey: "AIzaSyC75M7koUSuNQ31mNBZQGz08MsdUwQlZq4",
    authDomain: "gthegame-205009.firebaseapp.com",
    databaseURL: "https://gthegame-205009.firebaseio.com",
    projectId: "gthegame-205009",
    storageBucket: "gthegame-205009.appspot.com",
    messagingSenderId: "413606385188"
  };
  firebase.initializeApp(config);
  messaging = firebase.messaging();

  messaging.onMessage(payload => {
    console.log("onMessage:", payload);
  });
} catch (e) {
  console.error("Notifications not available");
}

const pullNotifications = {
  init() {
    if (!messaging) {
      return new Promise(() => {});
    }
    return messaging.requestPermission().then(() => messaging.getToken()).then(token => {
      return token;
    }).catch(error => {
      // if (error.code === 'messaging/permission-blocked') {
      //     ServerService.togglePushNotifications(null);
      //     return;
      // }
      console.error("Error occurred!", error);
    });
  }
};

function isInsert(d) {
  return isArr(d[0]);
}
function isObj(o) {
  return o instanceof Object && !(o instanceof Array);
}
function isArr(o) {
  return o instanceof Array;
}
function shallowCopy(o) {
  if (isObj(o)) return Object.assign({}, o);
  if (isArr(o)) return o.slice();
  return o;
}
function getContainer(orig, result, path) {
  let len = path.length;
  if (!len) return undefined;
  let origContainer = orig;
  let container = result;
  if (container === origContainer) container = shallowCopy(origContainer);
  for (let i = 0; i < len - 1; ++i) {
    let seg = path[i];
    if (typeof seg === "number" && isArr(origContainer) && isArr(container)) {
      origContainer = origContainer[seg];
      if (container[seg] === origContainer) {
        container = container[seg] = shallowCopy(origContainer);
      } else {
        container = container[seg];
      }
    }
    if (typeof seg === "string" && isObj(origContainer) && isObj(container)) {
      origContainer = origContainer[seg];
      if (container[seg] === origContainer) {
        container = container[seg] = shallowCopy(origContainer);
      } else {
        container = container[seg];
      }
    }
  }
  return container;
}
function getVal(container, path) {
  let len = path.length;
  for (let i = 0; i < len; ++i) {
    let seg = path[i];
    if (typeof seg === "number" && isArr(container)) {
      container = container[seg];
    }
    if (typeof seg === "string" && isObj(container)) {
      container = container[seg];
    }
  }
  return container;
}
function applyDiff(o, d) {
  if (!d) return o;
  let result = shallowCopy(o);
  d.forEach(p => {
    if (isInsert(p)) result = applyInsert(o, result, p);else result = applyDelete(o, result, p);
  });
  return result;
}
function applyInsert(orig, result, insert) {
  let [path, val] = insert;
  let container = getContainer(orig, result, path);
  if (!container) return val;
  let key = path[path.length - 1];
  if (typeof key === "number" && isArr(container)) {
    container.splice(key, 0, val);
  }
  if (typeof key === "string" && isObj(container)) {
    container[key] = val;
  }
  return result;
}
function applyDelete(orig, result, path) {
  let container = getContainer(orig, result, path);
  if (!container) return null;
  let key = path[path.length - 1];
  if (typeof key === "number" && isArr(container)) {
    container.splice(key, 1);
    return result;
  }
  if (typeof key === "string" && isObj(container)) {
    delete container[key];
    return result;
  }
  return null;
}
function diff(a, b, tolerance = Infinity) {
  let result = [];
  if (gatherDiff(a, b, tolerance, [], result) || result.length > tolerance) return [[[], b]];
  if (result.length === 0) return null;
  return result;
}
function gatherDiff(a, b, tolerance = 3, path, result) {
  if (a === undefined) a = null;
  if (b === undefined) b = null;
  if (typeof a === "number" && isNaN(a)) a = null;
  if (typeof b === "number" && isNaN(b)) b = null;
  if (a === b) return false;
  if (typeof a !== typeof b) {
    result.push([path, b]);
    return false;
  }
  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      result.push([path, b]);
      return false;
    }
    let offset = 0;
    const thunks = [];
    if (!arrDiff(a, b, tolerance - result.length, () => thunks.push(() => ++offset), (aIdx, bIdx) => thunks.push(() => result.push(path.concat([offset]))), (aIdx, bIdx) => thunks.push(() => {
      result.push([path.concat([offset++]), b[bIdx]]);
    }))) return true;
    for (let i = thunks.length - 1; i >= 0; --i) {
      thunks[i]();
    }
    return false;
  }
  if (b instanceof Array) {
    result.push([path, b]);
    return false;
  }
  if (a instanceof Object) {
    if (!(b instanceof Object)) {
      result.push([path, b]);
      return false;
    }
    for (var k in a) {
      if (!(k in b)) {
        result.push(path.concat([k]));
        if (result.length > tolerance) {
          return true;
        }
        continue;
      }
      if (gatherDiff(a[k], b[k], tolerance, path.concat([k]), result)) {
        return true;
      }
      if (result.length > tolerance) {
        return true;
      }
    }
    for (var k in b) {
      if (!(k in a)) {
        result.push([path.concat([k]), b[k]]);
        if (result.length > tolerance) {
          return true;
        }
      }
    }
    return false;
  }
  result.push([path, b]);
  return false;
}
function deepEqual(a, b) {
  return a === b || diff(a, b, 0) == null;
}
/**
 * Finds the longest common subsequence between a and b,
 * optionally shortcutting any search whose removed elements
 * would exceed the provided tolerance value.
 * If there is no match within the provided tolerance, this function
 * returns null.
 */
function lcs(a, b, tolerance = a.length + b.length) {
  let result = [];
  return arrDiff(a, b, tolerance, aIdx => result.push(a[aIdx])) ? result.reverse() : null;
}
function arrDiff(a, b, tolerance = a.length + b.length, onEq, onPickA = () => null, onPickB = () => null) {
  tolerance = Math.min(tolerance, a.length + b.length);
  let aLen = a.length;
  let bLen = b.length;
  let aOfDiagonal = new Uint32Array(tolerance * 2 + 2);
  let aOfDiagonalForEditSize = new Array(tolerance + 1);
  let shortestEdit = function () {
    for (var d = 0; d <= tolerance; ++d) {
      for (var k = -d; k <= d; k += 2) {
        let aIdx;
        let takeB = aOfDiagonal[k + 1 + tolerance];
        let takeA = aOfDiagonal[k - 1 + tolerance];
        if (k === -d || k !== d && takeA < takeB) {
          aIdx = takeB;
        } else {
          aIdx = takeA + 1;
        }
        let bIdx = aIdx - k;
        while (aIdx < aLen && bIdx < bLen && deepEqual(a[aIdx], b[bIdx])) {
          aIdx++;
          bIdx++;
        }
        aOfDiagonal[k + tolerance] = aIdx;
        if (aIdx >= aLen && bIdx >= bLen) {
          aOfDiagonalForEditSize[d] = aOfDiagonal.slice();
          return [d, k];
        }
      }
      aOfDiagonalForEditSize[d] = aOfDiagonal.slice();
    }
    return null;
  }();
  if (shortestEdit) {
    let [d, k] = shortestEdit;
    let aIdx = aOfDiagonalForEditSize[d][k + tolerance];
    let bIdx = aIdx - k;
    while (d > 0) {
      let k = aIdx - bIdx;
      let v = aOfDiagonalForEditSize[d - 1];
      let prevK;
      if (k === -d || k !== d && v[k - 1 + tolerance] < v[k + 1 + tolerance]) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      let prevAIdx = v[prevK + tolerance];
      let prevBIdx = prevAIdx - prevK;
      while (aIdx > prevAIdx && bIdx > prevBIdx) {
        onEq(--aIdx, --bIdx);
      }
      if (aIdx > prevAIdx) {
        onPickA(--aIdx, bIdx);
      } else if (bIdx > prevBIdx) {
        onPickB(aIdx, --bIdx);
      }
      --d;
    }
    while (aIdx > 0 && bIdx > 0) {
      onEq(--aIdx, --bIdx);
    }
    return true;
  }
  return false;
}
const all = {
  isInsert,
  isObj,
  isArr,
  shallowCopy,
  getContainer,
  getVal,
  applyDiff,
  applyInsert,
  applyDelete,
  diff,
  gatherDiff,
  deepEqual,
  lcs,
  arrDiff
};
if (typeof module !== "undefined") {
  module.exports = all;
} else {
  window.jsonDelta = all;
}

let instance;

Vue.component("toast-notification", {
  data: () => ({
    message: "",
    visible: false
  }),

  mounted() {
    instance = this;
  },

  methods: {
    hide() {
      this.visible = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    },

    show() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.visible = true;
      this.timeout = setTimeout(() => {
        this.hide();
      }, 4000);
    }
  },

  template: `
<div :class="{ visible: visible }" @click="hide();" class="toast-message">{{message}}</div>
`
});

const ToastNotification = window.ToastNotification = {
  notify(message) {
    instance.message = message;
    instance.show();
  }
};

const pendingRequests = {};
const updateHandlers = {};
const websocketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const domain = `${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}`;
const createAvatarUrl = "/api/createAvatar";
const avatarsUrl = "/api/getAvatars";

let deadStream;
let audioVolumeStream;
let chatMessageStream;
let connected = false;
let liveUpdateNodeId;
let settingsFetched;
let travelContext;
const resetStream = new Rx.ReplaySubject(1);
const dataUsageStream = new Rx.ReplaySubject(1);
const pushNotificationsTokenStream = new Rx.ReplaySubject(1);
const travelModeStream = new Rx.ReplaySubject(1);
const triggerTravelStream = new Rx.Subject();
const localSettingsStreams = {};
dataUsageStream.next(0);
resetStream.next();
travelModeStream.next(false);

const fetcher = (url, params) => new Promise((resolve, reject) => fetch(url, params).then(function (response) {
  if (response.ok) {
    response.text().then(body => {
      let value;
      try {
        value = JSON.parse(body);
      } catch (e) {
        value = body;
      }
      resolve(value);
    });
  } else {
    response.text().then(error => reject(error));
  }
  return response;
}).catch(error => {
  reject(error);
}));

let playerId = null;
let resetting;
let openPromise;
let connection;

const getOpenPromise = (reset = false) => {
  if (reset && connected) {
    openPromise = null;
    connected = false;
    resetStream.next();
  }
  if (!openPromise) {
    if (connection) {
      connection.close();
    }

    connection = new WebSocket(`${websocketProtocol}//${domain}/api/ws`);
    window.connection = connection;

    connection.onmessage = string => {
      let json = JSON.parse(string.data);

      if (json === "not_logged_in") {
        window.location = "#/login";
        return;
      }

      dataUsageStream.first().subscribe(soFar => dataUsageStream.next(soFar + string.data.length));
      if (json.r6) {
        if (pendingRequests[json.key]) {
          pendingRequests[json.key](json.data);
          delete pendingRequests[json.key];
        } else {
          throw new Error("Received response to a request that wasn't sent: " + JSON.stringify(json));
        }
      }
      if (json.u5) {
        if (updateHandlers[json.u5]) {
          updateHandlers[json.u5](json.data);
        } else {
          console.warn("Received update that does not have a handler: " + json.update);
          console.warn(json.data);
        }
      }
    };

    connection.onclose = (error, ...args) => {
      if (!resetting) {
        setTimeout(() => {
          getOpenPromise(true);
        }, 1000);
      }
      resetting = false;
    };

    openPromise = new Promise(resolve => connection.onopen = resolve).then(() => connection);

    openPromise.then(() => {
      connected = true;
      pullNotifications.init().then(token => {
        pushNotificationsTokenStream.next(token);
        ServerService$1.getPushNotificationsEnabledStream().first().subscribe(value => {
          if (value === undefined) {
            setTimeout(() => {
              ServerService$1.togglePushNotifications(true);
            }, 5000);
          }
        });
        ServerService$1.request("get-push-notifications", { token });
      });
    });
  }
  return openPromise;
};

const dataStreams = {};
const dynamicComponentCache = {};
const ServerService$1 = window.ServerService = {
  loadDynamicComponent(dynamicComponentDef) {
    const key = dynamicComponentDef.componentName;
    if (!dynamicComponentCache[key]) {
      dynamicComponentCache[key] = new Promise((resolve, reject) => {
        const head = document.getElementsByTagName("head")[0];
        if (dynamicComponentDef.jsFile) {
          const script = document.createElement("script");
          script.src = dynamicComponentDef.jsFile;
          head.appendChild(script);
        }
        if (dynamicComponentDef.cssFile) {
          const link = document.createElement("link");
          link.href = dynamicComponentDef.cssFile;
          link.rel = "stylesheet";
          head.appendChild(link);
        }
        const interval = setInterval(() => {
          if (Vue.component(dynamicComponentDef.componentName)) {
            clearInterval(interval);
            resolve(dynamicComponentDef.componentName);
          }
        }, 20);
      });
    }
    return dynamicComponentCache[key];
  },

  getDataStream(topic, replay = true) {
    if (!dataStreams[topic]) {
      if (replay) {
        dataStreams[topic] = new Rx.ReplaySubject(1);
      } else {
        dataStreams[topic] = new Rx.Subject();
      }
      ServerService$1.registerHandler(topic, data => {
        dataStreams[topic].next(data);
      });
      ServerService$1.triggerDataFetch(topic);
    }
    return dataStreams[topic];
  },

  triggerDataFetch(topic) {
    ServerService$1.request("dataFetchTrigger", topic);
  },

  getPlayerId() {
    return playerId;
  },

  getResetStream() {
    return resetStream;
  },

  requestUnauth(name, params) {
    return fetcher("/api/" + name, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(params)
    });
  },

  request(name, params, key = undefined) {
    return getOpenPromise().then(connection => {
      return new Promise(resolve => {
        if (key === undefined) {
          key = `${new Date().getTime()}--${Math.random()}`; // TODO: improve
        }
        connection.send(JSON.stringify({
          r6: name,
          params: params,
          key: key
        }));
        pendingRequests[key] = resolve;
      });
    });
  },

  getAvatars() {
    return fetcher(avatarsUrl, {
      method: "POST",
      credentials: "include"
    });
  },

  reconnect() {
    if (connected) {
      resetting = true;
      return getOpenPromise(true);
    }
  },

  getIsDungeonStream() {
    return ServerService$1.getNodeStream().map(node => node.zLevel <= -9000).distinctUntilChanged();
  },

  getNodeStream() {
    return DataService.getCurrentNodeIdStream().switchMap(nodeId => MapService.getNodeStream(nodeId));
  },

  getInfo(type, params) {
    return ServerService$1.request(`info.${type}`, params);
  },

  setSetting(key, value) {
    return ServerService$1.request("setUserSettings", {
      key,
      value
    });
  },

  getSettingsStream() {
    if (!settingsFetched) {
      setTimeout(() => ServerService$1.request(`getUserSettings`));
      settingsFetched = true;
    }
    return ServerService$1.getDataStream("user-settings");
  },

  getLocalSettingStream(key) {
    if (!localSettingsStreams[key]) {
      localSettingsStreams[key] = new Rx.ReplaySubject(1);
      let value = null;
      try {
        value = JSON.parse(localStorage.getItem(`localSettings--${key}`));
      } catch (e) {}
      this.getLocalSettingStream(key).next(value);

      window.addEventListener("storage", event => {
        if (event.storageArea === localStorage && event.key === key) {
          this.getLocalSettingStream(key).next(event.value);
        }
      });
    }

    return localSettingsStreams[key];
  },

  setLocalSetting(key, value) {
    localStorage.setItem(`localSettings--${key}`, JSON.stringify(value));
    this.getLocalSettingStream(key).next(value);
  },

  getHomeStream() {
    return ServerService$1.getNodeStream().map(node => node.structures.find(s => s.inventory));
  },

  createAvatar(name, preferences, perks, race) {
    return fetcher(createAvatarUrl, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name,
        preferences,
        perks: perks || [],
        race: race
      })
    });
  },

  registerHandler(update, callback) {
    updateHandlers[update] = data => {
      callback(data);
    };
  },

  getUsedDataStream() {
    return dataUsageStream;
  },

  getDeadStream() {
    if (!deadStream) {
      deadStream = new Rx.Subject();
      ServerService$1.registerHandler("dead", msg => {
        deadStream.next({
          dead: true,
          reason: msg
        });
      });
      ServerService$1.registerHandler("alive", () => {
        deadStream.next({
          dead: false
        });
      });
    }
    return deadStream;
  },

  getPushNotificationsAllowedStream() {
    return pushNotificationsTokenStream.map(token => !!token);
  },

  getPushNotificationsEnabledStream() {
    return Rx.Observable.fromPromise(pullNotifications.init()).switchMap(token => ServerService$1.getDataStream("push-notifications").filter(data => data.token === token).map(data => data.enabled));
  },

  getTravelModeStream() {
    return travelModeStream;
  },

  toggleTravelMode(enabled = false) {
    travelModeStream.next(enabled);
  },

  setTravelContext(context) {
    travelContext = context;
  },

  getTravelContext() {
    return travelContext;
  },

  triggerTravelStream(event) {
    triggerTravelStream.next(event);
  },

  getTriggerTravelStream() {
    return triggerTravelStream;
  },

  togglePushNotifications(enabled = true) {
    return pullNotifications.init().then(token => {
      pushNotificationsTokenStream.next(token);
      if (token) {
        ServerService$1.request("set-push-notifications", {
          token,
          enabled
        });
      }
    });
  },

  setAudioVolume(value) {
    localStorage.setItem("audioVolume", value);
    this.getAudioVolumeStream().next(value);
  },

  getAudioVolumeStream() {
    if (!audioVolumeStream) {
      audioVolumeStream = new Rx.ReplaySubject(1);
      const volume = +localStorage.getItem("audioVolume");
      audioVolumeStream.next(typeof volume === "number" ? volume : 0.3);
    }
    return audioVolumeStream;
  },

  getChatMessageStream() {
    if (!chatMessageStream) {
      chatMessageStream = new Rx.Subject();
      ServerService$1.registerHandler("chat-message", data => {
        if (data.level >= 10) {
          ToastNotification.notify(data.message);
        }
        chatMessageStream.next(data);
      });
    }
    return chatMessageStream;
  },

  selectLiveUpdateNodeId(nodeId, force = false) {
    if (force || liveUpdateNodeId !== nodeId) {
      liveUpdateNodeId = nodeId;
      ServerService$1.request("live-update-node", {
        node: nodeId
      });
    }
  },

  reportClientSideError(error) {
    let payload;
    try {
      payload = JSON.stringify(error);
    } catch (e) {
      payload = "Non-serializable error encountered: " + error.message;
    }
    ServerService$1.request("client-side-error", payload);
  }
};
window.ServerService = ServerService$1;

let startupId = null;
ServerService$1.registerHandler("startup-id", data => {
  if (startupId && startupId !== data) {
    window.location.reload();
  }
  startupId = data;
});

const Utils$1 = {
  isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  },

  formatFloatPoint: (number, base = 1000, ranges = []) => {
    let stage = 0;
    let float = +number;
    while (float > 950 * base / 1000 && stage < ranges.length - 1) {
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
    return Utils$1.formatFloatPoint(number, 1024, ["", "kB", "MB", "GB", "TB"]);
  },

  formatNumber: number => {
    return Utils$1.formatFloatPoint(number, 1000, ["", "k", "M", "B", "T"]);
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

    if (hours) result.push(`${hours}h`);else if (days) result.push("");

    if (minutes) result.push(`${minutes}m`);else if (days || hours) result.push("");

    if (seconds) result.push(`${seconds}s`);else if (days || hours || minutes) result.push("");

    return result.slice(0, precision).join(" ").trim();
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
    return (buff.multiplier ? buff.percentage ? "" : "x" : value > 0 ? "+" : "") + Utils$1.decimalTwo(value) + (buff.percentage ? "%" : "");
  },

  formatEffects(buff) {
    return Object.keys(buff.effects || {}).map(stat => {
      const buffVal = buff.effects[stat];
      const value = typeof buffVal === "object" ? buffVal.value : buffVal;
      return this.formatEffectValue(buffVal, value) + " " + stat;
    }).concat(buff.description).filter(text => !!text);
  },

  getEffectsText(buff) {
    return Utils$1.formatEffects(buff).join(", ");
  },

  getDomElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  },

  isDomElementDisplayed(element) {
    const center = Utils$1.getDomElementCenter(element);
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
    return currentAction && currentAction.actionId === "Sleep" && currentAction.progress >= 75 && currentAction.ETA && currentAction.ETA > 0;
  }
};
window.Utils = Utils$1;

Vue.component("animated-text", {
  props: ["text", "mysteryFont"],

  data: () => ({
    clicked: false
  }),

  computed: {
    splitText() {
      if (!this.text) {
        return "";
      }
      let delay = 0;
      return this.text.replace(/(>|^)[^<>]+(<|$)/g, match => {
        let isWord = false;
        let result = match.replace(/([^<>])/g, (letter, _, offset, ...rest) => {
          let pre = "";
          let post = "";
          const isWordTerminating = letter.match(/[^a-zA-Z]/);
          if (!isWordTerminating && !isWord) pre = '<span class="word">';
          if (isWordTerminating && isWord) pre = "</span>";
          if (isWord && offset === match.length - 1) post = "</span>";
          isWord = !isWordTerminating;
          delay = delay + 0.03;
          return `${pre}<span style="animation-delay: ${delay.toFixed(2)}s">${letter}</span>${post}`;
        });
        if (isWord) {
          result = result.replace(/(<)?$/, "</span>$1");
        }
        return result;
      });
    }
  },

  methods: {
    onClick() {
      this.clicked = true;
    }
  },

  template: `
<div class="plot-text-wrapper" @click="onClick" :class="{ 'show-all': clicked }">
    <slot></slot>
    <div class="plot-text" v-html="splitText" :class="mysteryFont"></div>
</div>
    `
});

Vue.component("help-icon", {
  props: ["title"],

  data: () => ({
    open: false
  }),

  watch: {
    open(value) {
      if (value) {
        this.$emit("show");
      } else {
        this.$emit("hide");
      }
    }
  },

  template: `
<div class="help-icon">
    <div class="icon" @click="open = true">
        ?
    </div>
    <modal @close="open = false" v-if="open">
        <div slot="header">
            {{title || 'Loading...'}}
        </div>
        <div slot="main" class="help-text">
            <slot></slot>
        </div>
    </modal>
</div>
    `
});

const streamsCache = {};
const streamsData = {};
const timeouts = {};

const unclearable = {
  getMyRecipesStream: true,
  getRecentResearchesStream: true,
  getMyBuildingPlansStream: true,
  getMyQuestsStream: true,
  getRelationshipsStream: true
};

function makeStreamGetter(dataStream) {
  return () => {
    clearTimeout(timeouts[dataStream]);
    if (!streamsCache[dataStream]) {
      const stream = new Rx.ReplaySubject(1);

      ServerService$1.registerHandler(`data.payload.${dataStream}.initial`, data => {
        stream.next(data);
        streamsData[dataStream] = data;
      });

      ServerService$1.registerHandler(`data.payload.${dataStream}.delta`, data => {
        data = window.jsonDelta.applyDiff(streamsData[dataStream], data);
        stream.next(data);
        streamsData[dataStream] = data;
      });

      if (streamsData[dataStream]) {
        stream.next(streamsData[dataStream]);
      }

      ServerService$1.request(`data.request.${dataStream}`, {
        sub: true,
        fetch: !streamsData[dataStream]
      });

      streamsCache[dataStream] = stream.finally(() => {
        delete streamsCache[dataStream];
        ServerService$1.request(`data.request.${dataStream}`, {
          sub: false
        });
        if (!unclearable[dataStream]) {
          timeouts[dataStream] = setTimeout(() => {
            delete streamsCache[dataStream];
            delete streamsData[dataStream];
          }, 30000);
        }
      }).publishReplay(1).refCount();
    }
    return streamsCache[dataStream];
  };
}

const getAvailableItemsStream = () => Rx.Observable.combineLatest(DataService$1.getMyInventoryStream(), DataService$1.getMyHomeInventoryStream()).filter(([inventory]) => inventory).map(([inventory, homeInventory]) => [...inventory.items, ...(homeInventory && homeInventory.items || [])]);

const getAvailableItemsCountsStream = () => getAvailableItemsStream().map(items => {
  const map = {};
  items.forEach(i => {
    map[i.itemCode] = map[i.itemCode] || 0;
    map[i.itemCode] += i.qty;
  });
  return map;
  // return items.toObject(i => i.itemCode, i => i.qty);
});

const DataService$1 = {
  getIsTutorialAreaStream: makeStreamGetter("isTutorialArea"),
  getCurrentActionStream: makeStreamGetter("currentAction"),
  getAcceptedLegalTermsStream: makeStreamGetter("acceptedLegalTerms"),
  getAmbientAudioStream: makeStreamGetter("ambientAudio"),
  getMyCreatureStream: makeStreamGetter("myCreature"),
  getMyEquipmentStream: makeStreamGetter("myEquipment"),
  getMyFurnitureStream: makeStreamGetter("myFurniture"),
  getMyRecipesStream: makeStreamGetter("myRecipes"),
  getMyTradesStream: makeStreamGetter("myTrades"),
  getMyInventoryStream: makeStreamGetter("myInventory"),
  getMyHomeInventoryStream: makeStreamGetter("myHomeInventory"),
  getResearchMaterialsStream: makeStreamGetter("researchMaterials"),
  getRecentResearchesStream: makeStreamGetter("recentResearches"),
  getMyBuildingPlansStream: makeStreamGetter("myBuildingPlans"),
  getPlayerInfoStream: makeStreamGetter("playerInfo"),
  getMyQuestsStream: makeStreamGetter("myQuests"),
  getEffectsSummaryStream: makeStreamGetter("effectsSummary"),
  getCurrentTimeInMinutesStream: makeStreamGetter("currentTimeInMinutes"),
  getTradeListingsStream: makeStreamGetter("tradeListings"),
  getKnownItemsStream: makeStreamGetter("knownItems"),
  getEventsStream: makeStreamGetter("events"),
  getNodeItemsStream: makeStreamGetter("nodeItems"),
  getListingIdsStream: makeStreamGetter("listingIds"),
  getRelationshipsStream: makeStreamGetter("relationships"),
  getTickerStream: makeStreamGetter("ticker"),
  getCurrentNodeIdStream: () => DataService$1.getPlayerInfoStream().pluck("location"),
  getAvailableItemsStream,
  getAvailableItemsCountsStream
};

ServerService$1.getResetStream().subscribe(() => {
  Object.keys(streamsCache).forEach(dataStream => {
    ServerService$1.request(`data.request.${dataStream}`, {
      sub: true,
      fetch: true
    });
  });
});

window.DataService = DataService$1;

Vue.component("number-selector", {
  props: {
    value: 0,
    inline: false,
    min: {
      type: Number,
      default: -100
    },
    max: {
      type: Number,
      default: 9999
    },
    choices: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    inputValue: Number
  }),

  subscriptions() {
    return {
      tutorialArea: DataService$1.getIsTutorialAreaStream()
    };
  },

  watch: {
    value: {
      handler() {
        this.inputValue = this.limit(this.value);
        if (this.inputValue !== this.value) {
          this.$emit("input", this.inputValue);
        }
      },
      immediate: true
    }
  },

  methods: {
    limit(value, failSafe) {
      if (value !== value) {
        value = failSafe;
      }
      return Math.min(this.max, Math.max(this.min, value));
    },

    change(by) {
      this.$emit("input", this.limit(this.value + by, by));
    },

    set(to) {
      this.$emit("input", this.limit(to));
    },

    canChange(by) {
      return this.limit(this.value + by, by) !== this.value;
    },

    clickedInput() {
      try {
        this.$refs.numberInput.select();
      } catch (e) {}
    }
  },

  template: `
<div class="number-selector" :class="{ inline: inline }">
    <div class="number">
        <input ref="numberInput" type="number" v-model="inputValue" @input="$emit('input', limit(inputValue));" @click="clickedInput();">
        <div class="buttons">
            <a class="button" @click="change(-1)" :disabled="!canChange(-1)">&lt;</a>
            <a class="button" @click="change(1)" :disabled="!canChange(1)">&gt;</a>
        </div>
    </div>
    <div class="choices" v-if="choices.length && !tutorialArea">
        <div class="help-text">Quick selection:</div>
        <div class="quick-selection-buttons">
            <a class="button" v-for="number in choices" @click="set(number)">{{number}}</a>        
        </div>
    </div>
</div>
    `
});

Vue.component("modal", {
  props: {
    closeable: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    headerSideStyle: ""
  }),

  mounted() {
    document.body.appendChild(this.$el);
  },

  destroyed() {
    if (document.body.contains(this.$el)) {
      document.body.removeChild(this.$el);
    }
  },

  template: `
<div class="modal">
    <div class="contents">
        <div v-if="closeable" class="close" @click="$emit('close')"></div>
        <div class="title" ref="title">
            <div class="title-contents">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="main">
            <slot name="main"></slot>
        </div>
    </div>
    <div class="backdrop" @click="$emit('close')"></div>
</div>
    `
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let nodeIdsStream;
const nodesStreams = {};
let previousData$1 = null;
let nodesByIds = {};
let usingMapDiffs = false;
const updatedStoredResourcesStream = new Rx.ReplaySubject(1);
let zLevelStream;
updatedStoredResourcesStream.next(true);

const availableZLevels = {};
const availableZLevelsStream = new Rx.ReplaySubject(1);

ServerService$1.getResetStream().subscribe(() => {
  previousData$1 = null;
  usingMapDiffs = null;
});

const MapService$1 = window.MapService = {
  getNodeIdsStream() {
    if (!nodeIdsStream) {
      const stream = new Rx.Subject();

      nodeIdsStream = stream.distinctUntilChanged(null, JSON.stringify).shareReplay(1);

      ServerService$1.registerHandler("regionNameUpdate", data => {
        if (data) {
          data.nodeIds.forEach(nodeId => {
            const nodeStream = nodesStreams[nodeId];
            if (nodeStream) {
              nodeStream.first().subscribe(oldData => {
                nodeStream.next(_extends({}, oldData, {
                  region: data.regionName
                }));
              });
            }
          });
        }
      });

      ServerService$1.registerHandler("remove-node-id", nodeId => {
        delete nodesByIds[nodeId];
        stream.next(Object.keys(nodesByIds));
      });

      ServerService$1.registerHandler("mapData", data => {
        if (previousData$1 && usingMapDiffs) {
          data = window.jsonDelta.applyDiff(previousData$1, data);
        }
        if (usingMapDiffs) {
          previousData$1 = data;
        } else {
          usingMapDiffs = true;
        }
        if (!data || !data.reduce) {
          console.error("Wrong map data:", data);
          return;
        }

        data.forEach(item => {
          nodesStreams[item.id] = nodesStreams[item.id] || new Rx.ReplaySubject(1);
          nodesStreams[item.id].next(item);
          nodesByIds[item.id] = item;

          if (!availableZLevels[item.zLevel]) {
            availableZLevels[item.zLevel] = true;
            availableZLevelsStream.next(availableZLevels);
          }
        });

        stream.next(Object.keys(nodesByIds));
      });
    }
    return nodeIdsStream;
  },

  getNodeStream(id) {
    nodesStreams[id] = nodesStreams[id] || new Rx.ReplaySubject(1);
    return nodesStreams[id];
  },

  getCurrentZLevelStream() {
    if (!zLevelStream) {
      zLevelStream = new Rx.ReplaySubject(1);
      ServerService$1.getNodeStream().pluck("zLevel").distinctUntilChanged().subscribe(currentZLevel => {
        zLevelStream.next(currentZLevel);
      });
    }
    return zLevelStream;
  },

  changeZLevel(changeBy) {
    MapService$1.getCurrentZLevelStream().first().subscribe(last => {
      zLevelStream.next(last + changeBy);
    });
  },

  getAvailableZLevelsStream() {
    return availableZLevelsStream;
  }
};

MapService$1.getNodeIdsStream();

const beforeOpenStream = new Rx.Subject();
const showNodeDetails = new Rx.Subject();
const selectedNode = new Rx.ReplaySubject(1);
const panelStream = new Rx.Subject();
const mapModeStream = new Rx.ReplaySubject(1);
let liveNodeId;
selectedNode.next(null);

const ContentFrameService = window.ContentFrameService = {
  selectMapMode(mode) {
    mapModeStream.next(mode);
  },

  getMapModeStream() {
    return mapModeStream;
  },

  getBeforeOpenStream() {
    return beforeOpenStream;
  },

  triggerBeforeOpenStream() {
    beforeOpenStream.next(true);
  },

  triggerClosePanel() {
    panelStream.next(null);
  },

  triggerShowPanel(panel) {
    panelStream.next(panel);
  },

  getShowPanelStream() {
    return panelStream;
  },

  getShowNodeDetailsStream() {
    return showNodeDetails;
  },

  getSelectedNodeStream() {
    return selectedNode.switchMap(nodeId => {
      if (!nodeId) {
        return ServerService$1.getNodeStream();
      }
      return MapService$1.getNodeStream(nodeId);
    });
  },

  triggerShowNodeDetails(node) {
    if (node) {
      showNodeDetails.next(true);
    }
    liveNodeId = node && node.id;
    ServerService$1.selectLiveUpdateNodeId(liveNodeId);
  },

  triggerNodeSelected(node) {
    selectedNode.next(node && node.id);
  }
};

ServerService$1.getResetStream().subscribe(() => {
  ServerService$1.selectLiveUpdateNodeId(liveNodeId);
});

const leftPad = n => `${n}`.length === 2 ? n : `0${n}`;

Vue.component("game-chat", {
  props: ["persistent"],

  data: () => ({
    message: "",
    messages: [],
    colorCache: {},
    timeCutoff: 0,
    timeCutoffPermanent: 0
  }),

  created() {
    this.focusTimeouts = [];

    this.timeCutoff = +localStorage.getItem("chat-notification-cutoff") || 0;
    this.timeCutoffPermanent = this.timeCutoff;
    window.addEventListener("focus", this.onFocus.bind(this), false);
    window.addEventListener("blur", this.cancelCutoffs.bind(this), false);
  },

  destroyed() {
    window.removeEventListener("focus", this.onFocus.bind(this), false);
    window.removeEventListener("blur", this.cancelCutoffs.bind(this), false);
  },

  subscriptions() {
    return {
      isDungeon: ServerService$1.getIsDungeonStream(),
      reset: ServerService$1.getResetStream().do(() => {
        this.messages = [];
        this.sending = false;
        this.initialLoad();
      }),
      newMessages: ServerService$1.getChatMessageStream().do(data => {
        this.messages = [data, ...this.messages];
        if (this.focused) {
          this.updateLatestSeen();
        }
      })
    };
  },

  methods: {
    scheduleCutoff(targetCutoff, inTime = 5000) {
      const timeout = setTimeout(() => {
        this.timeCutoff = Math.max(this.timeCutoff, targetCutoff);
        localStorage.setItem("chat-notification-cutoff", this.timeCutoff);
        const idx = this.focusTimeouts.indexOf(timeout);
        if (idx !== -1) {
          this.focusTimeouts.splice(idx, 1);
        }
      }, inTime);
      const timeoutPermanent = setTimeout(() => {
        this.timeCutoffPermanent = Math.max(this.timeCutoffPermanent, targetCutoff);
        const idx = this.focusTimeouts.indexOf(timeoutPermanent);
        if (idx !== -1) {
          this.focusTimeouts.splice(idx, 1);
        }
      }, inTime + 1100);
      this.focusTimeouts.push(timeout);
      this.focusTimeouts.push(timeoutPermanent);
    },

    onFocus() {
      this.focused = true;
      this.updateLatestSeen();
    },

    cancelCutoffs() {
      this.focused = false;
      this.focusTimeouts.forEach(timeout => clearTimeout(timeout));
      this.focusTimeouts = [];
    },

    scrollToBottom() {
      setTimeout(() => {
        if (this.$refs.messagesContainer) {
          this.$refs.messagesContainer.scrollTop = 900000;
        }
      });
    },

    initialLoad() {
      return ServerService$1.request("get-chat-messages").then(messages => {
        this.messages = [...messages, ...this.messages].reverse();
        this.messages.sort((a, b) => {
          return b.when - a.when;
        });
        this.updateLatestSeen();
      });
    },

    formatTime(milliseconds) {
      const shift = new Date().getTimezoneOffset() * 60 * 1000;
      const localMilliseconds = milliseconds - shift;
      const s = Math.floor(localMilliseconds / 1000) % 60;
      const m = Math.floor(localMilliseconds / 60000) % 60;
      const h = Math.floor(localMilliseconds / 3600000) % 24;
      return `${h}:${leftPad(m)}:${leftPad(s)}`;
    },

    updateLatestSeen(delay) {
      if (isNaN(delay)) {
        delay = this.isDungeon ? 4000 : 10000;
      }
      this.scheduleCutoff(this.messages && this.messages[0] && this.messages[0].when || 0, delay);
      this.scrollToBottom();
    },

    getPlayerColor(name) {
      if (!this.colorCache[name]) {
        this.colorCache[name] = (name || "").toLowerCase().split("").reduce((acc, l) => acc + acc + l.charCodeAt(0), 0) % 360;
      }
      return this.colorCache[name];
    },

    onClick() {
      if (!this.persistent) {
        this.updateLatestSeen(0);
        ContentFrameService.triggerShowPanel("log");
      }
    }
  },

  computed: {
    sortedMessages() {
      if (this.persistent) {
        return [...this.messages].reverse();
      }
      return this.messages;
    }
  },

  template: `
<div class="game-chat" :class="{ persistent: persistent }">
    <div class="messages-container" ref="messagesContainer" @click="onClick()">
        <div v-for="message in sortedMessages" class="message-line" :class="{ visible: persistent || (message.when > timeCutoff), gone: !persistent && (message.when <= timeCutoffPermanent) }">  
            <span class="timestamp">[{{formatTime(message.when)}}]</span> <span class="author" v-show="message.who" :style="{ filter: 'hue-rotate(' + getPlayerColor(message.who) + 'deg) saturate(' + (getPlayerColor(message.who) % 5 + 1) + ')' }">{{message.who}}:</span> <span class="message-text" :class="[{ anon: !message.who }, 'level-' + message.level]" v-html="message.message"></span>
        </div>
    </div>
</div>
`
});

window.tutorialInstance = null;

let doneDynamicSteps = JSON.parse(localStorage.getItem("tutorialDoneDynamicSteps")) || {};
const step = JSON.parse(localStorage.getItem("tutorialStep")) || "welcome";

const questNotification = () => document.querySelector(".quest-notification");
const playerOnAQuest = questName => window.tutorialInstance.quests.find(q => q.title === questName);
const isQuestComplete = questName => playerOnAQuest(questName).completed;
const aFrameIsOpen = () => document.querySelector(".content-frame");
const nodeHasResource = resName => window.tutorialInstance.node.resources.find(r => r.name === resName);
const isObjectiveComplete = objectiveName => window.tutorialInstance.quests.find(q => q.objectives.some(o => o.label === objectiveName && +o.progress === +(o.target || 1)));
const isModalOpen = () => document.querySelector(".modal");
const isPanelOpened = type => document.querySelector(`.main-controls .btn.${type}.selected .icon`);
const isDoingAction = actionName => window.tutorialInstance.currentAction.actionName === actionName || window.tutorialInstance.currentAction.progress === 0;
const isOverburdened = () => window.tutorialInstance.inventory.weights.currentLevel >= 3;
const anyToolEquipped = () => window.tutorialInstance.equipment.find(s => s.slot === "Tool").item;
const researchMaterialsSelected = () => window.tutorialInstance.researchMaterials.length;
const hasItem = itemName => window.tutorialInstance.inventory.items.find(i => i.name === itemName);
const hasBuff = buff => document.querySelector(`.main-status .creature-effects .buff.${buff.replace(/ /g, ".")}`);

const foodName = "Bread Roll";

let dynamicSteps = [{
  selectors: [".quest-notification"],
  text: "You have a new quest notification, click here to open the quests panel",
  clickable: true,
  oneTimeDynamicStep: "questUpdate",
  condition: () => !aFrameIsOpen() && !isModalOpen()
}, {
  selectors: [".content-frame .quest"],
  text: "Here you can see a short summary of your quest",
  oneTimeDynamicStep: "questSummary"
}, {
  selectors: [".content-frame .quest .proceed"],
  text: 'Click "Proceed" to see the dialogue and finish the quest.',
  oneTimeDynamicStep: "completeQuest",
  clickable: true
}, {
  selectors: [".content-frame .quest .objective"],
  text: "You have a new quest! You can see the quest objectives here.",
  oneTimeDynamicStep: "newQuestWithObjectives",
  condition: () => {
    return document.querySelector(".content-frame .quest .info") && !isModalOpen();
  }
}, {
  selectors: [".content-frame .quest .info"],
  text: "Review the dialogue to learn more about the quest.",
  oneTimeDynamicStep: "checkQuestInfo",
  clickable: true,
  condition: () => {
    return !isModalOpen();
  }
}, {
  selectors: [".main-controls .btn.character"],
  text: "You can review your quest objectives at any time by selecting Character panel...",
  oneTimeDynamicStep: "howToSeeQuests1",
  condition: () => {
    return doneDynamicSteps["checkQuestInfo"] && !isModalOpen();
  }
}, {
  selectors: [".content-frame .tab-headers .tab-header.quests"],
  text: "... and then the Quests tab.",
  oneTimeDynamicStep: "howToSeeQuests2",
  condition: () => {
    return doneDynamicSteps["howToSeeQuests1"];
  }
}, {
  selectors: [".main-controls .btn.character"],
  text: `For now let's close this panel`,
  oneTimeDynamicStep: "howToSeeQuests3",
  clickable: true,
  condition: () => {
    return doneDynamicSteps["howToSeeQuests2"];
  }
}];

/******************** ACTION IN PROGRESS *********************/
dynamicSteps = dynamicSteps.concat([{
  selectors: [".main-status .current-action"],
  oneTimeDynamicStep: "actionIsInProgress1",
  text: `Your character is now performing the action. It will take some time. You can click the current action indicator to see the details.`,
  clickable: true,
  scrollIntoView: false,
  condition: () => {
    return !questNotification() && !isModalOpen() && !aFrameIsOpen() && !isDoingAction("Sleep");
  }
}, {
  selectors: [".modal .contents .estimate"],
  oneTimeDynamicStep: "actionIsInProgress2",
  text: `Here you can see the estimated time remaining for the action to complete. Consider signing up to Slack to get notifications when the action completes.`,
  scrollIntoView: false,
  condition: () => {
    return !questNotification() && !isDoingAction("Sleep");
  }
}]);

/************************* EATING QUEST ****************************/
const isOnHungerQuest = () => playerOnAQuest("Your needs");

dynamicSteps = dynamicSteps.concat([{
  selectors: [".main-status .creature-effects .buff.Hungry"],
  scrollIntoView: false,
  oneTimeDynamicStep: "questHungry1",
  text: `Your character is hungry...`,
  condition: () => {
    return !questNotification() && !aFrameIsOpen() && isOnHungerQuest() && !isModalOpen() && !isDoingAction("Eat");
  }
}, {
  selectors: [".main-status .buff.Sad"],
  scrollIntoView: false,
  oneTimeDynamicStep: "questHungry2",
  text: `... and that makes them slightly sad.`,
  condition: () => {
    return doneDynamicSteps["questHungry1"] && !questNotification() && !aFrameIsOpen() && isOnHungerQuest() && !isModalOpen() && !isDoingAction("Eat") && hasBuff("Slightly Sad");
  }
}, {
  selectors: [".main-controls .btn.items .icon"],
  scrollIntoView: false,
  clickable: true,
  text: `To fix this let's open your inventory.`,
  condition: () => {
    return !questNotification() && !aFrameIsOpen() && isOnHungerQuest() && !isModalOpen() && !isDoingAction("Eat") && !isQuestComplete("Your needs") && hasItem(foodName);
  }
}, {
  selectors: [".content-frame .item-list .item-icon.Bread.Roll .slot"],
  scrollIntoView: false,
  clickable: true,
  text: `Select the food that you received from Aymar...`,
  condition: () => {
    return !questNotification() && isOnHungerQuest() && !isModalOpen() && !isDoingAction("Eat") && !isQuestComplete("Your needs") && hasItem(foodName);
  }
}, {
  selectors: [".modal .action.Eat"],
  clickable: true,
  text: `... select the action to eat it ...`,
  condition: () => {
    return !questNotification() && isOnHungerQuest() && isModalOpen() && !isDoingAction("Eat") && !isQuestComplete("Your needs") && hasItem(foodName) && !document.querySelector('.action-modal [type="submit"]');
  }
}, {
  selectors: ['.action-modal [type="submit"]'],
  clickable: true,
  text: `... and confirm the action.`,
  condition: () => {
    return !questNotification() && isOnHungerQuest() && isModalOpen() && !isDoingAction("Eat") && !isQuestComplete("Your needs") && hasItem(foodName);
  }
}]);

/************************* GATHERING QUEST ****************************/
const gatherStonesObjective = "Collect 10 stones";
const gatherTwigsObjective = "Collect 10 twigs";
const canGetStonesForGatherQuest = () => !isObjectiveComplete(gatherStonesObjective) && nodeHasResource("Stones");
const canGetTwigsForGatherQuest = () => !isObjectiveComplete(gatherTwigsObjective) && nodeHasResource("Twigs");
const isOnLocationForGatherQuest = () => playerOnAQuest("Gather") && (canGetStonesForGatherQuest() || canGetTwigsForGatherQuest());
const needsToMoveForGatherQuest = () => playerOnAQuest("Gather") && (!isObjectiveComplete(gatherStonesObjective) && !nodeHasResource("Stones") || !isObjectiveComplete(gatherTwigsObjective) && !nodeHasResource("Twigs"));
const isTabSelected = tab => document.querySelector(`.content-frame .tab-headers .tab-header.${tab}.active`);

dynamicSteps = dynamicSteps.concat([{
  selectors: [".node-token.current:not(.selected) .click-trigger"],
  scrollIntoView: false,
  extraMargin: 0.3,
  text: `You now need to gather some resources. You can gather resources from your location or the neighbouring ones. For now - just select your current location.`,
  clickable: true,
  condition: () => {
    return !questNotification() && !aFrameIsOpen() && isOnLocationForGatherQuest() && !isModalOpen() && !isDoingAction("Gather");
  }
}, {
  selectors: [".node-token.current.showing-details .click-trigger"],
  scrollIntoView: false,
  extraMargin: 0.3,
  text: `With the location selected you can preview the creatures, structures and resources present here. Click again to show more details.`,
  clickable: true,
  condition: () => {
    return !questNotification() && !aFrameIsOpen() && isOnLocationForGatherQuest() && !isModalOpen() && !isDoingAction("Gather");
  }
}, {
  selectors: [".content-frame .tab-headers .tab-header.resources:not(.active)"],
  scrollIntoView: false,
  text: `Select the resources tab.`,
  clickable: true,
  condition: () => {
    return !questNotification() && aFrameIsOpen() && isOnLocationForGatherQuest() && !isModalOpen() && !isDoingAction("Gather");
  }
}, {
  selectors: [".content-frame .action"],
  oneTimeDynamicStep: "gatheringQuestShownTheResources",
  text: `And here you can start gathering the resources you require to complete the quest`,
  condition: () => {
    return !questNotification() && isTabSelected("resources") && isOnLocationForGatherQuest() && !isModalOpen() && !isDoingAction("Gather");
  }
}]);

/*********************** RESEARCH QUEST **********************/
dynamicSteps = dynamicSteps.concat([{
  selectors: [".main-controls .btn.craft .icon"],
  scrollIntoView: false,
  text: `To start a research, open the crafting section.`,
  clickable: true,
  condition: () => {
    return !questNotification() && playerOnAQuest("Research") && !isQuestComplete("Research") && !isDoingAction("Research") && !isModalOpen() && !isPanelOpened("craft");
  }
}, {
  selectors: [".content-frame .tab-headers .tab-header.research"],
  scrollIntoView: false,
  text: `Since you cannot craft anything yet, the only available section is Research. That's exactly what you need.`,
  oneTimeDynamicStep: "research2",
  condition: () => {
    return !questNotification() && playerOnAQuest("Research") && !isQuestComplete("Research") && !isDoingAction("Research") && !isModalOpen();
  }
}, {
  selectors: [".content-frame .tool-selector .selected-item .item-icon"],
  scrollIntoView: false,
  text: `The outcome of a research is based off the tool equipped and materials used. First, select a tool. A simple stone will do for now...`,
  clickable: true,
  oneTimeDynamicStep: "research3",
  condition: () => {
    return !questNotification() && playerOnAQuest("Research") && !anyToolEquipped() && !isQuestComplete("Research") && !isDoingAction("Research") && !isModalOpen();
  }
}, {
  selectors: [".content-frame .research-mats-list .research-material"],
  scrollIntoView: false,
  text: `... and then select an item, as a material. Again, select a Stone as it is all you need right now.`,
  clickable: true,
  oneTimeDynamicStep: "research4",
  condition: () => {
    return !questNotification() && playerOnAQuest("Research") && anyToolEquipped() && !isQuestComplete("Research") && !isDoingAction("Research") && !isModalOpen();
  }
}, {
  selectors: [".content-frame .action.Research"],
  scrollIntoView: false,
  text: `... and finally start the research. This will take just a few seconds.`,
  clickable: true,
  oneTimeDynamicStep: "research5",
  condition: () => {
    return !questNotification() && playerOnAQuest("Research") && anyToolEquipped() && researchMaterialsSelected() && !isQuestComplete("Research") && !isDoingAction("Research") && !isModalOpen();
  }
}]);

// equipping items
// explain hidden state

/********************* TRAVEL TO GET RESOURCES ***********************/
const needsToMoveToGather = () => needsToMoveForGatherQuest();

dynamicSteps = dynamicSteps.concat([{
  extraMargin: 0.05,
  selectors: ["body"],
  oneTimeDynamicStep: "moveToGetResources1",
  text: `Unfortunately the resources you need are not available in this location. To get them you will have to travel to another location.`,
  scrollIntoView: false,
  condition: () => {
    return !questNotification() && needsToMoveToGather() && !isModalOpen() && !isDoingAction("Travel") && !isOverburdened();
  }
}, {
  extraMargin: 0.05,
  selectors: ["body"],
  oneTimeDynamicStep: "moveToGetResources2",
  text: `Select one of the tiles, preferably one that has the resources you need, and double click it.`,
  scrollIntoView: false,
  condition: () => {
    return !questNotification() && needsToMoveToGather() && !isModalOpen() && !isDoingAction("Travel") && !isOverburdened();
  }
}, {
  extraMargin: 0.3,
  selectors: [".node-token.selected:not(.current)"],
  text: `With the location selected, click it the second time to view the location details.`,
  scrollIntoView: false,
  clickable: true,
  oneTimeDynamicStep: "moveToGetResources3",
  condition: () => {
    return !questNotification() && !aFrameIsOpen() && needsToMoveToGather() && !isModalOpen() && !isDoingAction("Travel") && !isOverburdened();
  }
}, {
  selectors: [".content-frame .action.Travel"],
  text: `Select the action to begin the journey.`,
  clickable: true,
  oneTimeDynamicStep: "moveToGetResources4",
  condition: () => {
    return !questNotification() && aFrameIsOpen() && needsToMoveToGather() && !isModalOpen() && !isDoingAction("Travel") && !isOverburdened();
  }
}, {
  selectors: ["body"],
  text: `You need to travel to find resources, but you are currently overburdened - which makes travel impossible.`,
  oneTimeDynamicStep: "overburden1",
  condition: () => {
    return needsToMoveToGather() && !isModalOpen() && isOverburdened();
  }
}, {
  selectors: [".main-controls .btn.items .icon"],
  text: `To resolve this problem open your inventory...`,
  clickable: true,
  oneTimeDynamicStep: "overburden2",
  condition: () => {
    return needsToMoveToGather() && !isModalOpen() && isOverburdened();
  }
}, {
  selectors: [".content-frame .item-list"],
  text: `... select one of the items and "Dump" a few of them on the ground.`,
  oneTimeDynamicStep: "overburden3",
  condition: () => {
    return document.querySelector(".tab-header.inventory.active") && needsToMoveToGather() && !isModalOpen() && isOverburdened();
  }
}]);

/***************** COMPONENTS *********************/
const triggerComponentInstance = new Promise(resolve => {
  Vue.component("tutorial-trigger", {
    data: () => ({
      step: null
    }),

    subscriptions() {
      return {
        tutorialArea: DataService$1.getIsTutorialAreaStream()
      };
    },

    mounted() {
      resolve(this);
    },

    methods: {
      continueTutorial() {
        ToastNotification.notify("Tutorial hints enabled");
        window.tutorialInstance.resumeTutorial();
      },

      setStep(step) {
        this.step = step;
      }
    },

    template: `
<div
    v-if="tutorialArea && (step === 'paused' || step === 'step10')"
    class="tutorial-trigger"
    @click="continueTutorial"
>
    <div class="icon"></div>
</div>
    `
  });
});

Vue.component("ui-tutorial", {
  data: () => ({
    step,
    explainerHighlight: null,
    explainerTextStyle: {},
    explainerTextShow: false,
    explainer: null
  }),

  mounted() {
    window.addEventListener("resize", () => this.updatePositioning());
    window.tutorialInstance = this;
  },

  subscriptions() {
    setInterval(() => this.checkNextDynamicStep(), 500);
    setInterval(() => this.saveTheProgress(), 2000);

    return {
      node: ServerService$1.getNodeStream(),
      currentAction: DataService$1.getCurrentActionStream(),
      equipment: DataService$1.getMyEquipmentStream(),
      inventory: DataService$1.getMyInventoryStream(),
      quests: DataService$1.getMyQuestsStream(),
      researchMaterials: DataService$1.getResearchMaterialsStream()
    };
  },

  methods: {
    checkNextDynamicStep() {
      if (this.step === "paused") {
        return;
      }
      this.nextExplainer = dynamicSteps.find(stepDef => {
        const element = document.querySelector(stepDef.selectors[0]);
        return !!element && (!stepDef.condition || stepDef.condition()) && (!stepDef.oneTimeDynamicStep || !doneDynamicSteps[stepDef.oneTimeDynamicStep]);
      });
      if (this.step === "dynamic") {
        if (this.explainer !== this.nextExplainer) {
          this.explainer = this.nextExplainer;
        }
      }
    },

    saveTheProgress() {
      localStorage.setItem("tutorialDoneDynamicSteps", JSON.stringify(doneDynamicSteps));
      localStorage.setItem("tutorialStep", JSON.stringify(this.step));
    },

    restart() {
      this.step = "welcome";
      doneDynamicSteps = {};
    },

    updatePositioning() {
      if (!this.explainer) {
        return;
      }
      let explainerHighlight = {
        right: Infinity,
        bottom: Infinity,
        top: Infinity,
        left: Infinity
      };
      this.explainer.selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) {
          setTimeout(() => {
            this.updatePositioning();
          }, 1000);
          return;
        }
        elements.forEach(element => {
          if (this.explainer.scrollIntoView !== false) {
            element.scrollIntoView();
          }
          const rect = element.getBoundingClientRect();
          const right = window.innerWidth - rect.left - rect.width;
          const bottom = window.innerHeight - rect.top - rect.height;
          explainerHighlight = {
            right: Math.min(explainerHighlight.right, right),
            bottom: Math.min(explainerHighlight.bottom, bottom),
            top: Math.min(explainerHighlight.top, rect.top),
            left: Math.min(explainerHighlight.left, rect.left)
          };
        });
      });
      if (explainerHighlight.top === Infinity) {
        this.explainerHighlight = null;
        return;
      }

      const width = window.innerWidth - explainerHighlight.left - explainerHighlight.right;
      const height = window.innerHeight - explainerHighlight.top - explainerHighlight.bottom;
      const margin = 5;
      const extraMarginLeftRight = (this.explainer.extraMargin || 0) * width;
      const extraMarginTopBottom = (this.explainer.extraMargin || 0) * height;

      const { left, top, bottom, right } = explainerHighlight;

      let targetLeft = `${left + width / 2}px`;
      this.explainerTextStyle = {
        top: `${window.innerHeight - bottom + (margin + extraMarginTopBottom) * 2}px`,
        left: targetLeft
      };
      this.explainerTextShow = false;
      setTimeout(() => {
        if (this.$refs.explainerText) {
          const rect = this.$refs.explainerText.getBoundingClientRect();
          if (rect.left < 0) {
            targetLeft = `${rect.width / 2}px`;
          } else if (rect.right > window.innerWidth) {
            targetLeft = `${window.innerWidth - rect.width / 2}px`;
          }
          if (rect.bottom <= window.innerHeight) {
            this.explainerTextShow = true;
            this.explainerTextStyle.left = targetLeft;
          } else {
            this.explainerTextStyle = {
              bottom: `${bottom + height + (margin + extraMarginTopBottom) * 2}px`,
              left: targetLeft
            };
            setTimeout(() => {
              if (this.$refs.explainerText) {
                const rect = this.$refs.explainerText.getBoundingClientRect();
                if (rect.top < 0) {
                  this.explainerTextStyle = {
                    bottom: `${2}px`,
                    left: `${2}px`,
                    "margin-left": "0"
                  };
                }
                this.explainerTextShow = true;
              }
            });
          }
        }
      });

      this.explainerHighlight = {
        right: explainerHighlight.right - margin - extraMarginLeftRight + "px",
        bottom: explainerHighlight.bottom - margin - extraMarginTopBottom + "px",
        top: explainerHighlight.top - margin - extraMarginTopBottom + "px",
        left: explainerHighlight.left - margin - extraMarginLeftRight + "px"
      };
    },

    resumeTutorial() {
      this.step = "dynamic";
      this.checkNextDynamicStep();
    },

    pauseTutorial() {
      ToastNotification.notify("Suspended tutorial hints");
      this.step = "paused";
    },

    toggleTutorial() {
      if (this.step === "dynamic") {
        this.step = "paused";
      } else {
        this.step = "dynamic";
        this.checkNextDynamicStep();
      }
    },

    clickedHighlight() {
      if (!this.explainer.clickable) {
        return;
      }
      this.nextStep();
      document.querySelector(this.explainer.selectors).click();
      this.explainer = null;
      setTimeout(() => this.checkNextDynamicStep());
    },

    nextStep() {
      if (this.explainer.oneTimeDynamicStep) {
        doneDynamicSteps[this.explainer.oneTimeDynamicStep] = true;
      }
      if (this.explainer.nextStep) {
        this.step = this.explainer.nextStep;
      }
    }
  },

  watch: {
    "explainer.selectors": {
      handler() {
        if (this.explainer && this.explainer.selectors) {
          this.updatePositioning();
        }
      },
      immediate: true
    },

    step: {
      handler() {
        this.explainer = null;

        triggerComponentInstance.then(i => i.setStep(this.step));

        const steps = [{
          selectors: [".main-status .player-avatar", ".main-status .current-action", ".main-status .creature-effects"],
          text: "Here you can see your character status at a glance"
        }, {
          selectors: [".main-status .current-action"],
          text: "What they currently are doing..."
        }, {
          selectors: [".main-status .creature-effects"],
          text: "... and the most important effects"
        }, {
          extraMargin: 0.3,
          selectors: [".node-token.current"],
          text: "Here you can see your current location, as indicated by the blue flag...",
          scrollIntoView: false
        }, {
          extraMargin: 0.05,
          selectors: [".node-token"],
          text: "... and the surrounding areas.",
          scrollIntoView: false
        }, {
          selectors: [".main-controls"],
          text: "The buttons open panels that provide you with essential information"
        }, {
          selectors: [".main-controls .btn.character .icon"],
          text: "The first one gives you access to your character statistics, skills and effects"
        }, {
          selectors: [".main-controls .btn.items .icon"],
          text: "Next you can access your inventory and equipment"
        }, {
          selectors: [".main-controls .btn.craft .icon"],
          text: "Here you can review crafting recipes and building plans, as well as try to discover new ones"
        }, {
          selectors: [".main-controls"],
          text: "Later in the game you may see additional buttons added that will give you access to new features"
        }, {
          selectors: [".tutorial-trigger"],
          text: `For now you may want to explore the interface on your own. When you're ready to continue simply click the question mark button`
        }];
        if (this.step.indexOf("step") === 0) {
          const stepNo = +this.step.replace("step", "");
          this.explainer = steps[stepNo];
          if (steps[stepNo + 1]) {
            this.explainer.nextStep = `step${stepNo + 1}`;
          } else {
            this.explainer.nextStep = `paused`;
          }
        }
      },
      immediate: true
    }
  },

  template: `
<div class="ui-tutorial">
    <div>
        <modal v-if="step === 'welcome'" @close="step = 'skip_tutorial'">
            <template slot="header">
                Welcome to Soulforged!
            </template>
            <template slot="main">
                <p>
                    Let me guide you through the basics of the UI.
                </p>
                <button @click="step = 'step0'">Let's do this</button>
                <button @click="step = 'skip_tutorial'" class="secondary">Skip tutorial</button>
            </template>
        </modal>
        <modal v-if="step === 'skip_tutorial'" :closeable="false">
            <template slot="header">
                Skip tutorial
            </template>
            <template slot="main">
                <p>
                    You can restart this tutorial at any point from character screen.
                </p>
                <button @click="step = 'paused'">Skip tutorial</button>
                <button @click="step = 'welcome'" class="secondary">Back to tutorial</button>
            </template>
        </modal>
    </div>
    <div class="explainer" v-if="explainer && explainerHighlight">
        <div class="explainer-highlight" :style="explainerHighlight" @click="clickedHighlight()" :class="{ interactable: explainer.clickable }"></div>
        <div class="explainer-text-box" :style="explainerTextStyle" ref="explainerText" :class="{ visible: explainerTextShow }">
            <div class="help-text">
                <div class="close" v-if="step === 'dynamic'" @click="pauseTutorial();"></div>
                {{explainer.text}}
            </div>
            <div class="action-call" v-if="!explainer.clickable">
                <button @click="nextStep()">Next</button>
            </div>
        </div>
        <div class="backdrop"></div>
    </div>
</div>
`
});

Vue.component("toggle-filter-button", {
  props: ["value"],

  data: () => ({
    on: false
  }),

  template: `
<div class="toggle-filter-button interactable" @click="on = !on;$emit('input', on)">
    <div class="icon">
    </div>
</div>
    `
});

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const weaponSkillLevelLabels = {
  0: "None",
  1: "Negligible",
  2: "Very Low",
  3: "Low",
  4: "Moderate",
  5: "High",
  6: "Very High",
  7: "Tremendous",
  8: "Massive",
  9: "Gigantic",
  10: "Extreme"
};

Vue.component("buff-value", {
  props: {
    buff: Object
  },

  computed: {
    rawNumberValue() {
      let result;
      if (this.buff && typeof this.buff === "object") {
        result = this.buff.value;
      } else {
        result = this.buff;
      }
      return Utils$1.decimalTwo(result);
    },
    displayValue() {
      return Utils$1.formatEffectValue(this.buff, this.rawNumberValue);
    },
    isPositive() {
      let check = this.rawNumberValue;
      if (this.buff.multiplier) {
        check -= 100;
      }
      if (this.buff.negative) {
        return check < 0;
      }
      return check > 0;
    },
    isNegative() {
      let check = this.rawNumberValue;
      if (this.buff.multiplier) {
        check -= 100;
      }
      if (this.buff.negative) {
        return check > 0;
      }
      return check < 0;
    }
  },

  template: `
<span :class="{ positive: isPositive, negative: isNegative }" v-if="!buff.discrete">{{displayValue}}</span>
`
});

Vue.component("item-icon", {
  props: {
    src: String,
    name: {
      type: String
    },
    qty: {
      default: 1
    },
    level: {
      type: Number
    },
    integrity: {
      default: 100
    },
    integrityType: "",
    size: {
      type: String,
      default: "normal"
    },
    trinket: {
      type: Array,
      default: null
    },
    details: {
      type: Object,
      default: null
    },
    border: {
      default: 1
    },
    alwaysShowQty: {}
  },

  data: () => ({
    showDialog: false
  }),

  computed: {
    stringQty() {
      return typeof this.qty === "string";
    },
    isSplitQty() {
      return typeof this.qty === "string" && this.qty.includes("/");
    },
    splitQty() {
      return this.qty.split("/").map(v => +v);
    },

    detailsTransformed() {
      const result = this.details;
      if (this.details && this.details.weight && typeof this.details.weight === "number") {
        result.weight = {
          single: this.details.weight,
          total: this.qty * this.details.weight
        };
      }
      return result;
    },

    finalIntegrityClass() {
      return Utils$1.getIntegrityClass(this.integrity);
    },

    trinketProps() {
      if (!this.trinket && this.name) {
        if (this.name.indexOf("Research Concept") >= 0) {
          return [{
            stat: this.name.replace(/.*Research Concept: /, "")
          }];
        }
        return null;
      }
      return this.trinket;
    },

    adjustedQty() {
      return Utils$1.formatNumber(Math.round(this.qty));
    },

    borderClass() {
      return `border-${this.border}`;
    }
  },

  methods: {
    onClick($event) {
      if (this.details) {
        this.showDialog = true;
      } else {
        this.$emit("click", $event);
      }
    }
  },

  template: `
<div>
    <div class="item-icon" :class="[ name, { interactable: $listeners.click || details }, size, borderClass ]">
        <div class="border"></div>
        <div class="slot" @click="onClick">
            <div class="img-bg"></div>
            <div class="img" :style="src && { 'background-image': 'url(' + src + ')' }"></div>
            <span class="qty" :class="{ limit: splitQty[0] > splitQty[1] }" v-if="isSplitQty">{{splitQty[0]}} <span class="secondary">/ {{splitQty[1]}}</span></span>
            <span class="qty" v-else-if="stringQty">{{qty}}</span>
            <span class="qty" v-else-if="alwaysShowQty || (qty && qty > 1) || qty === 0">{{adjustedQty}}</span>
            <span class="level" v-if="level && size !== 'tiny'">{{level}}%</span>
            <span class="integrity" v-if="finalIntegrityClass" :class="[finalIntegrityClass, integrityType]"></span>
            <span class="trinket" v-if="trinketProps">
                <div v-for="buff in trinketProps" class="trinket-props">
                    <div class="skill">{{buff.stat}}</div> <div class="value">{{buff.value}}</div>
                </div>
            </span>
        </div>
    </div>
    <modal v-if="details && showDialog" @close="showDialog = false;" class="item-modal">
        <template slot="header">{{details.name}} <span v-if="details.qty">({{details.qty}})</span></template>
        <template slot="main">
            <item-properties :data="detailsTransformed"></item-properties>
        </template>
    </modal>
</div>
    `
});

Vue.component("item-properties", {
  props: ["data"],

  data: () => ({
    weaponSkillLevelLabels
  }),

  computed: {
    properties() {
      return this.data && this.data.properties || {};
    },
    utility() {
      return this.properties.utility;
    },
    utilityDescription() {
      return Object.keys(this.utility).map(tool => `${tool[0].toUpperCase()}${tool.slice(1)} (${Utils$1.decimalTwo(100 * this.utility[tool])}% action speed)`);
    },
    damage() {
      return this.properties && this.properties.damage || this.data && this.data.damage;
    },
    armor() {
      return this.properties && this.properties.armor;
    },
    hitChance() {
      return this.properties && this.properties.hitChance || this.data && this.data.hitChance;
    },
    buffs() {
      if (!this.data || !this.data.buffs) {
        return null;
      }
      return Object.values(this.data.buffs).map(item => _extends$1({}, item, {
        stat: Utils$1.ucfirst(item.stat)
      }));
    },
    expiresInFormatted() {
      if (!this.data.expiresIn) {
        return undefined;
      }
      if (this.data.expiresIn.length <= 1) {
        return null;
      }
      if (this.data.expiresIn[0] === 0) {
        return `Less than ${Utils$1.formatTime(this.data.expiresIn[1] * 60, 2)}`;
      }
      return this.data.expiresIn.map(minutes => Utils$1.formatTime(minutes * 60, 2)).join(" ~ ");
    },
    integrityDisplay() {
      return this.data.integrity && Array.isArray(this.data.integrity) && this.data.integrity.map(value => `${value}%`).join(" ~ ");
    },
    finalIntegrityClass() {
      return Utils$1.getIntegrityClass(this.data.integrity);
    }
  },

  methods: {
    formatTime: Utils$1.formatTime,

    diminishingReturnDisplay: diminishingReturns => {
      if (!diminishingReturns) {
        return "";
      }
      let result = diminishingReturns[0] * 100 + "%";
      if (diminishingReturns[0] !== diminishingReturns[1]) {
        result += " - " + diminishingReturns[1] * 100 + "%";
      }
      return result;
    }
  },

  template: `
<div class="item-properties html">
    <div v-if="integrityDisplay === '0%'">
        <span class="property no-colon red">Unusable</span>
    </div>
    <div v-if="data.integrity">
        <span class="property">{{'Condition'}}</span>
        <span class="value">
            {{integrityDisplay}}
        </span>
        <span class="integrity-icon" :class="[finalIntegrityClass, data.integrityType ]"></span>
    </div>
    <div v-if="expiresInFormatted">
        <span class="property">Expires in</span>
        <span class="value" v-if="expiresInFormatted">
            {{expiresInFormatted}}
        </span>
    </div>
    <div v-if="data && data.weight">
        <span class="property">Weight</span>
        <span class="value">
            {{data.weight.single}}kg <span v-if="data.weight.total">({{Math.round(+data.weight.total * 100) / 100}}kg)</span>
        </span>
    </div>
    <div v-if="data && data.container">
        <span class="property">Container</span>
        <span class="value">
            {{data.container}}
        </span>
    </div>
    <div v-if="properties.nutrition">
        <span class="property">Nutrition</span><span class="value">{{properties.nutrition}}</span>
    </div>
    <div v-if="buffs && buffs.length">
        <span class="property">Effects</span>
        <div v-for="buff in buffs" v-if="buff && buff.value">
            <div v-if="typeof buff.value === 'number'" class="value">
                {{buff.stat}}<span v-if="!buff.discrete">:</span> <buff-value :buff="buff" /> <span v-if="buff.duration">({{formatTime(buff.duration)}})</span>
            </div>
            <div v-else-if="typeof buff.value === 'boolean' && buff.value" class="value">
                {{buff.stat}} ({{formatTime(buff.duration)}})
            </div>
        </div>
        <div v-if="data.properties.diminishingReturn || data.properties.diminishingReturn === 0">Stacking coefficient: <span class="value">{{diminishingReturnDisplay(data.properties.diminishingReturn)}}</span></div>
    </div>
    <div v-if="damage">
        <div>
            <span class="property">Skill</span><span class="value">{{properties.weaponSkill}}</span>
        </div>
        <div>
            <span class="property">Hit chance</span><span class="value">{{hitChance}}%</span>
        </div>
        <div class="property">Damage</div>
        <div class="value" v-for="(value, type) in damage">
            {{type}}: <decimal-secondary :value="value" /></span>
        </div>
        <div>
            <span class="property">Skill impact</span><span class="value">{{weaponSkillLevelLabels[properties.weaponSkillLevel]}}</span>
        </div>
    </div>
    <div v-if="utility" class="clear-both">
        <span class="property">Tool</span>
        <div class="value" v-for="util in utilityDescription">
            {{util}}
        </div>
    </div>
</div>
    `
});

Vue.component("item", {
  props: {
    data: {},
    small: {
      default: false
    },
    interactable: {
      default: true
    },
    border: {}
  },

  data: () => ({
    showDialog: false
  }),

  subscriptions() {
    return {
      crafting: this.stream("showDialog").switchMap(showDialog => showDialog ? Rx.Observable.combineLatest(this.$watchAsObservable("data", { immediate: true }).pluck("newValue"), DataService$1.getMyRecipesStream()) : Rx.Observable.empty()).map(([item, recipes]) => recipes.filter(recipe => {
        return recipe && recipe.materials.some(material => {
          return item && material.item && material.item.itemCode === item.itemCode;
        });
      }))
    };
  },

  methods: {
    onClick(event) {
      if (this.interactable) {
        this.showDialog = true;
      } else {
        this.$emit("click", event);
      }
    }
  },

  computed: {
    trinketInfo() {
      if (this.data && this.data.houseDecoration) {
        return this.data.buffs;
      }
    }
  },

  template: `
<div>
    <item-icon
        :src="data && data.icon"
        :qty="data && data.qty"
        :integrity="data && data.integrity"
        :integrity-type="data.integrityType"
        :small="small"
        :trinket="trinketInfo"
        :border="border"
        :name="data && data.name"
        @click="onClick"
    ></item-icon>
    <modal v-if="data && showDialog" @close="showDialog = false;" class="item-modal">
        <template slot="header"><entity-name :entity="data" :editable="true" /> <span v-if="data.qty">({{data.qty}})</span></template>
        <template slot="main">
            <div class="main-icon">
                <item-icon :src="data && data.icon" />
            </div>
            <item-properties :data="data"></item-properties>
            <div v-if="crafting && crafting.length">
                Craft:
                <div class="item-craft-recipes">
                    <div v-for="recipe in crafting" class="item-craft-recipe">
                        <actions
                            :target="recipe"
                            id="Craft"
                            @action="showDialog = false;" 
                        >
                            <template slot="Craft">
                                <item-icon :src="recipe.icon" :name="recipe.name"></item-icon>
                            </template>
                        </actions>
                    </div>
                </div>
            </div>
            <actions
                class="actions"
                :target="data"
                :icon="true"
                @action="showDialog = false"
            />
        </template>
    </modal>
</div>
    `
});

Vue.component("inventory", {
  props: ["data", "slots", "type", "filter"],

  data: () => ({
    nameFilter: ""
  }),

  subscriptions() {
    return {
      borders: this.stream("type").switchMap(type => type === "player" ? DataService$1.getMyEquipmentStream() : DataService$1.getMyFurnitureStream()).map(items => {
        if (!items) {
          return {};
        }
        const temp = {};
        const result = {};
        items.forEach(slot => {
          if (slot.item) {
            temp[slot.item.id] = temp[slot.item.id] || {};
            const value = Utils$1.equipmentSlotBorder(slot.slot || slot.slotType);
            value.split(" ").forEach(i => {
              temp[slot.item.id][i] = true;
            });
            result[slot.item.id] = Object.keys(temp[slot.item.id]).join(" ");
          }
        });
        return result;
      })
    };
  },

  computed: {
    sorted() {
      return this.data.slice(0).sort(Utils$1.itemsSorter);
    }
  },

  methods: {
    filtered(item) {
      return !this.filter || this.filter(item);
    }
  },

  template: `
<div>
    <div class="item-list" v-if="data">
        <item
            v-for="(item, idx) in sorted"
            :data="item"
            :key="'i' + item.id"
            :border="borders && borders[item.id]"
            v-if="filtered(item)"
        />
<!--
    <div v-for="(item, idx) in sorted">
        <div style="display: flex;">
            <item :data="item" :key="'i' + item.id" :border="borders && borders[item.id]" v-if="filtered(item)"></item>
            {{item.name}}
        </div>
    </div>
-->
    </div>
</div>
    `
});

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("creature-effects", {
  props: {
    creature: null,
    size: {
      default: "normal"
    },
    onlyIcons: Boolean,
    onlyHighSev: Boolean,
    publicOnly: Boolean,
    primaryOnly: Boolean,
    effectsFilter: {
      default: () => () => true
    }
  },

  data: () => ({}),

  subscriptions() {
    const creatureStream = this.stream("creature").filter(c => !!c);

    return {
      buffs: creatureStream.filter(player => !!player.buffs).map(player => player.buffs.map(buff => _extends$2({}, buff, {
        duration: buff.duration && this.formatDuration(buff.duration),
        effectsText: Utils$1.getEffectsText(buff)
      })).sort(Utils$1.buffSorter))
    };
  },

  methods: {
    ucfirst: Utils$1.ucfirst,
    formatTime: Utils$1.formatTime,

    buffClick(buff) {
      this.$emit("click", buff);
    },

    formatDuration(duration) {
      if (duration && typeof duration === "string") {
        return duration;
      }
      if (!duration.min && !duration.max) {
        return null;
      }
      const min = Utils$1.formatTime(duration.min, 2);
      const max = Utils$1.formatTime(duration.max, 2);
      if (min === max) {
        return min;
      }
      return `${min} ~ ${max}`;
    }
  },

  template: `
<div class="creature-effects" :class="{ 'only-icons': onlyIcons }" v-if="creature">
    <section v-if="buffs && buffs.length">
        <div
            v-for="buff in buffs"
            v-if="(!onlyHighSev || buff.severity) && (!publicOnly || buff.public) && (!primaryOnly || !buff.secondary) && effectsFilter(buff)"
            class="buff"
            :class="[ buff.name, 'severity-' + buff.severity, { 'list-item-with-props': !onlyIcons }]"
            @click="buffClick(buff)"
        >
            <div class="main-icon">
                <item-icon :size="size" :src="buff.icon" :qty="buff.stacked" :level="buff.level"></item-icon>
            </div>
            <div class="details" v-if="!onlyIcons">
                <div class="label">
                    {{buff.name}} <template v-if="buff.duration" class="nowrap">({{buff.duration}})</template>
                </div>
                <div class="description help-text">
                    {{buff.effectsText}}
                </div>
            </div>
        </div>        
    </section>
</div>
    `
});

Vue.component("entity-name-voting", {
  props: ["voteKey"],

  data: () => ({
    preferredName: ""
  }),

  subscriptions() {
    return {
      nameVotes: this.stream("voteKey").switchMap(voteKey => Rx.Observable.fromPromise(ServerService.request("get-vote-name-preferences", { key: voteKey }))).do(preferences => {
        this.preferredName = preferences.playerOwnPreference || "";
      })
    };
  },

  methods: {
    confirm() {
      ServerService.request("set-vote-name", {
        key: this.voteKey,
        name: this.preferredName
      }).then(response => {
        if (response === true) {
          this.$emit("close");
        } else {
          ToastNotification.notify(response);
        }
      });
    }
  },

  computed: {
    hasVotes() {
      return this.nameVotes.counts && Object.keys(this.nameVotes.counts).length;
    }
  },

  created() {
    this.preferredName = "";
  },

  template: `
<form v-if="nameVotes">
    <div class="help-text">
        <div v-if="hasVotes" class="names-ranking">
            <div>Names ranking:</div>
            <div v-for="(count, option) in nameVotes.counts" class="name-option">
                <input readonly :value="option" @click="preferredName = option" style="cursor: pointer;" /> <span class="points">{{count}} points</span>
            </div>
        </div>
        <div v-else>
            You are the first person to be naming it!
        </div>
        <div>Provide your preferred name:</div>
        <input v-model="preferredName" class="player-input"><br/>
        <br/>
    </div>
    <button type="submit" @click.prevent="confirm();">Confirm</button>
</form>
    `
});

Vue.component("entity-name", {
  props: ["entity", "editable"],

  data: () => ({
    voting: false
  }),

  subscriptions() {
    return {
      description: this.stream("voting").switchMap(voting => voting ? ServerService.getInfo("entity-description", {
        entityKey: this.entity.nameable
      }) : Rx.Observable.of(""))
    };
  },

  methods: {
    startVoting() {
      if (this.reallyEditable) {
        this.voting = true;
      }
    }
  },

  computed: {
    reallyEditable() {
      return this.editable && this.entity.nameable;
    },

    unnamed() {
      return !this.entity.name || this.entity.name === "Unnamed";
    },

    displayName() {
      return this.entity.name || "Unnamed";
    }
  },

  template: `
<span class="entity-name" :class="{ unnamed: unnamed, editable: reallyEditable }">
    <span @click="startVoting">
        <span class="name">{{displayName}}</span>
        <div v-if="reallyEditable" class="edit-icon" />
    </span>
    <modal v-if="voting" @close="voting = false">
        <div slot="header">
            Vote name
        </div>
        <div slot="main">
            <div class="main">
                <div class="main-icon">
                    <item-icon size="large" :src="entity.icon" />
                </div>
                <div class="item-properties html">
                    {{description}}
                </div>
            </div>
            <entity-name-voting @close="voting = false" :vote-key="entity.nameable" />
        </div>    
    </modal>
</span>
    `
});

Vue.component("threat-level-indicator", {
    props: ["threatLevel", "noLabel", "friendly", "hostile"],

    computed: {
        threatLevelFormatted() {
            return this.threatLevel ? Utils$1.formatNumber(this.threatLevel) : "";
        }
    },

    template: `
<div
    class="threat-level-indicator"
    :class="{ hostile: hostile, friendly: friendly, unknown: (!friendly && !hostile) }"
    v-if="false && (threatLevel || (!friendly && !hostile) || hostile)"
>
    <div class="icon"></div>
    <div class="label" v-if="!noLabel">Threat</div>
    <div class="level">
        <div v-if="!threatLevel">??</div>
        <div v-else>{{threatLevelFormatted}}</div>
<!--        <decimal-secondary v-else :value="threatLevelFormatted" />-->
    </div>
    <div class="right"></div>
</div>
`
});

const animRegister = [];
const registerAnimatedIcon = vm => {
    animRegister.push(vm);
};
const deregisterAnimatedIcon = vm => {
    const idx = animRegister.indexOf(vm);
    if (idx !== -1) {
        animRegister.splice(idx, 1);
    }
};
setInterval(() => {
    animRegister.forEach(vm => vm.flip());
}, 1500);

Vue.component("creature-icon", {
    props: {
        creature: null,
        withTracks: {
            default: false
        },
        size: {
            default: "normal"
        }
    },

    data: () => ({
        frame: 0
    }),

    created() {
        registerAnimatedIcon(this);
    },

    destroyed() {
        deregisterAnimatedIcon(this);
    },

    methods: {
        flip() {
            if (this.withTracks && this.creature.unknown) {
                this.frame = (this.frame + 1) % (this.creature.tracks.length + 1);
            }
        }
    },

    template: `
<div class="creature-wrapper" :class="[size, { dead: creature.dead, hostile: creature.hostile, friendly: creature.friendly, self: creature.self }]" v-if="creature">
    <div class="main-icon">
        <div class="avatar-icon">
            <div class="border"></div>
            <div v-if="!creature.looks" class="img" :style="creature.icon && { 'background-image': 'url(' + creature.icon + ')' }"></div>
            <player-avatar v-else
                class="creature-avatar"
                :hair-color="creature.looks.hairColor"
                :hair-color-grayness="creature.looks.hairColorGrayness"
                :skin-color="creature.looks.skinColor"
                :hair-style="creature.looks.hairStyle"
                :head-only="true"
                :size="size"
                :creature="creature"
            />
            <div
                v-for="(trackIcon, idx) in creature.tracks"
                v-if="creature.unknown && withTracks"
                class="track"
                :class="{ shown: idx === frame }"
                :style="{ 'background-image': 'url(' + trackIcon + ')' }" 
            />
        </div>
    </div>
</div>
    `
});

Vue.component("creature-list-item", {
    props: {
        creature: Object,
        includeActions: {
            type: Boolean,
            default: true
        },
        effectsFilter: {
            default: () => () => true
        }
    },

    data: () => ({
        showDetails: false
    }),

    subscriptions() {
        return {
            myself: DataService$1.getMyCreatureStream(),
            excludedActions: DataService$1.getIsTutorialAreaStream().map(tutorialArea => tutorialArea ? ["Trade"] : []).startWith([])
        };
    },

    methods: {
        equipmentSlotBorder: Utils$1.equipmentSlotBorder,

        onAction(actionId) {
            if (actionId === "Trade") {
                setTimeout(() => {
                    // to give time for the modal to close
                    ContentFrameService.triggerShowPanel("activeTrades");
                });
            }
        },

        onClick() {
            if (this.includeActions) {
                this.showDetails = true;
                ServerService$1.request("creature-details", this.creature.id);
            }
        },

        closeDetails() {
            this.showDetails = false;
            ServerService$1.request("creature-details", null);
        }
    },

    template: `
<div class="list-item-with-props creature-list-item" v-if="creature">
    <div @click="onClick()" :class="{ interactable: includeActions }" class="creature-short-display">
        <div class="main-icon">
            <creature-icon :creature="creature" size="normal"></creature-icon>
        </div>
        <div class="details">
            <div class="label" :class="[{ player: creature.isPlayer, self: creature.self }, creature.relationship]">
                <div class="nowrap"><entity-name :entity="creature" /></div>
            </div>
            <div class="item-list">
                <current-action v-if="creature.self" class="creature-list" />
                <div v-else class="current-action creature-list">
                    <div class="current-action-wrapper">
                        <div class="mid-cover">
                            <img v-if="creature.currentAction && creature.currentAction.icon" :src="creature.currentAction.icon" class="icon" />
                        </div>
                        <div class="border"></div>
                    </div>
                </div>
                <div class="creature-effects-wrapper">
                    <creature-effects
                        class="creature-list-effects"
                        :creature="creature"
                        :only-icons="true"
                        :public-only="true"
                        :primary-only="true"
                        :effects-filter="effectsFilter"
                        size="tiny"
                    />
                </div>
            </div>
        </div>
        <threat-level-indicator :threat-level="creature.threatLevel" :no-label="true" :friendly="creature.friendly" :hostile="creature.hostile" />
    </div>
    <div class="controls">
        <slot></slot>
        <actions
            v-if="includeActions && creature && myself && creature.id !== myself.id"
            @action="onAction($event)"
            :icon="true"
            :text="false"
            :target="creature"
            :exclude="excludedActions"
        />
    </div>
    <modal v-if="showDetails" @close="closeDetails()" class="creature-details-modal">
        <template slot="header">
            <entity-name :entity="creature" :editable="true" /> 
            <span v-if="creature.isPlayer">(Soul)</span> 
            <span v-if="creature.dead">(Dead)</span>
        </template>
        <template slot="main">
            <div class="main-section">
                <creature-icon :creature="creature" size="large" />
                <!--<creature-effects :creature="creature" />-->
                <div class="creature-info">
                    <div class="currentAction" v-if="creature.currentAction && creature.currentAction.name">
                        <div class="help-text">Action</div>                       
                        <div class="value-text">
                            <current-action :pass-current-action="creature.currentAction" :interactable="false" class="creature-list" />
                            <span> {{creature.currentAction.name}}</span>
                            <span v-if="creature.currentAction.targetName">&nbsp;- {{creature.currentAction.actionTargetName}}</span>
                            <span>&nbsp;({{creature.currentAction.progress}}%)</span>
                        </div>
                    </div>
                    <div class="equipment-display" v-if="creature.equipment">
                        <div class="help-text">Equipment</div>
                        <div class="equipment-list">
                            <item-icon v-for="(eq, slot) in creature.equipment" :key="slot" :src="eq" :border="equipmentSlotBorder(slot)" />
                        </div>
                    </div>
                    <div v-if="creature.bondLevel">
                        <div class="help-text">
                            Bond level: <span class="bond-level">{{creature.bondLevel}}</span>
                        </div>
                    </div>
                    <div class="trainings-display" v-if="creature.trainings && creature.trainings.length">
                        <div class="help-text">Training</div>
                        <div v-for="training in creature.trainings" class="training-container">
                            <div class="training-name value-text">{{training.name}}</div>
                            <help-icon :title="training.name">
                                {{training.description}}
                            </help-icon>
                        </div>
                    </div>
                    <div class="help-text" v-if="creature.buffs && creature.buffs.length">Effects</div>
                    <creature-effects :creature="creature" :public-only="true" />
                </div>
            </div>
            <section v-if="creature.isPlayer && myself.id !== creature.id">
                <header>Relationship</header>
                <relationship-picker :creature="creature" />
            </section>

            <actions
                class="actions"
                @action="closeDetails();onAction($event);"
                :icon="true"
                :exclude="['Sleep', 'Fight', 'Research', ...excludedActions]"
                :target="creature"
            />
        </template>
    </modal>
</div>
    `
});

const SELF_DOWN = ["Store", "Dump"];
const SELF_UP = ["Pick up", "Take"];
const HOME_DOWN = ["Take", "Dump "];
const HOME_UP = ["Store"];

Vue.component("carry-capacity-predictor", {
  props: {
    action: null,
    target: null,
    qty: 0
  },

  subscriptions() {
    const actionStream = this.stream("action");
    const selfDownStream = actionStream.map(action => action && SELF_DOWN.includes(action.name));
    const selfUpStream = actionStream.map(action => action && SELF_UP.includes(action.name));
    const homeDownStream = actionStream.map(action => action && HOME_DOWN.includes(action.name));
    const homeUpStream = actionStream.map(action => action && HOME_UP.includes(action.name));
    const anySelf = Rx.Observable.combineLatest([selfDownStream, selfUpStream]).map(values => values.reduce((acc, v) => v || acc, false));
    const anyHome = Rx.Observable.combineLatest([homeDownStream, homeUpStream]).map(values => values.reduce((acc, v) => v || acc, false));
    return {
      inventory: anySelf.switchMap(any => any ? DataService$1.getMyInventoryStream() : Rx.Observable.of(null)),
      homeInventory: anyHome.switchMap(any => any ? DataService$1.getMyHomeInventoryStream() : Rx.Observable.of(null)),
      selfDown: selfDownStream,
      selfUp: selfUpStream,
      homeDown: homeDownStream,
      homeUp: homeUpStream
    };
  },

  computed: {
    totalWeight() {
      return this.qty * (this.target && this.target.weight.single);
    }
  },

  template: `
<div class="carry-capacity-predictor" v-if="inventory || homeInventory">
    <div class="predictor-side" v-if="inventory">
        <label>Inventory</label>
        <carry-capacity-indicator
            v-if="inventory && selfUp"
            :current="inventory.weights.currentWeight + totalWeight"
            :thresholds="inventory.weights.thresholds"
        />
        <carry-capacity-indicator
            v-if="inventory && selfDown"
            :current="inventory.weights.currentWeight - totalWeight"
            :thresholds="inventory.weights.thresholds"
        />
    </div>
    <div class="arrow arrow-right" v-if="selfDown && homeUp"></div>
    <div class="arrow arrow-left" v-if="selfUp && homeDown"></div>
    <div class="predictor-side" v-if="homeInventory">
        <label>Storage</label>
        <carry-capacity-indicator
            v-if="homeInventory && homeUp"
            :current="homeInventory.weight + totalWeight"
            :max="homeInventory.weightLimit"
        />
        <carry-capacity-indicator
            v-if="homeInventory && homeDown"
            :current="homeInventory.weight - totalWeight"
            :max="homeInventory.weightLimit"
        />
    </div>
    <div class="arrow arrow-right" v-if="(selfDown && !homeUp) || (!selfUp && homeDown)"></div>
</div>
    `
});

Vue.component("loader-button", {
  props: ["promise"],

  data: () => ({
    promiseUnresolved: false
  }),

  watch: {
    promise(value) {
      if (value && value.then) {
        this.promiseUnresolved = true;
        value.then(() => {
          this.promiseUnresolved = false;
        }).catch(() => {
          this.promiseUnresolved = false;
        });
      }
    }
  },

  template: `
<button class="loader-button" type="submit" @click.prevent="$emit('click', $event)" :class="{ loading: promiseUnresolved }">
    <div class="loader-button-overlay"></div>
    <div class="loader-button-overlay-icon"></div>
    <div class="loader-button-content"><slot></slot></div>
</button>
    `
});

const DEFAULT_REPETITIONS = 20;

const actionHintsName = {
  Flee: {
    label: "Fleeing",
    text: `While fleeing, your character will not retaliate to any attacks made, but has a very high chance of avoiding getting hit.`
  }
};
const actionHintsId = {
  Duel: {
    label: "Dueling",
    text: `Dueling enables you to fight other players, provided they accept the duel request.<br/>Once duel is started, it'll only end if both parties select to finish the duel.`
  }
};

function matchCurrentAction(targetStream) {
  return Rx.Observable.combineLatest([DataService$1.getCurrentActionStream(), targetStream]).map(([currentAction, target]) => target && currentAction && currentAction.entityId === target.id && target.actions && target.actions.find(a => a.id === currentAction.actionId));
}

Vue.component("confirm-with-wakeup-warning", {
  props: ["action", "promise"],

  data: () => ({
    confirmWakeUp: false
  }),

  subscriptions() {
    const currentActionStream = DataService$1.getCurrentActionStream();
    return {
      currentAction: currentActionStream
    };
  },

  computed: {
    resting() {
      return Utils$1.isDeepSleep(this.currentAction) && (!this.action || !this.action.quick);
    }
  },

  methods: {
    formatTimeAgo: Utils$1.formatTimeAgo,

    wakeUpAndWork() {
      this.confirmWakeUp = false;
      setTimeout(() => {
        this.$emit("action");
      });
    }
  },

  template: `
<div>
    <button type="submit" v-if="resting" @click.prevent="confirmWakeUp = true;">Confirm</button>
    <loader-button v-else :promise="promise" @click.prevent="wakeUpAndWork();">Confirm</loader-button>
    <modal v-if="confirmWakeUp" @close="confirmWakeUp = false;">
        <template slot="header">
            Wake up
        </template>
        <template slot="main">
            <form>
                <div class="help-text">You are in deep sleep and not fully rested yet. Are you sure you want to wake up now?</div>
                <hr/>
                <div v-if="currentAction.ETA" class="help-text">
                    <span class="label">Estimated time till fully rested:</span> <span class="no-wrap">{{formatTimeAgo(currentAction.ETA)}}</span>
                </div>
                <button type="submit" @click.prevent="wakeUpAndWork();" class="secondary">Wake up</button>
                <button type="submit" @click.prevent="confirmWakeUp = false;">Keep resting</button>
            </form>
        </template>
    </modal>
</div>
    `
});

Vue.component("recipe-diagram", {
  props: {
    recipe: null,
    repetitions: null
  },

  subscriptions() {
    return {
      availableItemsCounts: DataService$1.getAvailableItemsCountsStream().startWith({})
    };
  },

  methods: {
    resultQty(result) {
      const qty = this.recipe.materials.reduce((acc, m) => {
        if (m.item.itemCode === result.item.itemCode) {
          return m.qty;
        }
        return acc;
      }, 0);
      const repetitions = this.repetitions || 1;
      return result.qty * repetitions - (repetitions - 1) * qty;
    },
    materialQty(material) {
      const qty = this.recipe.results.reduce((acc, t) => {
        if (t.item.itemCode === material.item.itemCode) {
          return t.qty;
        }
        return acc;
      }, 0);
      const repetitions = this.repetitions || 1;
      // recipe.results
      return material.qty * repetitions - (repetitions - 1) * qty;
    },
    materialDisplay(material) {
      let result = this.materialQty(material);
      if (this.repetitions) {
        result += "/" + (this.availableItemsCounts[material.item.itemCode] || 0);
      }
      return result;
    }
  },

  template: `
<div class="recipe-diagram">
    <item-icon v-for="material in recipe.materials" :key="material.item.id" :details="material.item" :src="material.item.icon" :qty="materialDisplay(material)" :always-show-qty="true" />
    <div class="arrow"></div>
    <item-icon v-for="result in recipe.results" :key="result.item.id" :details="result.item" :src="result.item.icon" :qty="resultQty(result)" :always-show-qty="true" />
</div>    
    `
});

Vue.component("action-blocked-info", {
  props: {
    action: null
  },

  template: `
<div v-if="!action.available" class="help-text">
    <span class="error">Blocked: </span>{{action.message}}
</div>
    `
});

Vue.component("difficulty-indicator", {
  props: {
    action: null
  },

  template: `
<div class="help-text" v-if="action.difficulty">
    <span class="difficulty-indicator">
        Difficulty: 
        <span :class="action.difficulty">{{action.difficulty}}</span>
    </span>
</div>
    `
});

Vue.component("difficulty-help-icon", {
  props: {
    actionHint: null,
    action: null
  },

  template: `
<help-icon :title="actionHint ? actionHint.label : 'Difficulty'" class="action-help-icon" v-if="action.difficulty || actionHint">
    <div v-if="action.difficulty">
        The difficulty indicates chances of success of the action.<br/>
        If unsuccessful many tasks have a chance to waste some of the materials or products or cause an injury. The lower the chance of success is, the bigger the chance for an injury and the more serious the potential injuries.<br/>
        It also determines the amount of skill gained. Tasks marked as "Difficult" grant you the most experience, while tasks easier or harder than that grant less skill experience.
    </div>
    <div v-if="actionHint" v-html="actionHint.text"></div>
</help-icon>
    `
});

Vue.component("interruption-warning", {
  props: {
    action: null,
    target: null
  },

  computed: {
    isCurrentActionInterruptable() {
      return this.currentAction && !(this.currentAction.actionId === "Sleep" && this.currentAction.progress <= 50);
    },

    showWarning() {
      return this.action && !this.action.quick && this.isCurrentActionInterruptable && this.action !== this.matchCurrentAction;
    }
  },

  subscriptions() {
    const currentActionStream = DataService$1.getCurrentActionStream();
    const targetStream = this.stream("target");
    return {
      currentAction: currentActionStream,
      matchCurrentAction: matchCurrentAction(targetStream)
    };
  },

  template: `
<div v-if="showWarning" class="help-text"><span class="warning-text">Warning:</span> this will interrupt your current action.</div>
    `
});

Vue.component("actions", {
  props: {
    target: null,
    id: null,
    exclude: null,
    include: null,
    icon: null,
    quick: false,
    context: {},
    text: {
      default: true
    }
  },

  data: () => ({
    advanced: null,
    repetitions: DEFAULT_REPETITIONS,
    executingPromise: {},
    lastIdx: null
  }),

  subscriptions() {
    const currentActionStream = DataService$1.getCurrentActionStream();
    const targetStream = this.stream("target");
    return {
      currentAction: currentActionStream,
      matchCurrentAction: matchCurrentAction(targetStream)
    };
  },

  computed: {
    selected() {
      return this.actions[this.advanced];
    },
    actions() {
      return this.target.actions || [];
    },
    actionHint() {
      return actionHintsName[this.selected && this.selected.name] || actionHintsId[this.selected && this.selected.id];
    },
    repetitionChoices() {
      const maxRepetitions = this.selected && this.selected.maxRepetitions;
      if (maxRepetitions) {
        const mid = Math.round((1 + maxRepetitions) / 2);
        if (mid > 1 && mid < maxRepetitions) {
          return [1, mid, maxRepetitions];
        }
        if (maxRepetitions === 1) {
          return [];
        }
        return [1, maxRepetitions];
      }
      return [1, 20, 100];
    }
  },

  methods: {
    formatTimeAgo: Utils$1.formatTimeAgo,

    actionTriggered(actionId) {
      this.advanced = null;
      this.$emit("action", actionId);
    },

    selectAction(action, targetId, repetitions = null, queue = false) {
      if (Math.abs(repetitions) === Infinity) {
        repetitions = Number.MAX_SAFE_INTEGER;
      }
      this.executingPromise = ServerService$1.request("action", {
        action: action.id,
        target: targetId,
        context: this.context ? this.context : action.context,
        repetitions: action.repeatable ? +repetitions : 1,
        queue
      }).then(response => {
        if (response === true) {
          this.actionTriggered(action.id);
        }
      });
    },

    triggerAction(actionId, $event) {
      const idx = this.target.actions.findIndex(action => action.id === actionId);
      if (idx !== -1) {
        this.advancedAction(idx, $event);
      }
    },

    advancedAction(idx, event) {
      const action = this.target.actions[idx];

      if (!action.available && action.quick) {
        ToastNotification.notify(action.message);
        return;
      }

      if (this.quick || action.quick && !action.repeatable && !action.actionJs) {
        this.lastIdx = idx;
        this.selectAction(action, this.target.id);
        return;
      }

      if (action.id === "Craft") {
        this.repetitions = 1;
      } else if (action.defaultRepetitions) {
        this.repetitions = action.defaultRepetitions;
      } else if (this.target.qty) {
        this.repetitions = this.target.qty;
      } else {
        this.repetitions = DEFAULT_REPETITIONS;
      }
      event.preventDefault();
      this.advanced = idx;

      if (action.actionJs) {
        ServerService$1.loadDynamicComponent(action.actionJs).then(componentName => {
          const component = Vue.component(componentName);
          if (this.lastComponent) {
            this.lastComponent.$destroy();
          }
          this.lastComponent = new component({
            propsData: {
              actionTarget: this.target,
              action: action
            }
          });
          this.lastComponent.$mount();

          const interval = setInterval(() => {
            if (this.$refs.dynamicComponentContainer) {
              if (!this.lastComponent) {
                throw new Error("lastComponent is falsy!");
              }
              this.$refs.dynamicComponentContainer.appendChild(this.lastComponent.$el);
              this.lastComponent.$on("close", () => {
                this.actionTriggered(action.id);
              });
              clearInterval(interval);
            }
          }, 80);

          this.lastComponent.$on("close", () => {
            this.actionTriggered(action.id);
            clearInterval(interval);
          });
        });
      }
    }
  },

  destroy() {
    this.lastComponent.$destroy();
  },

  template: `
<div class="actions-list" v-if="target">
    <div v-for="(action, idx) in actions" v-if="(!id || action.id === id) && (!exclude || !exclude.includes(action.id)) && (!include || include.includes(action.id)) && (text || !action.secondaryAction)">
        <loader-button
            :promise="lastIdx === idx && executingPromise"
            class="action"
            @click="advancedAction(idx, $event);"
            :class="[{ current: matchCurrentAction === action, disabled: !action.available && action.quick, icon: icon, text: text }, action.id]"
        >
            <slot :name="action.name">
                <div :hidden="!icon" :style="{ 'background-image': 'url(' + action.icon + ')' }" class="icon"></div>
                <div :hidden="!text" class="text">{{action.name}}</div>
<!--                <div class="difficulty-indicator" v-if="action.difficulty"><div class="icon" :class="action.difficulty"></div></div>-->
                <div class="difficulty-indicator-border" :class="action.difficulty" v-if="action.difficulty"></div>
            </slot>
        </loader-button>
    </div>
    <slot></slot>
    <modal v-if="selected" @close="advanced = null;" class="action-modal">
        <template slot="header">
            {{selected.name}}
            <span v-if="selected.id === 'Craft'"> - {{target.name}}</span>
        </template>
        <template v-if="selected.actionJs" slot="main">
            <tool-selector />
            <div ref="dynamicComponentContainer"></div>
        </template>
        <template v-else slot="main">
            <tool-selector />
            <form>
                <action-blocked-info :action="selected" />
                <difficulty-help-icon :action-hint="actionHint" :action="selected" />
                <interruption-warning :action="selected" :target="target" />
                <carry-capacity-predictor :action="selected" :target="target" :qty="repetitions" />
                <recipe-diagram :recipe="target" :repetitions="repetitions" v-if="selected.id === 'Craft'" />
                <div class="help-text" v-if="selected.difficulty">
                    <span class="difficulty-indicator">
                        Difficulty: 
                        <span :class="selected.difficulty">{{selected.difficulty}}</span>
<!--                        <div class="icon inline"></div>-->
                    </span>
                </div>
                <div v-if="selected.repeatable" class="repetition-selector">
                    <div class="intro-text">How many?</div>
                    <number-selector class="number-select" v-model="repetitions" :min="1" :max="selected.maxRepetitions" :choices="repetitionChoices" />
                </div>
                <confirm-with-wakeup-warning :promise="executingPromise" :action="selected" @action="selectAction(selected, target.id, repetitions);" />
                <button type="submit" @click.prevent="selectAction(selected, target.id, repetitions, true);" v-if="selected.queueable && currentAction && currentAction.actionId !== 'Sleep'">Queue next</button>
            </form>
        </template>
    </modal>
</div>
    `
});

Vue.component("node-creatures", {
    props: {
        node: null
    },

    data: () => ({}),

    subscriptions() {
        const creaturesStream = this.stream("node").pluck("creatures");

        return {
            creatures: creaturesStream.map(creatures => [...creatures].sort(creaturesSorter))
        };
    },

    template: `
<section class="node-details">
    <actions
        class="centered"
        :target="node"
        :exclude="['Name town', 'Name region', 'Travel']"        
    />
    <header>Creatures</header>
    <div v-if="!node.isInVisionRange" class="empty-list">Unknown</div>
    <div v-else-if="!creatures.length" class="empty-list"></div>
    <section>
        <creature-list-item
            v-for="creature in creatures"
            :creature="creature"
            :key="creature.id">
        </creature-list-item>
    </section>
</section>
    `
});

Vue.component("list-occupants", {
  props: {
    node: null,
    target: null
  },

  data: () => ({}),

  subscriptions() {
    const creaturesStream = this.stream("node").pluck("creatures").map(creatures => [...creatures].sort(creaturesSorter));

    const blockingIdsStream = this.stream("target").pluck("blockedBy");

    return {
      creatures: Rx.Observable.combineLatestMap({
        creatures: creaturesStream,
        blockingIds: blockingIdsStream
      }).map(({ creatures, blockingIds }) => {
        const blockedIdsMap = (blockingIds || []).toObject(id => id);

        return creatures.filter(c => blockedIdsMap[c.id]);
      })
    };
  },

  template: `
<section class="list-occupants" v-if="creatures && creatures.length">
    <header>Blocked by</header>
    <section>
        <creature-list-item
            v-for="creature in creatures"
            :creature="creature"
            :key="creature.id"
            :include-actions="false"
        >
        </creature-list-item>
    </section>
</section>
    `
});

Vue.component("node-resources", {
    props: {
        node: null
    },

    data: () => ({
        RESOURCE_SIZES,
        showDetailsId: null
    }),

    methods: {
        ucfirst: Utils$1.ucfirst
    },

    computed: {
        //     detailsDifficulty() {
        //         if (!this.showDetails || !this.showDetails.actions) {
        //             return null;
        //         }
        //         const action = this.showDetails.actions.find(a => a.id === 'Gather');
        //         if (!action) {
        //             return null;
        //         }
        //         return action.difficulty;
        //     },
        showDetails() {
            if (!this.showDetailsId) {
                return null;
            }
            return this.node.resources.find(r => r.id === this.showDetailsId);
        }
    },

    template: `
<section class="node-resources-frame">
    <header>
        Resources
    </header>
    <div v-if="node.veryOld" class="empty-list">Unknown</div>
    <div v-else-if="!node.resources.length" class="empty-list"></div>
    <div v-for="resource in node.resources" class="list-item-with-props">
        <div class="interactable resource-list-item" @click="showDetailsId = resource.id">
            <div class="main-icon">
                <item-icon :src="resource.icon"></item-icon>
            </div>
            <div class="details">
                <div class="label">
                    <div v-if="resource.blockedBy && resource.blockedBy.length" class="icon-blocked"></div>
                    <div v-if="resource.occupyLevel" class="icon-blocking"></div>
                    <div class="nowrap">
                        <entity-name :entity="resource" />
                        ({{RESOURCE_SIZES[resource.sizeLevel]}})
                    </div>
                </div>
                <div class="item-list">
                    <!--&lt;!&ndash;<item-icon v-for="material in resource.materialsNeeded" :key="material.item.name" :src="material.item.icon" :qty="material.qty" size="small"></item-icon>&ndash;&gt;-->
                </div>
            </div>
        </div>
        <actions
            :target="resource"
            :icon="true"
            :text="false"
        />
    </div>
    <modal v-if="showDetails" @close="showDetailsId = null" class="resource-details-modal">
        <template slot="header">
            <entity-name :entity="showDetails" :editable="true" />
        </template>
        <template slot="main">
            <div class="main-section">
                <div class="main-icon">
                    <item-icon :src="showDetails.icon"></item-icon>
                </div>
                <div class="item-properties html">
                    <div v-if="showDetails.sizeLevel">
                        <span class="property">Quantity</span><span class="value">{{RESOURCE_SIZES[showDetails.sizeLevel]}}</span>
                    </div>
                    <div>
                        <span class="property">Tool needed</span><span class="value">{{ucfirst(showDetails.toolNeeded) || 'none'}}</span>
                    </div>
                    <div>
                        <span class="property">Skill used</span><span class="value">{{showDetails.skillUsed || 'none'}}</span>
                    </div>
<!--                    <div v-if="detailsDifficulty">-->
<!--                        <span class="property">Difficulty</span><span class="value difficulty-indicator"><span :class="detailsDifficulty">{{detailsDifficulty}}</span></span>-->
<!--                    </div>-->
                </div>
            </div>
            <list-occupants :node="node" :target="showDetails" />
            <actions
                class="actions"
                @action="showDetailsId = null"
                :icon="true"
                :target="showDetails"
            />
        </template>
    </modal>
</section>
    `
});

Vue.component("node-structures", {
    props: {
        node: null,
        filter: false,
        iconOnly: false
    },

    data: () => ({
        showDetailsId: null,
        showPlotText: null,
        showPlotStructureName: "",
        writingOnStructure: null,
        writingStructureText: ""
    }),

    methods: {
        linebreaks: Utils$1.linebreaks,

        saveStructureText() {
            ServerService$1.request("writeOnStructure", {
                structureId: this.writingOnStructure.id,
                plotText: this.writingStructureText
            });
        },

        erectNew() {
            ContentFrameService.triggerShowPanel("erect");
        },

        showModal(structure) {
            this.showDetailsId = structure.id;
        },

        integrityDisplay(values) {
            return Array.isArray(values) && values.map(value => `${value}%`).join(" ~ ");
        }
    },

    subscriptions() {
        return {
            currentNodeId: DataService$1.getCurrentNodeIdStream(),
            buildingPlans: DataService$1.getMyBuildingPlansStream()
        };
    },

    computed: {
        showDetails() {
            if (!this.showDetailsId) {
                return null;
            }
            return this.node.structures.find(s => s.id === this.showDetailsId);
        },

        finalIntegrityClass() {
            return this.showDetails && Utils$1.getIntegrityClass(this.showDetails.integrity);
        },

        isCurrentNode() {
            return this.node && this.currentNodeId === this.node.id;
        },

        sortedStructures() {
            return [...(this.node.structures || [])].sort((a, b) => {
                if (a.complete !== b.complete) {
                    return a.complete ? -1 : 1;
                }
                const integrity = x => x.integrity ? x.integrity[0] : 50;
                if (integrity(a) !== integrity(b)) {
                    return integrity(a) - integrity(b);
                }
                if (a.order !== b.order) {
                    return a.order - b.order;
                }
                if (a.name !== b.name) {
                    return a.name > b.name ? 1 : -1;
                }
                return 0;
            });
        }
    },

    template: `
<section class="node-structures-frame node-details">
    <header v-if="!iconOnly">Structures</header>
    <div v-if="node.veryOld" class="empty-list">Unknown</div>
    <div v-else-if="!node.structures.length" class="empty-list"></div>
    <template v-for="structure in sortedStructures" v-if="!filter || filter(structure)">
        <header v-if="structure.complete === false && !iconOnly" class="under-construction">
            Under construction
        </header>
        <div class="structure-listing-item">
            <div class="list-item-with-props interactable" @click="showModal(structure)">
                <div class="main-icon">
                    <item-icon
                        :src="structure.icon"
                        :integrity="structure.integrity"
                        integrity-type="building" 
                    />
                </div>
                <div class="details" v-if="!iconOnly">
                    <div class="label">
                        <div v-if="structure.blockedBy && structure.blockedBy.length" class="icon-blocked"></div>
                        <div v-if="structure.occupyLevel" class="icon-blocking"></div>
                        <span class="take-space">
                            <!--<span v-if="!structure.complete" class="help-text">Construction:</span>-->
                            <div class="nowrap">{{structure.name}}</div>
                        </span>
                    </div>
                    <div class="item-list">
                        <template v-for="(items, category) in structure.listedItems" v-if="items && items.length">
                            <item-icon
                                v-for="(material, idx) in items"
                                :key="category + material.item.name"
                                :src="material.item.icon"
                                :always-show-qty="true"
                                :qty="material.qty"
                                :integrity="material.integrity"
                                :integrity-type="material.integrityType"
                                :name="material.name"
                                size="tiny"
                            >    
                            </item-icon>
                            <div class="spacer" />
                        </template>
                    </div>
                </div>
            </div>
            <actions
                :target="structure"
                :icon="true"
                :text="false"
                v-if="!iconOnly"
            >
                <button
                    v-if="structure.plotText"
                    class="action"
                    @click="showPlotText = linebreaks(structure.plotText); showPlotStructureName = structure.name;"
                >
                    <span>Read</span>
                </button>
                <button
                    v-if="structure.isWriteable"
                    class="action"
                    @click="writingOnStructure = structure; showPlotStructureName = structure.name; writingStructureText = structure.plotText"
                >
                    <span>Write</span>
                </button>
            </actions>
        </div>
    </template>
    <div v-if="!iconOnly && buildingPlans && buildingPlans.length && isCurrentNode" class="centered spacing-top">
        <button @click="erectNew()">Erect new</button>
    </div>
    <modal v-if="showPlotText" @close="showPlotText = null;">
        <template>
            <template slot="header">{{showPlotStructureName}}</template>
            <template slot="main">
                <animated-text :text="showPlotText" />
            </template>
        </template>
    </modal>
    <modal v-if="writingOnStructure" @close="writingOnStructure = null;" class="write-text">
        <template>
            <template slot="header">{{showPlotStructureName}}</template>
            <template slot="main">
                <textarea v-model="writingStructureText" maxlength="250" />
                <button @click.prevent="saveStructureText();writingOnStructure = null;">Confirm</button>
            </template>
        </template>
    </modal>
    <modal v-if="showDetails" @close="showDetailsId = null;" class="properties-modal structure-details-modal">
        <template>
            <template slot="header">{{showDetails.name}}</template>
            <template slot="main">
                <div class="main-icon">
                    <item-icon :src="showDetails.icon"></item-icon>
                </div>
                <structure-description :building-code="showDetails.buildingCode" :building-id="showDetails.id" />
                <div class="item-properties html">
                    <div v-if="showDetails.integrity">
                        <span class="property">Condition</span>
                        <span class="value">
                            {{integrityDisplay(showDetails.integrity)}}
                        </span>
                        <span class="integrity-icon" :class="[finalIntegrityClass, 'building']"></span>
                    </div>
                </div>
                <div class="decorations" v-if="showDetails.decorations && showDetails.decorations.length">
                    <div class="item-properties html">
                        <div class="property">Decorations</div>
                    </div>
                    <div class="item-list">
                        <item-icon v-for="icon in showDetails.decorations" :key="icon" :src="icon"></item-icon>
                    </div>
                </div>
                <div v-for="(items, category) in showDetails.listedItems" v-if="items && items.length">
                    <div class="item-properties html">
                        <div class="property">{{category}}</div>
                    </div>
                    <div class="item-list">
                        <item-icon v-for="(material, idx) in items" :key="idx" :src="material.item.icon" :always-show-qty="true" :qty="material.qty" :integrity="material.integrity" :integrity-type="material.integrityType" :name="material.name" size="small"></item-icon>
                    </div>
                </div>
                <list-occupants :node="node" :target="showDetails" />
                <actions
                    class="actions"
                    :target="showDetails"
                    :icon="true"
                    @action="showDetailsId = false"
                />
            </template>
        </template>
    </modal>
</section>
    `
});

Vue.component("radial-progress", {
  props: {
    percentage: Number,
    size: {
      type: Number,
      default: 50
    },
    color: {
      type: String,
      default: "lightgray"
    },
    pieces: {
      type: Number,
      default: 5
    }
  },

  computed: {
    firstRotation() {
      return Math.min(this.percentage, 50) / 50 * 180 - 90 + 45;
    },

    secondRotation() {
      return (this.percentage - 50) / 50 * 180 + 90 + 45;
    }
  },

  template: `
<div class="radial-progress" :style="{width: size + 'px', height: size + 'px' }" @click="$emit('click', $event)">
    <div class="radial-progress-wrapper" :style="{ 'transform': 'scale(' + (size / 100) + ')' }">
        <div class="half first-background"></div>
        <div class="half first" :style="{ 'transform': 'rotate(' + firstRotation + 'deg)', 'border-top-color': color, 'border-left-color': color }"></div>
        <div class="half second" :style="{ 'transform': 'rotate(' + secondRotation + 'deg)', 'border-top-color': color, 'border-left-color': color }" v-if="percentage > 50"></div>
        <div class="half second-overlay"></div>
        <div class="mid-cover"></div>
        <div class="shadow"></div>
    </div>
</div>
`
});

Vue.component("tooltip", {
    props: ["title"],

    template: `
<a class="tooltip">
    <slot></slot>
    <div class="tooltip-text">{{title}}</div>
</a>
    `
});

const showQueue = {};
let showQueueTimeout = null;
const getShowQueue = group => {
  showQueue[group] = showQueue[group] || [];
  return showQueue[group];
};
const startShowQueueTimeout = (group, delay, bundle) => {
  showQueueTimeout = setTimeout(() => {
    showQueueTimeout = null;
    if (getShowQueue(group).length) {
      let item;
      for (let i = 0; i < bundle; i++) {
        item = getShowQueue(group).shift();
        if (!item) {
          break;
        }
        item.show();
      }
      startShowQueueTimeout(group, delay, bundle);
    }
  }, delay);
};
const queueShowRecipe = (group, component, index = 0, delay = 50, bundle = 1) => {
  if (index > getShowQueue(group).length) {
    index = getShowQueue(group).length;
  }
  getShowQueue(group).splice(index, 0, component);
  if (!showQueueTimeout) {
    startShowQueueTimeout(group, delay, bundle);
  }
};
const unqueueShowRecipe = (group, component) => {
  showQueue[group] = showQueue[group] || [];
  showQueue[group] = getShowQueue(group).filter(c => c !== component);
};
Vue.component("staggered-show", {
  props: ["index", "group", "delay", "forceShow", "bundle"],

  data: () => ({
    shown: false
  }),

  created() {
    if (this.forceShow) {
      this.shown = true;
    } else {
      queueShowRecipe(this.group, this, this.index, this.delay, this.bundle);
    }
  },

  destroyed() {
    if (!this.shown) {
      unqueueShowRecipe(this.group, this);
    }
  },

  methods: {
    show() {
      this.shown = true;
    }
  },

  template: `
<transition name="fade">
    <div v-if="shown">
        <slot />    
    </div>
</transition>
  `
});

var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("node-header", {
  props: {
    node: null
  },

  subscriptions() {
    return {
      currentTime: DataService$1.getCurrentTimeInMinutesStream()
    };
  },

  methods: {
    formatTimeAgo: Utils$1.formatTimeAgo,

    triggerAction(actionId) {
      ServerService$1.request("action", {
        action: actionId,
        target: this.node.id
      });
    },

    nameRegion($event) {
      this.$refs.actions.triggerAction("Name region", $event);
    },

    nameTown($event) {
      this.$refs.actions.triggerAction("Name town", $event);
    }
  },

  computed: {
    notVotedRegion() {
      return this.node && !this.node.regionNameVote;
    },

    notVotedName() {
      return this.node && !this.node.townNameVote;
    },

    locationIconStyle() {
      return {
        "background-image": `url(${this.node.image})`
      };
    },

    canEditTownName() {
      return this.node.actions.some(a => a.id === "Name town");
    },

    canEditRegionName() {
      return this.node.actions.some(a => a.id === "Name region");
    },

    hasTravelAction() {
      return this.node.actions.some(a => a.id === "Travel");
    },

    minutesAgo() {
      return Math.floor(this.currentTime - this.node.lastUpdate);
    }
  },

  template: `
<section v-if="node" class="node-header">
    <actions
        :style="{ display: 'none' }"
        :target="node"
        ref="actions"
        :exclude="['Name town', 'Name region', 'Travel']"        
    />
    <tooltip class="location-icon" :title="node.name">
        <div class="icon" :style="locationIconStyle"></div>
    </tooltip>
    <div class="travel-icon" v-if="hasTravelAction">
        <actions
            :target="node"
            id="Travel"
            :icon="true"
            :text="false"        
        />
    </div>
    <div class="location-name" :class="{ named: node.region, interactable: canEditRegionName }" @click="nameRegion($event)">
        <div class="name-itself">{{node.region ? node.region : node.name}}</div>
        <div v-if="canEditRegionName" class="edit-icon" :class="{ 'opacity-blink': canEditRegionName && notVotedRegion }"></div>
    </div>
    <div class="town-name-wrapper" v-if="node.townName || canEditTownName">
        <div class="town-name" :class="{ named: node.townName, interactable: canEditTownName }" @click="nameTown($event)">
            <div class="name-itself">{{node.townName || 'Unnamed'}}</div>
            <div v-if="canEditTownName" class="edit-icon" :class="{ 'opacity-blink': canEditTownName && notVotedName }"></div>
        </div>
    </div>
    <div v-if="!node.isInVisionRange" class="last-seen help-text">Last seen {{formatTimeAgo(minutesAgo)}} ago</div>
</section>
    `
});

Vue.component("map-node", {
  props: {
    nodeId: null,
    box: null,
    interactable: {
      default: true
    },
    clickable: false
  },

  data: () => ({
    selected: 0,
    RESOURCE_SIZES,
    visible: true
  }),

  computed: {
    nodeTokenOverlayStyle() {
      const style = _extends$3({}, this.nodeToken.style, {
        "z-index": 900000 + this.nodeToken.style["z-index"]
      });
      if (this.isDungeon && this.nodeToken.isInVisionRange) {
        style["z-index"] += 300000;
      }
      return style;
    },

    nodeTokenStyle() {
      const style = _extends$3({}, this.nodeToken.style);
      if (this.isDungeon && this.nodeToken.isInVisionRange) {
        style["z-index"] += 3000;
      }
      return style;
    },

    iconSize() {
      return "map-icon";
      // return this.selected ? 'tiny' : 'map-icon';
    },

    outerWrapperStyle() {
      return {
        "z-index": this.nodeToken.style["z-index"]
      };
    },

    wrapperClass() {
      return {
        visible: this.visible
      };
    },

    tokenClass() {
      return [{
        nearby: this.nodeToken.isInVisionRange,
        current: this.nodeToken.currentLocation,
        "very-old": this.nodeToken.veryOld
      }, "map-mode-" + this.mapMode];
    },

    structureIcons() {
      const integrity = x => x.integrity ? x.integrity[0] : 200;
      return Object.values(this.nodeToken.structures.filter(structure => structure.complete !== false).reduce((acc, structure) => {
        acc[structure.icon] = acc[structure.icon] || {
          icon: structure.icon,
          count: 0,
          integrity: [Infinity]
        };
        acc[structure.icon].count += 1;
        acc[structure.icon].integrity = integrity(structure) < integrity(acc[structure.icon]) ? structure.integrity : acc[structure.icon].integrity;
        return acc;
      }, {})).sort((a, b) => {
        if (integrity(a) !== integrity(b)) {
          return integrity(a) - integrity(b);
        }
        if (a.count !== b.count) {
          return a.count - b.count;
        }
        return a.icon > b.icon ? 1 : -1;
      });
    }
  },

  subscriptions() {
    const nodeTokenStream = Rx.Observable.combineLatest(this.stream("nodeId").switchMap(nodeId => MapService$1.getNodeStream(nodeId)), this.stream("box")).map(([nodeToken, box]) => {
      return _extends$3({}, nodeToken, {
        style: {
          left: nodeToken.x - box.left + "px",
          top: nodeToken.y - box.top + "px",
          "z-index": 9000 + nodeToken.y
        }
      });
    });

    return {
      travelMode: ServerService$1.getTravelModeStream(),
      isDungeon: ServerService$1.getIsDungeonStream(),
      nodeToken: nodeTokenStream,
      hasEnemies: nodeTokenStream.map(nodeToken => nodeToken.creatures.some(c => c.hostile && !c.dead)),
      hasUnknowns: nodeTokenStream.map(nodeToken => nodeToken.creatures.some(c => !c.hostile && !c.friendly && !c.dead)),
      hasFriends: nodeTokenStream.map(nodeToken => nodeToken.creatures.some(c => c.friendly && !c.dead && !c.self && c.relationship === "friend")),
      hasNeutrals: nodeTokenStream.map(nodeToken => nodeToken.creatures.some(c => c.friendly && !c.dead && !c.self && !c.relationship)),
      hasRivals: nodeTokenStream.map(nodeToken => nodeToken.creatures.some(c => c.friendly && !c.dead && !c.self && c.relationship === "rival")),
      mapMode: ContentFrameService.getMapModeStream(),
      currentZLevel: MapService$1.getCurrentZLevelStream()
    };
  },

  methods: {
    onClick() {
      if (this.interactable && this.clickable) {
        if (this.travelMode) {
          ServerService$1.triggerTravelStream(this.nodeToken.id);
        } else {
          this.selected = 2;
          ContentFrameService.triggerNodeSelected(this.nodeToken);
          ContentFrameService.triggerShowNodeDetails(this.nodeToken);
          if (this.selected) {
            this.$emit("selected");
          }
        }
      }
    },

    deselect() {
      if (this.selected) {
        this.selected = 0;
      }
    },

    updateInVisionRange(visibleBox) {
      const posY = this.nodeToken.y - this.box.top;
      const posX = this.nodeToken.x - this.box.left;
      const visible = visibleBox.top < posY && visibleBox.bottom > posY && visibleBox.left < posX && visibleBox.right > posX;
      if (visible !== this.visible) {
        this.visible = visible;
      }
    }
  },

  template: `
<staggered-show
    group="map-node"
    v-if="visible && +currentZLevel === +(nodeToken.zLevel || 0)"
    delay="50"
    bundle="20" 
    :forceShow="nodeToken.isInVisionRange"
    :style="outerWrapperStyle"
>
    <div class="node-token-wrapper" :class="[wrapperClass, { dungeon: isDungeon }]">
        <div
            class="node-token-overlay background"
            :style="nodeTokenOverlayStyle"
            :class="tokenClass"
        >
            <div class="indicators" :class="iconSize">
                <div v-if="nodeToken.debug" class="debug">{{nodeToken.debug}}</div>
                <div class="node-creatures node-icons" v-if="mapMode === 'creatures'">
                    <div v-for="creature in nodeToken.creatures" class="node-creature node-icon" v-if="!creature.dead">
                        <creature-icon :creature="creature" :size="iconSize" :with-tracks="true" />
                    </div>
                </div>
                <div class="node-structures node-icons" v-if="mapMode === 'structures'">
                    <div v-for="props in structureIcons" class="node-structure node-icon">
                        <item-icon :src="props.icon" :key="props.icon" :size="iconSize" :qty="props.count" :integrity="props.integrity" integrity-type="building" />
                        <!--<div class="structure-description">{{structure.name}}</div>-->
                    </div>
                </div>
                <div class="node-resources node-icons" v-if="mapMode === 'resources'">
                    <div v-for="resource in nodeToken.resources" class="node-resource node-icon">
                        <item-icon :src="resource.icon" :key="resource.name" :size="iconSize" />
                        <!--<div class="resource-size">{{RESOURCE_SIZES[resource.sizeLevel]}}</div>-->
                    </div>
                </div>
            </div>
            <div class="town-name" v-if="nodeToken.townName">
                {{nodeToken.townName}}
            </div>
            <div class="markers">
                <div class="marker current" v-if="nodeToken.currentLocation"></div>
                <div class="marker hostile" v-if="hasEnemies"></div>
                <div class="marker unknown" v-if="hasUnknowns"></div>
                <div class="marker friend" v-if="hasFriends"></div>
                <div class="marker neutral" v-if="hasNeutrals"></div>
                <div class="marker rival" v-if="hasRivals"></div>
            </div>
        </div>
        <div
            class="node-token background"
            :style="nodeTokenStyle"
            :class="[tokenClass, { interactable: (interactable || clickable) }]"
        >
            <div class="click-trigger" @click="onClick();" />
            <img class="map-image" :src="nodeToken.image">
        </div>
    </div>
</staggered-show>
    `
});

var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const mixRgba = (first, second, ratio) => {
  return [first[0] * (1 - ratio) + second[0] * ratio, first[1] * (1 - ratio) + second[1] * ratio, first[2] * (1 - ratio) + second[2] * ratio, first[3] * (1 - ratio) + second[3] * ratio];
};

let intervals = [];
let animationsEnabled = true;
ServerService$1.getLocalSettingStream("disableWeatherEffects").subscribe(disableWeatherEffects => {
  animationsEnabled = !disableWeatherEffects;
});

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

  intervals.push(() => step = () => {});
};

const getEventStyle = name => {
  switch (name) {
    case "Strange Mist":
      {
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
    case "Dense Fog":
      {
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
    case "Storm":
      {
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
      events: DataService$1.getEventsStream(),
      eventNames: DataService$1.getEventsStream().map(events => events.map(e => e.name)).distinctUntilChanged(null, JSON.stringify).do(names => this.updateWeatherEffects({ names })),
      climate: DataService$1.getPlayerInfoStream().pluck("climate").distinctUntilChanged(null, JSON.stringify).do(climate => this.updateWeatherEffects({ climate }))
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
        const event = this.events && this.events.find(e => e.name === eventName);
        return event && event.minutesLeft;
      };

      let result;
      const hourMinutes = 60 - (getEventTimeLeft("Sunrise") || getEventTimeLeft("Sunset"));

      switch (true) {
        case hasEvent("Night"):
          result = night;
          break;
        case hasEvent("Sunrise") && hourMinutes < 30:
          result = mixRgba(night, sunrise, hourMinutes % 60 / 30);
          break;
        case hasEvent("Sunrise"):
          result = mixRgba(sunrise, day, (hourMinutes - 30) % 60 / 30);
          break;
        case hasEvent("Sunset") && hourMinutes < 30:
          result = mixRgba(day, sunset, hourMinutes % 60 / 30);
          break;
        case hasEvent("Sunset"):
          result = mixRgba(sunset, night, (hourMinutes - 30) % 60 / 30);
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

      this.weatherEffects = names.map(getEventStyle).filter(e => !!e).map(eventProps => _extends$4({}, eventProps, {
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

var _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const RESOURCE_MARKER = "Mark resource...";
const NODE_SIZE_BUFFER = 60;

Vue.component("world-map", {
  data: () => ({
    dragging: false,
    mapOffset: null,
    scale: 1,
    searchForResource: RESOURCE_MARKER,
    RESOURCE_MARKER,
    mapOffsetActual: null,
    scaleActual: 1,
    ignoreNextClick: false,
    smoothScroll: false
  }),

  subscriptions() {
    const playerInfoStream = DataService$1.getPlayerInfoStream();
    const nodeStream = ServerService$1.getNodeStream();
    const nodeIdsStream = MapService$1.getNodeIdsStream().do(() => {
      this.updateActual();
    });
    const pathNodesStream = playerInfoStream.map(playerInfo => [playerInfo.location, ...playerInfo.travelQueue]).distinctUntilChanged(null, JSON.stringify).switchMap(travelQueue => {
      const nodeStreams = {};
      travelQueue.forEach(nodeId => {
        nodeStreams[nodeId] = MapService$1.getNodeStream(nodeId).first();
      });

      return Rx.Observable.combineLatestMap(nodeStreams);
    });

    const nodesStream = nodeIdsStream.switchMap(nodeIds => Rx.Observable.combineLatest(nodeIds.map(nodeId => MapService$1.getNodeStream(nodeId).first()))).shareReplay(1);
    const boxStream = nodesStream.map(nodes => {
      const margin = 100;
      let left = this.box ? this.box.left + margin : Infinity;
      let top = this.box ? this.box.top + margin : Infinity;
      let right = this.box ? this.box.right - margin : -Infinity;
      let bottom = this.box ? this.box.bottom - margin : -Infinity;
      nodes.forEach(node => {
        if (node.x < left) left = node.x;
        if (node.y < top) top = node.y;
        if (node.x > right) right = node.x;
        if (node.y > bottom) bottom = node.y;
      });
      return {
        left: left - margin,
        top: top - margin,
        bottom: bottom + margin,
        right: right + margin
      };
    }).shareReplay(1);
    const sizeStream = boxStream.map(box => ({
      width: box.right - box.left + 1,
      height: box.bottom - box.top + 1
    }));
    const nodeTokensStream = Rx.Observable.combineLatestMap({
      nodes: nodesStream,
      box: boxStream,
      playerInfo: playerInfoStream,
      currentNode: nodeStream
    }).throttleTime(100).map(({ nodes, box, playerInfo, currentNode }) => {
      const offsetX = -box.left;
      const offsetY = -box.top;
      return nodes.map(node => _extends$5({}, node, {
        isInRange: node.isInVisionRange,
        creatures: (node.creatures || []).sort(creaturesSorter),
        hasHostiles: (node.creatures || []).some(c => c.hostile && !c.dead),
        hasFriendlies: (node.creatures || []).some(c => !c.hostile && !c.dead),
        highlight: playerInfo.travelQueue[playerInfo.travelQueue.length - 1] === node.id,
        x: node.x + offsetX,
        y: node.y + offsetY
      })).toObject(node => node.id);
    }).shareReplay(1);
    const pathsStream = Rx.Observable.combineLatest([pathNodesStream, boxStream, playerInfoStream]).map(([nodes, box, playerInfo]) => {
      const offsetX = -box.left;
      const offsetY = -box.top;

      let current = playerInfo.location;

      return playerInfo.travelQueue.map(nodeId => {
        const node = nodes[current];
        const travelNode = nodes[nodeId];

        if (!node || !travelNode) {
          return null;
        }

        current = nodeId;

        const nearby = travelNode.isInVisionRange && node.isInVisionRange;

        return {
          highlight: true,
          nearby,
          position: {
            x: Math.round((node.x + travelNode.x) / 2 + offsetX),
            y: Math.round((node.y + travelNode.y) / 2 + offsetY),
            zLevel: travelNode.zLevel || 0
          },
          length: Math.round(Math.sqrt(Math.pow(Math.abs(node.x - travelNode.x), 2) + Math.pow(Math.abs(node.y - travelNode.y), 2))),
          angle: Math.atan2(node.y - travelNode.y, node.x - travelNode.x)
        };
      }).filter(path => !!path);
    });
    const currentNodeIdStream = ServerService$1.getNodeStream().map(node => node.id).distinctUntilChanged();

    const mapOffsetStream = Rx.Observable.merge(currentNodeIdStream.first(), ServerService$1.getIsDungeonStream().switchMap(isDungeon => isDungeon ? currentNodeIdStream : Rx.Observable.empty())).distinctUntilChanged().switchMap(nodeId => nodeTokensStream.map(nodes => Object.values(nodes).find(node => node.id === nodeId)).first()).do(node => {
      if (!node) {
        return;
      }
      if (this.mapOffset) {
        this.smoothScroll = true;
        setTimeout(() => {
          this.smoothScroll = false;
        }, 850);
      }
      this.scale = 1;
      this.mapOffset = {
        x: node.x,
        y: node.y
      };
      this.updateActual();
      const maxZoom = this.getMaxZoom();
      this.setScale(+localStorage.getItem("map-zoom-scale") || maxZoom - 2);
      this.previousScale = this.scale;
    });
    const regionsStream = Rx.Observable.combineLatest([nodeIdsStream.switchMap(nodeIds => Rx.Observable.combineLatest(nodeIds.map(nodeId => MapService$1.getNodeStream(nodeId)))), boxStream]).throttleTime(500).map(([nodes, box]) => {
      const offsetX = -box.left;
      const offsetY = -box.top;
      return nodes.map(node => ({
        id: node.id,
        region: node.region,
        x: node.x + offsetX,
        y: node.y + offsetY,
        zLevel: node.zLevel
      })).reduce((acc, node) => node.region ? _extends$5({}, acc, {
        [node.region]: [...(acc[node.region] || []), {
          x: node.x,
          y: node.y,
          zLevel: node.zLevel || 0
        }]
      }) : acc, {});
    }).map(regions => {
      const result = {};
      Object.keys(regions).forEach(regionName => {
        const positions = regions[regionName];
        const x = positions.reduce((acc, p) => acc + p.x, 0) / positions.length;
        const y = positions.reduce((acc, p) => acc + p.y, 0) / positions.length;

        const zLevel = positions[0].zLevel;

        let angle = (positions.length * positions.reduce((a, p) => a + p.x * p.y, 0) - positions.reduce((a, p) => a + p.x, 0) * positions.reduce((a, p) => a + p.y, 0)) / (positions.length * positions.reduce((a, p) => a + p.x * p.x, 0) - Math.pow(positions.reduce((a, p) => a + p.x, 0), 2));

        const stretch = Math.max(Math.abs(positions.reduce((acc, p) => Math.min(acc, p.x), Infinity) - positions.reduce((acc, p) => Math.max(acc, p.x), -Infinity)), Math.abs(positions.reduce((acc, p) => Math.min(acc, p.y), Infinity) - positions.reduce((acc, p) => Math.max(acc, p.y), -Infinity)));
        const textSize = Math.min(Math.max(stretch / (regionName.length * 3), 2), 4.5) * 6;

        if (angle > Math.PI / 2) {
          angle -= Math.PI;
        }
        if (angle < -Math.PI / 2) {
          angle += Math.PI;
        }

        result[regionName] = {
          x,
          y,
          angle,
          textSize,
          zLevel: zLevel
        };
      });

      return result;
    });
    return {
      nodeIds: nodeIdsStream,
      box: boxStream,
      size: sizeStream,
      mapCenterOffset: mapOffsetStream,
      paths: pathsStream,
      regions: regionsStream,
      currentZLevel: MapService$1.getCurrentZLevelStream()
    };
  },

  computed: {
    draggableMapStyle() {
      return {
        width: this.size.width + "px",
        height: this.size.height + "px",
        transform: "translate(" + (-this.mapOffsetActual.x + "px,") + (-this.mapOffsetActual.y + "px") + ") scale(" + this.scaleActual + ")"
      };
    }
  },

  created() {},

  methods: {
    startDrag(event) {
      this.deselectOtherNodes(-1);
      this.dragging = {
        x: this.mapOffset.x,
        y: this.mapOffset.y
      };
    },
    drag(event) {
      if (!this.dragging || !this.mapOffset) {
        return;
      }
      this.mapOffset.x = parseInt(this.dragging.x, 10) - event.deltaX;
      this.mapOffset.y = parseInt(this.dragging.y, 10) - event.deltaY;

      this.mapOffset.x = Math.max(this.mapOffset.x, 0);
      this.mapOffset.y = Math.max(this.mapOffset.y, 0);

      this.mapOffset.x = Math.min(this.mapOffset.x, (this.box.right - this.box.left) * this.scale);
      this.mapOffset.y = Math.min(this.mapOffset.y, (this.box.bottom - this.box.top) * this.scale);
      this.updateActual();
    },
    dragEnd() {
      this.dragging = false;
      this.ignoreNextClick = true;
      setTimeout(() => {
        this.ignoreNextClick = false;
      }, 10);
    },
    pinchStart() {
      this.previousScale = this.scale;
    },
    getMaxZoom() {
      const maxRes = Math.max(screen && screen.width || 0, screen && screen.height || 0);
      return Math.max(4, 4 + Math.floor((maxRes - 640) * 4 / 1280));
    },
    setScale(scale, x, y) {
      if (!this.mapOffset) {
        return;
      }
      const maxZoom = this.getMaxZoom();
      scale = Math.min(Math.max(0.5, scale), maxZoom);
      this.previousScale = this.previousScale || 1;
      localStorage.setItem("map-zoom-scale", scale);
      this.mapOffset.x = this.mapOffset.x * scale / this.scale;
      this.mapOffset.y = this.mapOffset.y * scale / this.scale;
      this.scale = scale;
      this.updateActual();
    },
    onWheel(event) {
      let deltaY = event.deltaY;
      if (Utils$1.isFirefox() && parseInt(deltaY, 10) === deltaY) {
        deltaY *= 20;
      }
      this.setScale(this.previousScale - deltaY / 100);
      this.previousScale = this.scale;
      event.stopPropagation();
      event.preventDefault();
    },
    onPinch(event) {
      this.setScale(this.previousScale * event.scale, event.center.x, event.center.y);
    },
    regionNameOpacity(position) {
      return Math.min(1, 0.16 + Math.abs(position.y * this.scale - this.mapOffset.y) / 300 + Math.abs(position.x * this.scale - this.mapOffset.x) / 300);
    },
    updateActual() {
      if (!this.updateTimeout) {
        this.updateTimeout = setTimeout(() => {
          this.updateTimeout = null;
          this.mapOffsetActual = _extends$5({}, this.mapOffset);
          this.scaleActual = this.scale;

          this.updateVisibleBoxActual();
        }, 30);
      }
    },
    updateVisibleBoxActual() {
      if (!this.$refs.nodes) {
        setTimeout(() => {
          this.updateVisibleBoxActual();
        }, 100);
        return;
      }
      const height = window.document.body.clientHeight;
      const width = window.document.body.clientWidth;
      const visibleBoxActual = {
        top: (this.mapOffsetActual.y - height / 2) / this.scaleActual - NODE_SIZE_BUFFER,
        left: (this.mapOffsetActual.x - width / 2) / this.scaleActual - NODE_SIZE_BUFFER,
        right: (this.mapOffsetActual.x + width / 2) / this.scaleActual + NODE_SIZE_BUFFER,
        bottom: (this.mapOffsetActual.y + height / 2) / this.scaleActual + NODE_SIZE_BUFFER
      };
      this.$refs.nodes.forEach(nodeCmp => {
        nodeCmp.updateInVisionRange(visibleBoxActual);
      });
    },
    deselectOtherNodes(nodeId) {
      this.$refs.nodes.forEach(nodeCmp => {
        if (+nodeCmp.nodeToken.id !== +nodeId) {
          nodeCmp.deselect();
        }
      });
    }
  },

  mounted() {
    this.$refs.draggableMap.addEventListener("wheel", this.onWheel);
  },

  template: `
<div>
    <div ref="draggableMap" class="Map">
        <v-touch
            class="main-map-container"
            :class="{ underground: +currentZLevel < 0 }"
            @panstart="startDrag"
            @panmove="drag"
            @panend="dragEnd();"
            @pinchstart="pinchStart"
            @pinch="onPinch"
        >
            <map-overlay :scale="scaleActual" />
            <div
                v-if="size && mapOffsetActual"
                class="draggable-map"
                :class="{ dragging: dragging, 'smooth-scroll': smoothScroll }"
                :style="draggableMapStyle"
            >
                <div
                    v-for="(position, regionName) in regions"
                    class="region-name"
                    v-if="+currentZLevel === +position.zLevel"
                    :class="{ visible: dragging }"
                    :style="{ left: position.x + 'px', top: position.y + 'px', opacity: regionNameOpacity(position), transform: 'rotate(' + position.angle + 'rad)', 'font-size': position.textSize + 'px' }"
                >
                    <span>{{regionName}}</span>
                </div>
                <map-node
                    v-for="nodeId in nodeIds"
                    :node-id="nodeId"
                    :key="nodeId"
                    :box="box"
                    :clickable="!ignoreNextClick"
                    ref="nodes"
                    @selected="deselectOtherNodes(nodeId);"
                />
                <svg
                    v-for="path in paths"
                    class="path"
                    width="100%" 
                    height="6px"
                    v-if="path.highlight && path.position.zLevel === currentZLevel"
                    :style="{ left: path.position.x + 'px', top: path.position.y + 'px', width: path.length + 'px', 'margin-left': (-path.length / 2) + 'px', transform: 'rotate(' + path.angle + 'rad)' }"
                >
                    <line x1="4" x2="500" y1="3" y2="3" stroke="black" stroke-width="6" stroke-linecap="round" stroke-dasharray="1, 11"/>
                    <line x1="4" x2="500" y1="3" y2="3" stroke="yellow" stroke-width="4" stroke-linecap="round" stroke-dasharray="1, 11"/>
                </svg>
<!--                <div-->
<!--                    v-for="path in paths"-->
<!--                    class="path"-->
<!--                    width="100%" -->
<!--                    height="6px"-->
<!--                    v-if="path.highlight && path.position.zLevel === currentZLevel"-->
<!--                    :style="{ left: path.position.x + 'px', top: path.position.y + 'px', transform: 'rotate(' + path.angle + 'rad)' }"-->
<!--                >-->
<!--                </div>-->
            </div>
        </v-touch>
    </div>
</div>
    `
});

Vue.component("current-action", {
  props: {
    passCurrentAction: null,
    interactable: {
      default: true
    }
  },

  data: () => ({
    showDetails: false,
    changeRepetitions: false,
    repetitions: 0,
    cancelling: false
    // progressSmooth: 0,
  }),

  computed: {
    displayRepetitions() {
      if (this.currentAction.repetitions > 9000) {
        return "∞";
      }
      if (this.currentAction.repetitions === 1) {
        return "";
      }
      return this.currentAction.repetitions;
    },
    firstRotation() {
      return Math.min(this.progress, 50) / 50 * 180 - 180;
      // return Math.min(this.progressSmooth, 50) / 50 * 180 - 180;
    },
    secondRotation() {
      return (this.progress - 50) / 50 * 180 - 180;
      // return (this.progressSmooth - 50) / 50 * 180 - 180;
    }
  },

  subscriptions() {
    const currentActionStream = Rx.Observable.combineLatestMap({
      passCurrentAction: this.stream("passCurrentAction"),
      selfCurrentAction: DataService$1.getCurrentActionStream()
    }).map(({ passCurrentAction, selfCurrentAction }) => passCurrentAction || selfCurrentAction);

    return {
      currentAction: currentActionStream,
      progress: currentActionStream.pluck("progress").distinctUntilChanged().do(progress => {
        // const time = new Date().getTime();
        // if (this.last) {
        //     this.jumps = (progress - this.last.progress) /
        //         ((time - this.last.time) / interval);
        // } else {
        //     this.jumps = 0;
        // }
        // this.last = { time, progress };
      })
    };
  },

  mounted() {
    // setInterval(() => {
    //     if (this.progressSmooth >= this.progress || this.jumps <= 0) {
    //         this.progressSmooth = this.progress;
    //     } else {
    //         this.progressSmooth += this.jumps;
    //     }
    // }, interval);
  },

  methods: {
    unblockAction() {
      ServerService$1.request("unblock-action").then(() => {
        this.showDetails = false;
      });
    },
    stopAction() {
      this.cancelling = ServerService$1.request("stop-action").then(() => {
        this.showDetails = false;
      });
    },
    openMiniGame() {
      window.location.hash = "/fight";
    },
    onClick(event) {
      if (this.interactable) {
        this.showDetails = true;
        this.changeRepetitions = false;
      }
      this.$emit("click", event);
    },
    updateRepetitions() {
      ServerService$1.request("action", {
        action: this.currentAction.actionId,
        target: this.currentAction.entityId,
        context: this.currentAction.context,
        repetitions: +this.repetitions
      }).then(() => {
        this.changeRepetitions = false;
      });
    },
    decimalTwo: Utils$1.decimalTwo,
    formatTimeAgo: Utils$1.formatTimeAgo
  },

  watch: {
    showDetails(value) {
      this.$emit(value ? "details-open" : "details-close");
    }
  },

  template: `
<div class="current-action-wrapper" v-if="currentAction">
    <div class="current-action" @click="onClick($event);" :class="{ blocked: currentAction.blocked, interactable: interactable }">
        <div class="current-action-wrapper">
            <div class="half first-container">
                <div class="half first" :style="{ 'transform': 'rotate(' + firstRotation + 'deg)' }"></div>
            </div>
            <div class="half second-container">
                <div class="half second" :style="{ 'transform': 'rotate(' + secondRotation + 'deg)' }" v-if="progress > 50"></div>
                <!--<div class="half second" :style="{ 'transform': 'rotate(' + secondRotation + 'deg)' }" v-if="progressSmooth > 50"></div>-->
            </div>
            <div class="mid-cover">
                <img v-if="currentAction && currentAction.icon" :src="currentAction.icon" class="icon">
                <div class="repetitions">{{displayRepetitions}}</div>
            </div>
            <div class="border"></div>
        </div>
    </div>
    <modal v-if="showDetails" @close="showDetails = false" class="current-action-modal">
        <template slot="header">
            {{currentAction.name}}
            <span v-if="currentAction.actionTargetName">- {{currentAction.actionTargetName}}</span>
        </template>
        <template slot="main">
            <tool-selector />
            <div v-if="currentAction.unblockOptionLabel">
                <button class="button" @click="unblockAction()">Continue - {{currentAction.unblockOptionLabel}}</button>
            </div>
            <div v-if="currentAction.blocked" class="help-text">
                <span class="error">Blocked: </span>{{currentAction.blocked}}
            </div>
            <div class="help-text" v-if="currentAction.efficiency">
                <button v-if="!changeRepetitions && currentAction.repeatable" class="action icon edit edit-repetitions" @click="repetitions = currentAction.repetitions;changeRepetitions = true;">
                    <div class="icon"></div>
                </button>
                <div v-if="currentAction.repeatable" class="repeatable">
                    <span class="label">How many times:</span> <span v-if="!changeRepetitions">{{currentAction.repetitions}}</span>
                </div>
            </div>
            <div v-if="changeRepetitions">
                <number-selector class="number-select centered" v-model="repetitions" :min="1" :choices="[1, 20, 100]" />
                <div class="action centered">
                    <div class="button" @click="updateRepetitions()">Confirm</div>
                    <div class="button" @click="changeRepetitions = false">Back</div>
                </div>
            </div>
            <div v-else>
                <div class="help-text" v-if="currentAction.efficiency">
                    <help-icon title="Action speed" class="action-help-icon">
                        Action that is currently in progress. Your character's speed depends on their mood, related skill and tool and other effects, positive and negative.<br/>
                        The estimated time shown is the approximate amount of time needed to complete the current action, including repetitions. The exact time may be different, based on your character changing status (tired, hungry, etc).
                    </help-icon>
                    <div>
                        <span class="label">Speed:</span> {{decimalTwo(currentAction.efficiency * 100)}}%
                    </div>
                    <div v-if="currentAction.difficulty" class="difficulty-indicator"><span class="label">Difficulty:</span> <span :class="currentAction.difficulty">{{currentAction.difficulty}}</span></div>
    <!--                <div v-if="currentAction.ETA" class="estimate">-->
    <!--                    Estimated: {{formatTimeAgo(currentAction.ETA)}}-->
    <!--                </div>  -->
    <!--                <div v-if="currentAction.repeatable && currentAction.repetitions > 1 && currentAction.allETA" class="estimate total">-->
    <!--                    Estimated (Total): {{formatTimeAgo(currentAction.allETA)}}-->
    <!--                </div>-->
                    <div v-if="currentAction.timeSpent" class="estimate">
                        <span class="label">Time spent:</span> {{currentAction.timeSpent}} seconds
                    </div>
                    <div v-if="currentAction.ETA" class="estimate">
                        <span class="label">Estimated:</span> {{formatTimeAgo(currentAction.ETA)}}
                        <span v-if="currentAction.allETA && currentAction.allETA !== currentAction.ETA" class="estimate total">
                            ({{formatTimeAgo(currentAction.allETA)}})
                        </span>
                    </div>  
                </div>
                <div class="help-text" v-if="currentAction.name === 'Sleep'">
                    <help-icon title="Sleeping" class="action-help-icon">
                        Quality of the sleep impacts how quickly your character regains energy and also reduces food consumption. The quality of the sleep increases over time during an uninterrupted sleep.
                    </help-icon>
                    <span class="label">Sleep quality:</span> {{currentAction.progress}}%
                    <div v-if="currentAction.ETA" class="estimate">
                        <span class="label">Estimated time till fully rested:</span> <span class="no-wrap">{{formatTimeAgo(currentAction.ETA)}}</span>
                    </div>
                </div>
                <loader-button class="button" v-if="currentAction.cancellable" @click="stopAction()" :promise="cancelling">Cancel action</loader-button>
            </div>
        </template>
    </modal>
</div>
    `
});

Vue.component("meter-orb", {
  props: ["color", "value", "onlyGrowing"],

  data: () => ({
    reseter: false
  }),

  watch: {
    value(to, from) {
      if (from > to && this.onlyGrowing) {
        this.reseter = !this.reseter;
      }
    }
  },

  template: `
<span class="meter-orb" @click="$emit('click', $event);" :class="{ interactable: $listeners.click }">
    <div
        :key="reseter"
        class="fill"
        :class="'color-' + color"
        :style="{ 'clip-path': 'inset(' + (100 - (value || 0)) + '% 0 0)', '-webkit-clip-path': 'inset(' + (100 - (value || 0)) + '% 0 0)' }"
    ></div>
    <div class="border"></div>
</span>
    `
});

Vue.component("main-status", {
    data: () => ({
        playerActionsExpanded: false
    }),

    subscriptions() {
        return {
            myCreature: DataService$1.getMyCreatureStream(),
            inTutorial: DataService$1.getIsTutorialAreaStream()
        };
    },

    template: `
<div class="main-status" v-if="myCreature">
    <div class="top-left">
        <div v-if="!myCreature.looks" class="avatar-display image-only" :style="myCreature.icon && { 'background-image': 'url(' + myCreature.icon + ')' }"></div>
        <player-avatar
            v-else
            class="avatar-display"
            size="huge"
            :hair-color="myCreature.looks.hairColor"
            :hair-color-grayness="myCreature.looks.hairColorGrayness"
            :skin-color="myCreature.looks.skinColor"
            :hair-style="myCreature.looks.hairStyle"
            :head-only="true"
            :creature="myCreature"
        />
    </div>
    <current-action />
    <div class="player-effects-and-actions-wrapper">
        <div class="player-effects-wrapper">
            <player-effects
                size="small"
                :only-icons="true"
                :only-high-sev="true"
            />
        </div>
        <div class="player-actions-wrapper" v-if="!inTutorial" :class="{ expanded: playerActionsExpanded }">
            <actions
                class="actions"
                @action=""
                :icon="true"
                :text="false"
                :exclude="['Fight', 'Research', 'Sleep']"
                :target="myCreature"
            />
            <div v-if="playerActionsExpanded" class="collapse" @click="playerActionsExpanded = false"></div>
            <div v-else class="expand" @click="playerActionsExpanded = true"></div>
        </div>
    </div>
    
</div>
    `
});

Vue.component("tab", {
  props: ["header", "headerClass", "title", "indicator"],

  data: () => ({
    visible: false
  }),

  watch: {
    indicator(newValue) {
      this.$parent.updateTab(this);
    }
  },

  mounted() {
    const nodes = [].slice.call(this.$el.parentNode.childNodes).filter(node => node.nodeType !== node.TEXT_NODE);
    const idx = nodes.indexOf(this.$el);

    this.$parent.registerTab(idx, this.header, this.headerClass, this.setVisibility, this);
  },

  destroyed() {
    this.$parent.unregisterTab(this.header, this.headerClass);
  },

  methods: {
    setVisibility(visible) {
      this.visible = visible;
    }
  },

  template: `
<div class="tab-wrapper" v-if="visible">
    <slot name="heading"></slot>
    <div class="tab">
        <slot></slot>
    </div>
</div>
    `
});

Vue.component("tabs", {
  props: {
    placement: {},
    rememberId: {},
    url: {
      default: true
    }
  },

  data: () => ({
    tabs: [],
    lastTab: null
  }),

  mounted() {
    if (this.url) {
      const startingTab = this.$router.currentRoute.query.tab;
      if (startingTab) {
        const tab = this.tabs.find(tab => tab.header === startingTab) || this.tabs[0];
        this.setActive(tab);
      }
    }
    if (this.rememberId) {
      const startingTab = localStorage.getItem(`tabsAutoOpen.${this.rememberId}`);
      if (startingTab) {
        const tab = this.tabs.find(tab => tab.id === startingTab) || this.tabs[0];
        this.setActive(tab);
      }
    }
  },

  methods: {
    updateTab(compVm) {
      const tab = this.tabs.find(t => t.compVm === compVm);
      tab.indicator = compVm.indicator;
    },

    registerTab(idx, header, headerClass, setActiveCallback, compVm) {
      const title = compVm.title;
      const indicator = compVm.indicator;
      this.tabs.splice(idx, 0, {
        id: header + "__" + headerClass,
        header: header,
        headerClass: headerClass,
        callback: setActiveCallback,
        title,
        indicator,
        compVm
      });
      if (!this.lastTab) {
        this.lastTab = this.tabs[0];
        if (this.lastTab) {
          this.lastTab.callback(true);
        }
      }
    },

    unregisterTab(header, headerClass) {
      const idx = this.tabs.findIndex(t => t.header === header && t.headerClass === headerClass);

      if (idx !== -1) {
        const needToActivate = this.lastTab === this.tabs[idx];
        this.tabs.splice(idx, 1);
        if (needToActivate) {
          this.lastTab = this.tabs[0];
          if (this.lastTab) {
            this.lastTab.callback(true);
          }
        }
      }
    },

    setActive(tab) {
      this.lastTab.callback(false);
      tab.callback(true);
      this.lastTab = tab;
      if (this.rememberId) {
        localStorage.setItem(`tabsAutoOpen.${this.rememberId}`, tab.id);
      }
      if (this.url) {
        this.$router.push({ query: { tab: tab.header } });
      }
    },

    setActiveByComponent(cmp) {
      const tab = this.tabs.find(t => t.header === cmp.header && t.headerClass === cmp.headerClass);

      if (tab) {
        this.setActive(tab);
      }
    }
  },

  template: `
<div class="tabs" :class="'placement-' + placement">
    <div class="tab-headers">
        <div v-for="tab in tabs" class="tab-header" :class="[{ active: tab === lastTab}, tab.headerClass]" @click="setActive(tab);" :title="tab.title">
            {{tab.header}}
            <div class="indicator" v-if="tab.indicator">{{tab.indicator}}</div>
        </div>
    </div>
    <div class="tab-contents">
        <slot></slot>
    </div>
</div>
    `
});

const DIRECTIONS = {
  UP: "N",
  RIGHT: "E",
  DOWN: "S",
  LEFT: "W",
  NONE: undefined
};

function getInDirection(from, nodes, direction) {
  return nodes.find(node => {
    return direction === DIRECTIONS.UP && from.x === node.x && from.y > node.y || direction === DIRECTIONS.DOWN && from.x === node.x && from.y < node.y || direction === DIRECTIONS.RIGHT && from.x < node.x && from.y === node.y || direction === DIRECTIONS.LEFT && from.x > node.x && from.y === node.y;
  });
}

Vue.component("dungeon-controls", {
  data: () => ({
    DIRECTIONS
  }),

  computed: {
    assaultContext() {
      return { assault: true };
    }
  },

  subscriptions() {
    return {
      node: ServerService$1.getNodeStream(),
      isDungeon: ServerService$1.getIsDungeonStream(),
      actions: ServerService$1.getNodeStream().switchMap(node => MapService$1.getNodeStream(node.id)).switchMap(node => Rx.Observable.combineLatestMap({
        nodes: node.paths.length ? Rx.Observable.combineLatest(node.paths.map(nodeId => MapService$1.getNodeStream(nodeId))) : Rx.Observable.of([]),
        current: Rx.Observable.of(node)
      })).map(({ nodes, current }) => {
        return Object.values(DIRECTIONS).toObject(dir => dir || DIRECTIONS.NONE, dir => {
          let result = {
            target: getInDirection(current, nodes, dir),
            name: "Travel"
          };
          const travelAction = result.target && result.target.actions && result.target.actions.find(a => a.id === "Travel");
          if (!travelAction || !travelAction.available) {
            const relevantStructure = [...current.structures].reverse().find(s => s.roomPlacement === dir);
            if (relevantStructure) {
              result = {
                structure: relevantStructure
              };
            }
          }
          return result;
        });
      })
    };
  },

  template: `
<div class="dungeon-controls-wrapper" v-if="isDungeon && actions">
    <div class="dungeon-controls">
        <div class="directional-action center">
            <node-structures v-if="actions[DIRECTIONS.NONE].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.NONE].structure.id" :icon-only="true" />
        </div>
        <div class="directional-action up">
            <node-structures v-if="actions[DIRECTIONS.UP].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.UP].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.UP].target" :include="[actions[DIRECTIONS.UP].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
        <div class="directional-action right">
            <node-structures v-if="actions[DIRECTIONS.RIGHT].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.RIGHT].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.RIGHT].target" :include="[actions[DIRECTIONS.RIGHT].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
        <div class="directional-action bottom">
            <node-structures v-if="actions[DIRECTIONS.DOWN].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.DOWN].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.DOWN].target" :include="[actions[DIRECTIONS.DOWN].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
        <div class="directional-action left">
            <node-structures v-if="actions[DIRECTIONS.LEFT].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.LEFT].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.LEFT].target" :include="[actions[DIRECTIONS.LEFT].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
    </div>
</div>
    `
});

Vue.component("travel-controls", {
  data: () => ({
    enemyOption: "avoid",
    showTheConfirmationModal: false
  }),

  subscriptions() {
    return {
      currentAction: DataService$1.getCurrentActionStream().do(currentAction => {
        switch (true) {
          case !currentAction || !currentAction.context || currentAction.actionId !== "Travel":
            break;
          case currentAction.context.disregard:
            this.enemyOption = "disregard";
            break;
          case currentAction.context.assault:
            this.enemyOption = "engage";
            break;
          default:
            this.enemyOption = "avoid";
        }
      }),
      triggerTravelStream: ServerService$1.getTriggerTravelStream().do(nodeId => {
        this.targetNodeId = nodeId;
        if (this.willInterrupt) {
          this.showTheConfirmationModal = true;
        } else {
          this.triggerTravel();
        }
      })
    };
  },

  computed: {
    willInterrupt() {
      return this.currentAction && this.currentAction.actionId !== "Travel" && this.currentAction.actionId !== "Sleep" || Utils$1.isDeepSleep(this.currentAction);
    }
  },

  methods: {
    triggerTravel() {
      this.showTheConfirmationModal = false;
      console.log(this.targetNodeId);
      ServerService$1.request("travel-order", {
        nodeId: this.targetNodeId,
        context: ServerService$1.getTravelContext()
      }).then(response => {
        if (typeof response === "string") {
          ToastNotification.notify(response);
        }
      });
    },

    selectOption(option) {
      this.enemyOption = option;

      let { skipUnknowns, assault, disregard } = false;
      switch (option) {
        case "avoid":
          skipUnknowns = assault = disregard = false;
          break;
        case "engage":
          assault = true;
          skipUnknowns = disregard = false;
          break;
        case "disregard":
          skipUnknowns = assault = disregard = true;
          break;
      }

      const context = {
        skipUnknowns,
        assault,
        disregard
      };

      ServerService$1.setTravelContext(context);

      ServerService$1.request("travel-context", context);
    },

    formatTimeAgo: Utils$1.formatTimeAgo,

    actuallyTravel() {}
  },

  template: `
<div class="travel-controls-wrapper">
    <current-action />
    <section class="travel-controls">
        <header>Travel</header>
        <div class="enemy-options selection-button-row">
            <button :class="{ active: enemyOption === 'avoid'}" @click.prevent="selectOption('avoid')">Avoid</button>
            <button :class="{ active: enemyOption === 'engage'}" @click.prevent="selectOption('engage')">Ambush</button>
            <button :class="{ active: enemyOption === 'disregard'}" @click.prevent="selectOption('disregard')">Disregard</button>
        </div>
        <div class="estimated">
            <span>Estimate:</span>
            <span v-if="currentAction.actionId === 'Travel'" class="values">
                {{formatTimeAgo(currentAction.ETA)}}
                <span v-if="currentAction.allETA && currentAction.allETA !== currentAction.ETA" class="estimate total">
                    ({{formatTimeAgo(currentAction.allETA)}})
                </span>
            </span>
            <span v-else class="values">
                Not travelling
            </span>
        </div>
<!--        <div class="warning" v-if="willInterrupt">-->
<!--            <interruption-warning :action="{ quick: false }" />-->
<!--        </div>-->
    </section>
    <modal v-if="showTheConfirmationModal" @close="showTheConfirmationModal = false">
        <div slot="header">
            Confirm Travel
        </div>
        <div slot="main">
            <interruption-warning :action="{ quick: false }" />
            <confirm-with-wakeup-warning :action="{ quick: false }" @action="triggerTravel();" />
        </div>
    </modal>
</div>
    `
});

let newListingsStream;
let rememberedListingsStream;

const TradingService = window.TradingService = {
  getNewListingsStream() {
    if (!newListingsStream) {
      newListingsStream = Rx.Observable.combineLatestMap({
        listingIds: DataService$1.getListingIdsStream(),
        rememberedListings: TradingService.getRememberedListingsStream()
      }).map(({ listingIds, rememberedListings }) => {
        const results = {};
        Object.keys(listingIds).forEach(creatureId => {
          results[creatureId] = results[creatureId] || {};

          listingIds[creatureId].forEach(listingId => {
            if (!rememberedListings[creatureId] || !rememberedListings[creatureId][listingId]) {
              results[creatureId][listingId] = true;
            }
          });
        });
        return results;
      });
    }
    return newListingsStream;
  },

  getRememberedListingsStream() {
    if (!rememberedListingsStream) {
      rememberedListingsStream = new Rx.ReplaySubject(1);
      let value;
      try {
        value = JSON.parse(localStorage.getItem("rememberedListings")) || {};
      } catch (e) {
        value = {};
      }
      rememberedListingsStream.next(value);
    }
    return rememberedListingsStream;
  },

  updateRememberedListingsStream() {
    Rx.Observable.combineLatestMap({
      listingIds: DataService$1.getListingIdsStream(),
      values: TradingService.getRememberedListingsStream()
    }).first().subscribe(({ values, listingIds }) => {
      Object.keys(listingIds).forEach(creatureId => {
        values[creatureId] = values[creatureId] || {};
        listingIds[creatureId].forEach(listingId => {
          values[creatureId][listingId] = true;
        });
      });
      localStorage.setItem("rememberedListings", JSON.stringify(values));
      rememberedListingsStream.next(values);
    });
  }
};

Vue.component("target-relationship-picker", {
    props: {
        value: {
            default: "everyone"
        }
    },

    methods: {
        selectTargets(targets) {
            this.$emit("input", targets);
        }
    },

    template: `
<div class="target-relationship-picker">
    <div class="item everyone" :class="{ active: value === 'everyone' }">
        <div class="button action icon text" @click.prevent="selectTargets('everyone');">
            <span class="icon-wrapper rival"><span class="multicolor-icon"></span></span>
            <span class="icon-wrapper neutral"><span class="multicolor-icon"></span></span>
            <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
        </div>
        <div class="text">Everyone</div>
    </div>
    <div class="item no-rivals" :class="{ active: value === 'no-rivals' }">
        <div class="button action icon text" @click.prevent="selectTargets('no-rivals');">
            <span class="icon-wrapper neutral"><span class="multicolor-icon"></span></span>
            <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
        </div>
        <div class="text">No rivals</div>
    </div>
    <div class="item friend" :class="{ active: value === 'friends' }">
        <div class="button action icon text" @click.prevent="selectTargets('friends');">
            <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
        </div>
        <div class="text">Friends</div>
    </div>
</div>
    `
});

const CONDITIONS = {
    UPTO100: [50, 100],
    UPTO50: [20, 50],
    UPTO20: [0, 20],
    UPTO0: [0]
};

Vue.component("item-condition-picker", {
    props: {
        item: null,
        value: null
    },

    data: () => ({
        CONDITIONS,
        INTEGRITY_CLASS: Object.keys(CONDITIONS).toObject(key => key, key => Utils.getIntegrityClass(CONDITIONS[key]))
    }),

    methods: {
        selectTargets(targets) {
            this.$emit("input", targets);
        },

        compare(v1, v2) {
            return JSON.stringify(v1) === JSON.stringify(v2);
        }
    },

    created() {
        this.$emit("input", CONDITIONS.UPTO100);
    },

    template: `
<div class="item-condition-picker">
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO100) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO100);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO100, item && item.integrityType ]"></span>
        </div>
        <div class="text">100% ~ 50%</div>
    </div>
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO50) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO50);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO50, item && item.integrityType ]"></span>
        </div>
        <div class="text">50% ~ 20%</div>
    </div>
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO20) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO20);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO20, item && item.integrityType ]"></span>
        </div>
        <div class="text">20% ~ 0%</div>
    </div>
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO0) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO0);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO0, item && item.integrityType ]"></span>
        </div>
        <div class="text">0%</div>
    </div>
</div>
    `
});

var _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("auto-trade", {
    data: () => ({
        sides: ["offering", "asking"],
        newListing: {
            offering: [],
            asking: []
        },
        addingToSide: null,
        selectedItem: null,
        selectedQty: 1,
        repetitions: 1,
        addingNewListing: false,
        acceptingTrade: false,
        currentAcceptTrade: null,
        acceptTradeTimes: 1,
        editingListingId: null,
        listingTarget: null,
        selectIntegrity: null,
        itemFilter: ""
    }),

    subscriptions() {
        const nodeStream = ServerService$1.getNodeStream();
        const newListingsStream = TradingService.getNewListingsStream();
        const tradeListingsStream = DataService$1.getTradeListingsStream();

        return {
            node: nodeStream,
            knownItems: DataService$1.getKnownItemsStream(),
            availableItemsCounts: DataService$1.getAvailableItemsCountsStream().startWith({}),
            myTradeListings: tradeListingsStream.pluck("self").map(listings => {
                const val = ({ listingTarget }) => listingTarget === "friends" ? 1 : listingTarget === "no-rivals" ? 2 : 3;
                let lastLabel = null;
                return [...listings].sort((a, b) => val(a) - val(b)).map(listing => {
                    listing.showLabel = lastLabel !== listing.listingTarget ? listing.listingTarget.replace("-", " ") : null;
                    lastLabel = listing.listingTarget;
                    return listing;
                });
            }),
            tradeListings: tradeListingsStream.pluck("others"),
            newListings: newListingsStream.first().do(() => {
                TradingService.updateRememberedListingsStream();
            }),
            availableForTrade: DataService$1.getAvailableItemsStream().map(items => {
                const mats = {};

                items.sort(Utils$1.itemsSorter).forEach(item => {
                    const key = item.tradeId;
                    if (mats[key]) {
                        mats[key].qty += item.qty;
                    } else {
                        mats[key] = _extends$6({}, item);
                    }
                });
                return mats;
            })
        };
    },

    computed: {
        additionsOptions() {
            const skip = {};
            this.newListing.asking.forEach(listing => {
                skip[listing.item.itemCode] = true;
            });

            const available = Object.values(this.knownItems.filter(item => !skip[item.itemCode]).reduce((acc, i) => {
                acc[i.itemCode] = i;
                return acc;
            }, {})).sort(Utils$1.itemsSorter);

            return available;
        }
    },

    methods: {
        ucfirst: Utils$1.ucfirst,
        min(...args) {
            return Math.min(...args);
        },

        tradingQuantityDisplay(side, element) {
            const total = element.qty * this.acceptTradeTimes;
            if (side === "asking") {
                return total + " / " + (this.availableItemsCounts[element.item.itemCode] || 0);
            }
            return total;
        },

        addingItemToListing(side) {
            this.addingToSide = side;
            this.selectedQty = 1;
        },

        selectingItem(item, withIntegrity = false) {
            this.selectedItem = item;
            if (withIntegrity) {
                this.selectIntegrity = item.integrity;
            }
        },

        applyItemSelection() {
            this.newListing[this.addingToSide] = [...this.newListing[this.addingToSide], {
                item: _extends$6({}, this.selectedItem, {
                    integrity: this.selectIntegrity,
                    tradeId: this.selectedItem.tradeId.replace("[50,100]", JSON.stringify(this.selectIntegrity))
                }),
                qty: this.selectedQty
            }];
            this.addingToSide = null;
        },

        commitListing() {
            if (this.editingListingId) {
                this.removeListing(this.editingListingId);
            }
            this.editingListingId = null;

            const getPayload = elements => {
                return elements.map(element => ({
                    tradeId: element.item.tradeId,
                    qty: element.qty
                }));
            };

            ServerService$1.request("addListing", {
                offering: getPayload(this.newListing.offering),
                asking: getPayload(this.newListing.asking),
                repetitions: this.repetitions,
                listingTarget: this.listingTarget
            }).then(() => {
                this.cancelListing();
            });
        },

        cancelListing() {
            this.newListing = {
                offering: [],
                asking: []
            };
            this.repetitions = 1;

            this.addingNewListing = false;
            this.editingListingId = null;
        },

        removeListing(tradeListingId) {
            ServerService$1.request("removeListing", {
                tradeListingId
            });
        },

        acceptTrade() {
            this.acceptingTrade = true;

            ServerService$1.request("acceptTradeListing", {
                creatureId: this.currentAcceptTrade.character.id,
                tradeListingId: this.currentAcceptTrade.listing.tradeListingId,
                qty: this.acceptTradeTimes
            }).then(response => {
                setTimeout(() => {
                    this.acceptingTrade = false;
                }, 500);

                if (response === true) {
                    this.currentAcceptTrade = null;
                    response = "Trade complete";
                }
                ToastNotification.notify(response);
            });
        },

        openAcceptTrade(character, listing) {
            this.currentAcceptTrade = {
                character,
                listing
            };
        },

        editListing(listing) {
            this.editingListingId = listing.tradeListingId;
            this.listingTarget = listing.listingTarget;

            this.newListing = JSON.parse(JSON.stringify(listing));
            this.repetitions = listing.repetitions;

            this.addingNewListing = true;
        },

        addNewListing() {
            this.listingTarget = "no-rivals";
            this.addingNewListing = true;
        },

        removeItemFromNewListing(side, itemCode) {
            const idx = this.newListing[side].findIndex(element => element.item.itemCode === itemCode);

            if (idx !== -1) {
                this.newListing[side].splice(idx, 1);
            }
        }
    },

    template: `
<div class="auto-trade player-trades" v-if="myTradeListings && knownItems">
    <section>
        <header>Trade listings</header>
        <!--<div>TODO: Add a toggle on/off</div>-->
        <table v-if="myTradeListings.filter(listing => editingListingId !== listing.tradeListingId).length" class="full-width">
            <tr class="header">
                <td v-for="side in sides" :class="side">
                    {{ucfirst(side)}}
                </td>
                <td colspan="2" width="1%">
                    Times
                </td>
            </tr>
            <template v-for="(listing, listingIdx) in myTradeListings" v-if="editingListingId !== listing.tradeListingId">
                <tr v-if="listing.showLabel">
                    <td colspan="4" class="listing-target">{{ucfirst(listing.showLabel)}}</td>
                </tr>
                <tr>
                    <td v-for="side in sides" :class="side">
                        <item-icon
                            v-for="element in listing[side]"
                            size="small"
                            :key="element.item.tradeId"
                            :src="element.item.icon"
                            :qty="element.qty"
                            :details="element.item"
                            :trinket="element.item.houseDecoration && element.item.buffs"
                            :integrity="element.item.integrity"
                            :integrityType="element.item.integrityType"
                        ></item-icon>
                    </td>
                    <td class="count">
                        {{listing.repetitions}} <span v-if="listing.maxRepetitions < 9999">({{listing.maxRepetitions}})</span>
                    </td>
                    <td class="action-container">
                        <button class="action edit icon" @click="editListing(listing);">
                            <div class="icon"></div>
                        </button>
                        <button class="action delete icon" @click="removeListing(listing.tradeListingId);">
                            <div class="icon"></div>
                        </button>
                    </td>
                </tr>
            </template>
        </table>
        <modal v-if="addingNewListing" class="new-listing" @close="cancelListing()">
            <template slot="header">
                {{editingListingId ? 'Update listing' : 'Add listing'}}
            </template>
            <template slot="main">
                <table class="full-width">
                    <tr class="header">
                        <td v-for="side in sides" :class="side">
                            <section><header class="secondary">{{ucfirst(side)}}</header></section>
                        </td>
                        <td width="1%">
                            <section><header class="secondary">Times</header></section>
                        </td>
                    </tr>
                    <tr>
                        <td v-for="side in sides" :class="side">
                            <div class="wrapping">
                                <item-icon
                                    v-for="element in newListing[side]"
                                    :key="element.item.tradeId"
                                    :src="element.item.icon"
                                    :integrity="element.item.integrity"
                                    :integrityType="element.item.integrityType"
                                    :trinket="element.item.houseDecoration && element.item.buffs"
                                    :qty="element.qty"
                                    @click="removeItemFromNewListing(side, element.item.itemCode);"
                                ></item-icon>
                            </div>
                            <div class="utility-button-item">
                                <item-icon
                                    @click="addingItemToListing(side)"
                                    src="images/ui/plus_01_org_small_dark.png"
                                ></item-icon>
                            </div>
                        </td>
                        <td>
                            <number-selector class="number-select" v-model="repetitions" :min="0" :max="9999"></number-selector>
                        </td>
                    </tr>
                </table>
                <section><header class="secondary">Available to:</header></section>
                <target-relationship-picker v-model="listingTarget" />
                <div class="centered">
                    <button class="button" @click="commitListing();">Confirm {{editingListingId ? 'changes' : 'listing'}}</button>
                </div>
                <div class="centered">
                    <button class="button" @click="cancelListing();">Cancel</button>
                </div>
            </template>
        </modal>
        <div class="centered">
            <button class="button" @click="addNewListing();">New listing</button>
        </div>
    </section>
    <section v-for="character in tradeListings" v-if="character.listings && character.listings.length">
        <header class="no-wrap">{{character.name}}: Trade listing</header>
        <table class="full-width">
            <tr class="header">
                <td v-for="side in sides" :class="side" width="33%">
                    {{ucfirst(side)}}
                </td>
                <td colspan="2">
                    Times
                </td>
            </tr>
            <tr
                v-for="listing in character.listings"
                class="item-listing-offer"
                :class="{ 'is-new-listing': newListings[character.id] && newListings[character.id][listing.tradeListingId] }"
            >
                <td v-for="side in sides" :class="side">
                    <item-icon
                        v-for="element in listing[side]"
                        size="small"
                        :key="element.item.tradeId"
                        :src="element.item.icon"
                        :qty="element.qty"
                        :details="element.item"
                        :integrity="element.item.integrity"
                        :integrityType="element.item.integrityType"
                        :trinket="element.item.houseDecoration && element.item.buffs"
                    ></item-icon>
                </td>
                <td class="count">
                    {{min(listing.repetitions, listing.maxRepetitions)}}
                </td>
                <td>
                    <button class="action accept icon" :disabled="acceptingTrade" @click="openAcceptTrade(character, listing)">
                        <div class="icon"></div>
                    </button>
                </td>
            </tr>
        </table>
    </section>
    <modal class="auto-trade player-trades" v-if="currentAcceptTrade" @close="currentAcceptTrade = null">
        <template slot="header">
            Trade: {{currentAcceptTrade.character.name}}
        </template>
        <template slot="main" class="item-list">
            <div class="flex-grow">
                <table class="full-width">
                    <tr>
                        <td width="50%"><section><header class="secondary">Receiving</header></section></td>
                        <td width="50%"><section><header class="secondary">Giving</header></section></td>
                    </tr>
                    <tr>
                        <td v-for="side in sides" :class="side">
                            <item-icon
                                v-for="element in currentAcceptTrade.listing[side]"
                                :key="element.item.tradeId"
                                :src="element.item.icon"
                                :qty="tradingQuantityDisplay(side, element)"
                                :integrity="element.item.integrity"
                                :integrityType="element.item.integrityType"
                                :trinket="element.item.houseDecoration && element.item.buffs"
                                :details="element.item"
                            ></item-icon>
                        </td>
                    </tr>
                </table>
            </div>
            <form class="controls">
                <number-selector class="number-select" v-model="acceptTradeTimes" :min="1" :max="min(currentAcceptTrade.listing.repetitions, currentAcceptTrade.listing.maxRepetitions)"></number-selector>
                <div>
                    <button @click.prevent="acceptTrade();">Confirm</button>
                </div>
            </form>
        </template>
    </modal>
    <modal class="auto-trade player-trades" v-if="addingToSide" @close="addingToSide = null">
        <template slot="header">
            Select item
        </template>
        <template slot="main" class="item-list">
            <div class="item-selection">
                <input v-model="itemFilter" placeholder="Start typing to filter..." />
                <section v-if="addingToSide === 'offering'">
                    <header class="secondary">Inventory</header>
                    <div class="item-list">
                        <item
                            v-for="item in availableForTrade"
                            v-if="item.tradeId && item.tradeId !== 'null' && item.name.toLowerCase().includes(itemFilter.toLowerCase())"
                            :key="item.tradeId"
                            :data="item"
                            :interactable="false"
                            :class="{ selected: selectedItem && selectedItem.tradeId === item.tradeId }"
                            @click="selectingItem(item, true)"
                        />
                    </div>
                </section>
                <section>
                    <header class="secondary">Known items</header>
                    <div class="item-list">
                        <item
                            v-for="item in additionsOptions"
                            v-if="item.tradeId && item.tradeId !== 'null' && item.name.toLowerCase().includes(itemFilter.toLowerCase())"
                            :key="item.tradeId"
                            :data="item"
                            :interactable="false"
                            :class="{ selected: selectedItem && selectedItem.tradeId === item.tradeId }"
                            @click="selectingItem(item)"
                        />
                    </div>
                </section>
<!--                <div v-if="selectedItem" class="help-text">{{selectedItem.name}}</div>-->
            </div>
            <div class="other-selection">
                <item-condition-picker v-model="selectIntegrity" :item="selectedItem" />
                <form class="controls">
                    <number-selector class="number-select" v-model="selectedQty" :min="1" :max="9999"></number-selector>
                    <div>
                        <button :disabled="!selectedItem" @click.prevent="applyItemSelection();">Confirm</button>
                    </div>
                </form>
            </div>
        </template>
    </modal>
</div>
    `
});

Vue.component("inventory-on-the-ground", {
  data: () => ({
    showFilter: false,
    nameFilter: ""
  }),

  subscriptions() {
    return {
      nodeInventory: DataService$1.getNodeItemsStream()
    };
  },

  computed: {
    itemFilter() {
      return item => !this.nameFilter || !this.showFilter || item.name.toLowerCase().includes(this.nameFilter.toLowerCase());
    }
  },

  methods: {
    focusFilter() {
      setTimeout(() => {
        const filter = this.$refs.filter;
        if (filter) {
          filter.focus();
        }
      });
    }
  },

  template: `
<div class="player-inventory">
    <section v-if="nodeInventory">
        <input ref="filter" class="full-width margin-bottom" v-if="showFilter" v-model="nameFilter" placeholder="Start typing to filter..." />
        <header>
            <toggle-filter-button v-model="showFilter" @input="focusFilter()" />
            Items on the ground
            <help-icon title="Items on the ground" class="left-side">
                Item left on the ground will dissipate after some time.
            </help-icon>
        </header>
        <div v-if="!nodeInventory.length" class="empty-list"></div>
        <inventory :data="nodeInventory" :filter="itemFilter" />
    </section>
</div>
    `
});

Vue.component("player-effects", {
  props: {
    onlyIcons: Boolean,
    onlyHighSev: Boolean,
    size: String
  },

  subscriptions() {
    return {
      myCreature: DataService$1.getMyCreatureStream()
    };
  },

  methods: {
    onClick() {
      ContentFrameService.triggerShowPanel("effects");
    }
  },

  template: `
<creature-effects
    @click="onClick()"
    class="player-effects"
    :class="{ interactable: onlyIcons }"
    :size="size"
    :creature="myCreature"
    :only-icons="onlyIcons"
    :only-high-sev="onlyHighSev"
/>
    `
});

Vue.component("player-effects-full-panel", {
  props: {
    size: String
  },

  data: () => ({
    buffDetail: null
  }),

  computed: {
    buffDetailCreature() {
      return { buffs: this.buffDetail ? [this.buffDetail] : [] };
    }
  },

  subscriptions() {
    return {
      myCreature: DataService$1.getMyCreatureStream(),
      effectsGroups: DataService$1.getMyCreatureStream().map(creature => {
        const grouped = creature.buffs.reduce((acc, buff) => {
          acc[buff.category] = acc[buff.category] || { buffs: [] };
          acc[buff.category].buffs.push(buff);
          return acc;
        }, {});
        return Object.keys(grouped).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).toObject(key => key.split(":")[1], key => grouped[key]);
      })
    };
  },

  template: `
<div>
    <div class="buff-tip panel-tip" @click="buffDetail = null" v-if="buffDetail">
        <creature-effects
            class="player-effects"
            :size="size"
            :creature="buffDetailCreature"
        />
    </div>
    <div class="player-effects-grouped">
        <section v-for="(creatureMock, category) in effectsGroups">
            <header class="secondary">{{category}}</header>
            <creature-effects
                class="player-effects"
                :size="size"
                :creature="creatureMock"
                @click="buffDetail = $event"
            />
        </section>
    </div>
<!--    <creature-effects-->
<!--        class="player-effects"-->
<!--        :size="size"-->
<!--        :creature="myCreature"-->
<!--    />-->
</div>
    `
});

Vue.component("player-effects-summary", {
  subscriptions() {
    return {
      effectsSummary: DataService$1.getEffectsSummaryStream(),
      effectsGroups: DataService$1.getEffectsSummaryStream().map(effectsSummary => {
        const grouped = Object.keys(effectsSummary).reduce((acc, stat) => {
          const buff = effectsSummary[stat];
          acc[buff.group] = acc[buff.group] || {};
          acc[buff.group][stat] = buff;
          return acc;
        }, {});
        return Object.keys(grouped).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).toObject(key => key.split(":")[1], key => grouped[key]);
      })
    };
  },

  template: `
<div class="item-properties player-effects-summary" v-if="effectsSummary">
    <section v-for="(effects, label) in effectsGroups">
        <header class="secondary">{{label}}</header>
        <div v-for="(buff, stat) in effects" class="value" v-if="buff.value !== 0">
            {{stat}}: <buff-value :buff="buff" />
        </div>
    </section>
</div>
    `
});

Vue.component("carry-capacity-indicator", {
  props: {
    current: Number,
    thresholds: Object,
    max: Number
  },

  computed: {
    burdenLevel() {
      if (!this.thresholds) {
        return null;
      }
      return +Object.keys(this.thresholds).find(key => this.currentMined <= this.thresholds[key]);
    },

    actualMax() {
      return this.thresholds ? this.thresholds[2] : this.max;
    },

    fillStyle() {
      const width = this.currentMined / this.actualMax * 100;
      return {
        width: `${width}%`
      };
    },

    fillCutStyle() {
      const width = 100 / (this.currentMined / this.actualMax);
      return {
        width: `${width}%`
      };
    },

    currentMined() {
      return Math.max(0, this.current);
    },

    currentText() {
      return Utils$1.decimalTwo(this.currentMined, Math.ceil);
    },

    maxText() {
      return Utils$1.decimalTwo(this.actualMax);
    },

    displayText() {
      return `${Utils$1.decimalTwo(this.currentMined)} / ${Utils$1.decimalTwo(this.actualMax)}`;
    },

    overburdened() {
      return this.currentMined > this.actualMax;
    },

    burdenLevelClass() {
      return this.burdenLevel !== undefined ? `burden-${this.burdenLevel}` : undefined;
    }
  },

  template: `
<div class="carry-capacity">
    <div class="bar" :class="[{ overburdened: overburdened }, burdenLevelClass]">
        <div class="display under"><decimal-secondary :value="currentText" /> / <decimal-secondary :value="maxText" /></div>
        <div class="fill-cut" :style="fillStyle">
            <div class="fill" :style="fillCutStyle">
                <div class="display over"><decimal-secondary :value="currentText" /> / <decimal-secondary :value="maxText" /></div>
            </div>
        </div>
    </div>
</div>
    `
});

Vue.component("player-inventory", {
  data: () => ({ showFilter: false, nameFilter: "" }),

  subscriptions() {
    return {
      inventory: DataService$1.getMyInventoryStream()
    };
  },

  computed: {
    itemFilter() {
      return item => !this.nameFilter || !this.showFilter || item.name.toLowerCase().includes(this.nameFilter.toLowerCase());
    }
  },

  methods: {
    focusFilter() {
      setTimeout(() => {
        const filter = this.$refs.filter;
        if (filter) {
          filter.focus();
        }
      });
    }
  },

  template: `
<div class="player-inventory">
    <input ref="filter" class="full-width margin-bottom filter-input" v-if="showFilter" v-model="nameFilter" placeholder="Start typing to filter..." />
    <div class="inventory-wrapper">
        <section v-if="inventory">
            <header>
                <toggle-filter-button v-model="showFilter" @input="focusFilter()" />
                Inventory
            </header>
            <carry-capacity-indicator
                :current="inventory.weights.currentWeight"
                :thresholds="inventory.weights.thresholds"
            />
            <inventory :data="inventory.items" type="player" :filter="itemFilter"></inventory>
        </section>
        <storage-inventory :filter="itemFilter" />
    </div>
</div>
    `
});

Vue.component("equipment-selector", {
  props: ["equipmentSlot"],

  data: () => ({
    expanded: false,
    equipActionFinder: () => false,
    unequipActionFinder: () => false
  }),

  subscriptions() {
    return {
      validItems: Rx.Observable.combineLatestMap({
        items: DataService$1.getMyInventoryStream().map(inventory => inventory.items),
        equipActionFinder: this.stream("equipActionFinder")
      }).map(({ items, equipActionFinder }) => items.filter(item => item.actions.some(equipActionFinder))),
      equipment: DataService$1.getMyEquipmentStream().distinctUntilChanged(null, JSON.stringify)
    };
  },

  watch: {
    equipmentSlot: {
      handler() {
        this.equipActionFinder = a => a.id === `Equip: ${this.equipmentSlot}`;
        this.unequipActionFinder = a => a.id === `Unequip: ${this.equipmentSlot}`;
      },
      immediate: true
    },
    expanded() {
      if (this.expanded) {
        if (window.expandedSelector && window.expandedSelector !== this) {
          window.expandedSelector.expanded = false;
        }
        window.expandedSelector = this;
      }
    }
  },

  computed: {
    border() {
      return Utils$1.equipmentSlotBorder(this.equipmentSlot);
    },

    showSelector() {
      return this.equippedItem || this.validItems && this.validItems.length;
    },

    equippedItem() {
      if (!this.equipment) return null;
      const theSlot = this.equipment.find(slot => slot.slot === this.equipmentSlot);
      return theSlot && theSlot.item;
    }
  },

  methods: {
    equipItem(item) {
      const action = item.actions.find(this.equipActionFinder);
      ServerService$1.request("action", {
        action: action.id,
        target: item.id,
        context: action.context
      }).then(() => {
        this.expanded = false;
      });
    },

    unequipCurrent() {
      const item = this.equippedItem;
      const action = item.actions.find(this.unequipActionFinder);
      ServerService$1.request("action", {
        action: action.id,
        target: item.id,
        context: action.context
      }).then(() => {
        this.expanded = false;
      });
    }
  },

  template: `
<div class="equipment-selector" :class="{ expanded: expanded }">
    <label>Selection: {{equipmentSlot}}</label>
    <div class="selected-item" @click="expanded = !expanded">
        <item :border="border" :data="equippedItem" v-if="equippedItem" :interactable="false" />
        <item-icon :border="border" v-else="" @click="" class="empty" />
    </div>
    <div class="available-items" v-if="expanded">
        <div class="utility-button-item">
            <item-icon v-if="equippedItem" @click="unequipCurrent()" src="images/ui/checkbox_01.png"></item-icon>
        </div>
        <item v-for="(item, idx) in validItems" :interactable="false" :data="item" :key="'i' + idx" @click="equipItem(item)"></item>
    </div>
</div>
`
});

Vue.component("player-equipment", {
    data: () => ({}),

    subscriptions() {
        return {
            equipment: DataService$1.getMyEquipmentStream()
        };
    },

    template: `
<div class="player-equipment" v-if="equipment">
    <section>
        <header>Equipment</header>
        <div v-for="(slot, idx) in equipment" class="list-item-with-props">
            <div class="main-icon">
                <equipment-selector :equipment-slot="slot.slot"/>
            </div>
            <div class="details">
                <div class="label">
                    <div>{{slot.slot}}</div>
                </div>
                <div class="description help-text" v-if="slot.item">
                    {{slot.item.name}}
                </div>
            </div>
        </div>
    </section>
</div>
    `
});

var _extends$7 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("perk-icon", {
    props: {
        src: String,
        small: Boolean,
        tiny: Boolean
    },

    template: `
<div
    class="item-icon perk-icon"
    :class="{ interactable: $listeners.click, small: small, tiny: tiny }"
    @click="$emit('click', $event)"
>
    <div class="slot">
        <img :src="src" v-if="src">
        <slot></slot>
    </div>
</div>
    `
});

Vue.component("perks", {
    data: () => ({
        pointBalance: 0
    }),

    computed: {
        soulLevelFull() {
            return Math.floor(this.soulLevel);
        }
    },

    subscriptions() {
        const soulInfoStream = Rx.Observable.fromPromise(ServerService$1.request("getSoulInfo"));

        return {
            soulPoints: soulInfoStream.pluck("soulPoints").do(soulPoints => this.pointBalance = soulPoints),
            soulLevel: soulInfoStream.pluck("soulLevel"),
            perks: soulInfoStream.pluck("perks").map(perks => perks.map(perk => _extends$7({}, perk, {
                effectsText: Utils$1.formatEffects(perk).filter(text => !!text).join(", ")
            })))
        };
    },

    methods: {
        togglePerk(perk) {
            if (!perk.selected && this.pointBalance < perk.pointCost) {
                ToastNotification.notify("Not enough perk points");
                return;
            }

            perk.selected = !perk.selected;

            const selected = this.perks.filter(p => p.selected);

            this.$emit("perks-selected", selected);

            this.pointBalance = this.soulPoints - selected.reduce((acc, i) => acc + i.pointCost, 0);
        },

        skillProgress(value) {
            return (value - Math.floor(value)) * 100;
        }
    },

    template: `
<section class="perks" v-if="perks && perks.length">
    <header>Traits ({{pointBalance}})</header>
    <div class="skill-indicator" v-if="soulLevel > 0">
        <div class="skill-level" :class="'skill-level-' + soulLevelFull">{{soulLevelFull}}</div>
        <div class="skill-name">Soul Level</div>
        <div class="skill-meter">
            <div class="background"></div>
            <div
                class="meter-clip"
                :style="{ width: (skillProgress(soulLevel) || 0) + '%' }"
            >
                <div class="meter-bar blue" :style="{ 'background-size': (1000 / (skillProgress(soulLevel) || 0)) + '% 100%' }"></div>
            </div>
        </div>
    </div>
    <div class="perks-list-wrapper">
        <div class="perks-list">
            <div v-for="perk in perks" class="list-item-with-props interactable perk-item" :class="{selected: perk.selected}" @click="togglePerk(perk)">
                <div class="main-icon">
                    <perk-icon :src="perk.icon"></perk-icon>
                </div>
                <div class="details">
                    <div class="label">
                        <div>{{perk.name}} ({{perk.pointCost}})</div>
                    </div>
                    <div class="description help-text">
                        {{perk.effectsText}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
    `
});

Vue.component("info-helper", {
  props: ["info", "params"],

  data: () => ({
    showing: false
  }),

  subscriptions() {
    return {
      infoData: Rx.Observable.combineLatestMap({
        info: this.stream("info"),
        params: this.stream("params"),
        showing: this.stream("showing")
      }).switchMap(({ info, params, showing }) => showing ? Rx.Observable.fromPromise(ServerService$1.getInfo(info, params)) : Rx.Observable.of(""))
    };
  },

  template: `
<help-icon class="action-help-icon" :title="infoData.title" @show="showing = true" @hide="showing = false">
    <div v-html="infoData.text" />
</help-icon>
    `
});

// const skillLevels = {
//     0: 'Dabbling',
//     1: 'Novice',
//     2: 'Competent',
//     3: 'Proficient',
//     4: 'Professional',
//     5: 'Accomplished',
//     6: 'Expert',
//     7: 'Master',
//     8: 'High Master',
//     9: 'Grand Master',
//     10: 'Legendary',
// };

Vue.component("decimal-secondary", {
  props: {
    value: 0,
    decimals: {
      default: 2
    }
  },

  computed: {
    main() {
      return Math.floor(this.value);
    },

    secondary() {
      return this.value.toString().replace(/[^.]+/, "").substr(0, this.decimals + 1);
    }
  },

  template: `
<span class="decimal-secondary">
    <span class="decimal-secondary-main">{{main}}</span><span class="decimal-secondary-decimal">{{secondary}}</span>
</span>
    `
});

Vue.component("player-stats", {
  data: () => ({
    detailed: false
  }),

  subscriptions() {
    return {
      playerInfo: DataService$1.getPlayerInfoStream(),
      effectsSummarySimple: DataService$1.getEffectsSummaryStream().map(effectsSummary => {
        return Object.keys(effectsSummary).toObject(key => key, key => effectsSummary[key].value);
      }).startWith({})
    };
  },

  methods: {
    abs: Math.abs.bind(Math),

    skillWidth(skill) {
      return this.fractionPercentage(skill.level);
    },

    missingWidth(skill) {
      return Math.min(-skill.buffed * 100, 100 - this.skillWidth(skill));
    },

    buffedWidth(skill) {
      return 100 * skill.buffed * 100 / this.skillWidth(skill);
    },

    skillLevel(value) {
      const level = Math.floor(value);
      return level === 10 ? "L" : level;
    },

    fractionPercentage(value) {
      return (value - Math.floor(value)) * 100 || 0;
    },

    roundStat(value) {
      return Math.round(value * 100) / 100;
    }
  },

  template: `
<div v-if="playerInfo">
    <section class="item-properties">
        <header>Statistics</header>
        Age: <span class="value">{{playerInfo.age}}</span>
        <div
            v-for="(value, stat) in playerInfo.stats"
            class="player-stat"
            :class="{ breakdown: detailed }"
        >
            <span @click="detailed = !detailed" class="click-wrapper">
                <span>{{stat}}:</span> 
                <span class="value">
                    <span v-if="detailed" class="numbers">
                        <decimal-secondary :value="roundStat(value - (effectsSummarySimple[stat] || 0))" />
                        <div class="symbol">{{effectsSummarySimple[stat] >= 0 ? '+' : '-'}}</div>
                        <decimal-secondary :value="abs(effectsSummarySimple[stat] || 0)" />
                        <div class="symbol">=</div>
                    </span>
                    <decimal-secondary :value="value" />
                </span>
            </span>
            <info-helper info="statDescription" :params="stat" />
        </div>
    </section>
    <section>
        <header>Skills</header>
<!--        <div class="skill-indicator" v-if="soulLevel > 0">-->
<!--            <div class="skill-level" :class="'skill-level-' + soulLevelFull">{{soulLevelFull}}</div>-->
<!--            <div class="skill-name">Soul Level</div>-->
<!--            <div class="skill-meter">-->
<!--                <div class="background"></div>-->
<!--                <div-->
<!--                    class="meter-clip"-->
<!--                    :style="{ width: (skillProgress(soulLevel) || 0) + '%' }"-->
<!--                >-->
<!--                    <div class="meter-bar blue"></div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

        <div v-for="skill in playerInfo.skills" class="skill-indicator" :class="{ 'max-level': skill.maxLevel }">
            <div class="skill-level" :class="'skill-level-' + skillLevel(Math.max(skill.level, 0))">{{skillLevel(skill.level)}}</div>
            <div class="skill-name">{{skill.name}}</div>
            <info-helper info="skillDescription" :params="skill.id" />
            <div class="skill-meter" v-if="!skill.maxLevel">
                <div class="background"></div>
                <div
                    class="meter-clip"
                    :style="{ width: skillWidth(skill) + '%' }"
                >
                    <div class="meter-bar" :style="{ 'background-size': (1000 / skillWidth(skill)) + '% 100%' }"></div>
                    <div
                        v-if="skill.buffed > 0"
                        class="meter-clip-highlight"
                        :style="{ width: buffedWidth(skill) + '%' }"
                    >
                    </div>
                </div>
                <div
                    v-if="skill.buffed < 0"
                    class="meter-clip-missing"
                    :style="{ left: skillWidth(skill) + '%', width: missingWidth(skill) + '%' }"
                >
                </div>
            </div>
        </div>
    </section>
</div>
    `
});

var _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("player-trades", {
  data: () => ({
    addingItem: null,
    selectedItem: null,
    selectedQty: 1,
    executingPromise: {},
    executingPromiseCancel: {}
  }),

  subscriptions() {
    return {
      trades: DataService$1.getMyTradesStream(),
      availableForTrade: DataService$1.getAvailableItemsStream().map(items => {
        const mats = {};
        items.sort(Utils$1.itemsSorter).forEach(item => {
          const key = item.tradeId;
          if (!key || key === "null") {
            return;
          }
          if (mats[key]) {
            mats[key].qty += item.qty;
          } else {
            mats[key] = _extends$8({}, item);
          }
        });
        return mats;
      })
    };
  },

  methods: {
    commenceTrade(trade) {
      this.$set(this.executingPromise, trade.id, ServerService$1.request("commenceTrade", {
        trade: trade.id
      }).then(result => {
        if (result !== true && result !== false) {
          ToastNotification.notify(result);
        }
      }));
    },

    acceptTrade(trade) {
      this.$set(this.executingPromise, trade.id, ServerService$1.request("acceptTrade", {
        trade: trade.id
      }));
    },

    cancelTrade(trade) {
      this.$set(this.executingPromiseCancel, trade.id, ServerService$1.request("cancelTrade", {
        trade: trade.id
      }));
    },

    selectingItem(item) {
      this.selectedItem = item;
    },

    addingItemTo(trade) {
      this.addingItem = trade;
      this.selectedItem = null;
      this.selectedQty = 1;
    },

    removeItemFromTrade(trade, removeIdx) {
      ServerService$1.request("setTradeItems", {
        trade: trade.id,
        items: trade.items.yours.filter((item, idx) => removeIdx !== idx).map(i => ({
          tradeId: i.item.tradeId,
          qty: i.qty
        }))
      });
    },

    applyItemSelection() {
      // TODO: ensure no duplicates
      ServerService$1.request("setTradeItems", {
        trade: this.addingItem.id,
        items: [...(this.addingItem.items.yours || []).map(i => ({
          tradeId: i.item.tradeId,
          qty: i.qty
        })), {
          tradeId: this.selectedItem.tradeId,
          qty: this.selectedQty
        }]
      });
      this.addingItem = null;
    },

    includedAlready(tradeId) {
      const trade = this.trades.find(t => t.id === this.addingItem.id);
      return trade.items.yours.some(i => i.item.tradeId === tradeId);
    }
  },

  template: `
<div class="player-trades" v-if="trades">
    <section>
        <header>Pending Trades</header>
        <div v-if="!trades.length" class="empty-list"></div>
    </section>
    <section v-for="trade in trades">
        <header>Trade: {{trade.with}}</header>
        <div class="trade-sides">
            <div class="trade-side" :class="{ accepted: trade.accepted.you }">
                <span class="header">Your items</span>
                <div class="item-list">
                    <div v-for="(item, idx) in trade.items.yours">
                        <item-icon @click="removeItemFromTrade(trade, idx)" :src="item.item.icon" :qty="item.qty" :trinket="item.item.houseDecoration ? item.item.buffs : null" :integrity="item.item.integrity"></item-icon>
                    </div>
                </div>
                <div class="utility-button-item">
                    <item-icon @click="addingItemTo(trade)" src="images/ui/plus_01_org_small_dark.png"></item-icon>
                </div>
            </div>
            <div class="trade-side" :class="{ accepted: trade.accepted.them }">
                <span class="header">Their items</span>
                <div class="item-list">
                    <div v-for="(item, idx) in trade.items.theirs">
                        <item-icon :src="item.item.icon" :qty="item.qty" :integrity="item.item.integrity" :details="item.item" :trinket="item.item.houseDecoration ? item.item.buffs : null"></item-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="centered">
            <loader-button
                class="button"
                @click="commenceTrade(trade)"
                v-if="trade.accepted.you && trade.accepted.them"
                :promise="executingPromise[trade.id]"
            >
                Commence
            </loader-button>
            <loader-button
                class="button"
                @click="acceptTrade(trade)"
                v-else
                :promise="executingPromise[trade.id]"
                :class="{ disabled: trade.acceptBlocked || (!trade.items.theirs.length && !trade.items.yours.length) }"
            >
                Accept
            </loader-button>
            <loader-button :promise="executingPromiseCancel[trade.id]" class="button" @click="cancelTrade(trade)">Cancel</loader-button>
        </div>
    </section>
    <modal v-if="addingItem" @close="addingItem = null" class="player-trades">
        <template slot="header">
            Select item
        </template>
        <template slot="main" class="item-list">
            <div class="item-list">
                <item-icon
                    v-for="item in availableForTrade"
                    :key="item.tradeId"
                    v-if="!includedAlready(item.tradeId)"
                    :class="{ selected: selectedItem && selectedItem.tradeId === item.tradeId }"
                    :src="item.icon"
                    :qty="item.qty"
                    :integrity="item.integrity"
                    :trinket="item.houseDecoration ? item.buffs : null"
                    @click="selectingItem(item)"
                >
                </item-icon>
            </div>
            <div v-if="selectedItem" class="help-text">{{selectedItem.name}}</div>
            <form class="controls">
                <number-selector class="number-select" v-model="selectedQty" :min="1" :max="(selectedItem && selectedItem.qty) || 1"></number-selector>
                <div>
                    <button :disabled="!selectedItem" @click.prevent="applyItemSelection();">Confirm</button>
                </div>
            </form>
        </template>
    </modal>
</div>
    `
});

Vue.component("player-quests", {
    data: () => ({
        dialogueResponse: null
    }),

    subscriptions() {
        return {
            quests: DataService$1.getMyQuestsStream()
        };
    },

    created() {
        this.requestId = 0;
    },

    methods: {
        questAction(quest) {
            this.selectedQuest = quest;
            this.dialogueResponse = {
                loading: true
            };
            this.requestId += 1;
            const requestId = this.requestId;
            return ServerService$1.request("questDialogue", {
                questId: quest.id
            }).then(response => {
                if (requestId === this.requestId) {
                    this.dialogueResponse = response;
                }
            });
        },

        close() {
            this.requestId += 1;
            this.dialogueResponse = null;
        },

        selectDialogueOption(option) {
            this.requestId += 1;
            const requestId = this.requestId;
            return ServerService$1.request("questDialogue", {
                questId: this.selectedQuest.id,
                option
            }).then(response => {
                if (requestId === this.requestId) {
                    this.dialogueResponse = response;
                }
            });
        }
    },

    template: `
<div class="player-quests" v-if="quests">
    <section>
        <header>Quests</header>
        <div v-for="quest in quests" class="quest">
            <div class="title">
                {{quest.title}}
            </div>
            <div class="description help-text">{{quest.description}}</div>
            <div v-for="obj in quest.objectives" class="objective" :class="{ complete: obj.progress >= 1 }">
                <div class="checkmark"></div>
                <div class="label">{{obj.label}}</div>
                <div v-if="obj.target" class="progress-bar">
                    <div class="fill" :style="{ width: Math.min(obj.progress * 100, 100) + '%' }"></div>
                </div>
            </div>
            <div class="centered">
                <button @click="questAction(quest)" :class="[{ highlight: !quest.reviewed}, quest.completed ? 'proceed' : 'info']">
                    {{quest.completed ? 'Proceed' : 'Info'}}
                </button>
            </div>
        </div>
    </section>
    <modal v-if="dialogueResponse" @close="close();">
        <template slot="header">
            {{selectedQuest.title}}
        </template>
        <template slot="main">
            <div v-if="dialogueResponse.loading">
                Loading....
            </div>
            <div v-else class="dialogue-mode">
                <div class="npc-text">
                    <animated-text :text="dialogueResponse.text" :key="dialogueResponse.option">
                        <img v-if="dialogueResponse.icon" class="npc-icon" :src="dialogueResponse.icon">
                    </animated-text>
                    <br/>
                </div>
                <div class="dialog-choices">
                    <div
                        v-for="dialogueOption in dialogueResponse.options"
                        class="dialog-option"
                        :class="{ disabled: dialogueOption.available !== true }"
                        @click="dialogueOption.available === true && selectDialogueOption(dialogueOption.option)"
                    >
                        <span>{{dialogueOption.label}} <span v-if="dialogueOption.available !== true">({{dialogueOption.available}})</span></span>
                    </div>
                    <div
                        class="dialog-option"
                        @click="dialogueResponse = false;"
                    >
                        <span>Exit</span>
                    </div>
                </div>
            </div>
        </template>
    </modal>
</div>
    `
});

Vue.component("furnishing-selector", {
  props: ["furnishingSlotNumber"],

  data: () => ({
    expanded: false,
    fitActionFinder: () => false,
    unfitActionFinder: () => false,
    furnitureSlot: null
  }),

  subscriptions() {
    return {
      validItems: Rx.Observable.combineLatestMap({
        inventory: DataService$1.getMyHomeInventoryStream(),
        fitActionFinder: this.stream("fitActionFinder")
      }).map(({ inventory, fitActionFinder }) => inventory.items.filter(item => item.actions.some(fitActionFinder))),
      furnishing: Rx.Observable.combineLatestMap({
        furnishing: DataService$1.getMyFurnitureStream().distinctUntilChanged(null, JSON.stringify),
        furnishingSlotNumber: this.stream("furnishingSlotNumber")
      }).do(({ furnishing, furnishingSlotNumber }) => {
        this.furnitureSlot = furnishing.find(slot => slot.slotNumber === furnishingSlotNumber);
      })
    };
  },

  watch: {
    expanded() {
      if (this.expanded) {
        if (window.expandedSelector && window.expandedSelector !== this) {
          window.expandedSelector.expanded = false;
        }
        window.expandedSelector = this;
      }
    }
  },

  computed: {
    furnitureSlotName() {
      const result = this.furnitureSlot && this.furnitureSlot.slotType;
      this.fitActionFinder = a => a.id === `Fit: ${result}`;
      this.unfitActionFinder = a => a.id === `Take down`;
      return result;
    },

    border() {
      switch (this.furnitureSlotName // TODO: possible discrepancy with other code
      ) {default:
          return "2 green";
      }
    },

    showSelector() {
      return this.fittedItem || this.validItems && this.validItems.length;
    },

    fittedItem() {
      return this.furnitureSlot && this.furnitureSlot.item;
    }
  },

  methods: {
    fitItem(item) {
      this.unfitCurrent();

      this.stream("fittedItem").filter(i => !i).first().toPromise().then(() => {
        const action = item.actions.find(this.fitActionFinder);
        ServerService$1.request("action", {
          action: action.id,
          target: item.id,
          context: this.furnishingSlotNumber
        }).then(() => {
          this.expanded = false;
        });
      });
    },

    canFit(item) {
      const action = item.actions.find(this.fitActionFinder);
      return action && action.available;
    },

    unfitCurrent() {
      const item = this.fittedItem;
      if (!item) {
        return Promise.resolve();
      }
      const action = item.actions.find(this.unfitActionFinder);
      return ServerService$1.request("action", {
        action: action.id,
        target: item.id,
        context: action.context
      }).then(() => {
        this.expanded = false;
      });
    }
  },

  template: `
<div class="equipment-selector" :class="{ expanded: expanded }">
    <label>Selection: {{furnitureSlotName}}</label>
    <div class="selected-item" @click="expanded = !expanded">
        <item :border="border" :data="fittedItem" v-if="fittedItem" :interactable="false" />
        <item-icon :border="border" v-else="" @click="" class="empty" />
    </div>
    <div class="available-items" v-if="expanded">
        <div class="utility-button-item">
            <item-icon v-if="fittedItem" @click="unfitCurrent()" src="images/ui/checkbox_01.png"></item-icon>
        </div>
        <item v-for="(item, idx) in validItems" :interactable="false" :data="item" :key="'i' + idx" @click="fitItem(item)"></item>
    </div>
</div>
`
});

Vue.component("house-decorations", {
    data: () => ({}),

    subscriptions() {
        return {
            furnishing: DataService$1.getMyFurnitureStream()
        };
    },

    methods: {
        getEffects(item) {
            return Utils$1.getEffectsText({
                effects: Object.keys(item.buffs).toObject(k => item.buffs[k].stat, k => item.buffs[k].value)
            });
        }
    },

    template: `
<div v-if="furnishing" class="house-decoration">
    <section>
        <header>
            Furnishing
            <help-icon title="Furniture & decorations">
                The items used to furnish the house provide a bonus that is accumulated by your character while sleeping and is gradually degrading during your character's activity.<br/>
                To gain the beneficial effects your character must be sleeping at the location of the building that contains the decorative items.<br/>
                Only one copy of each of the items can be placed as decorations in a house at a time.
            </help-icon>
        </header>
        <div v-for="slot in furnishing" class="list-item-with-props">
            <div class="main-icon">
                <furnishing-selector :furnishing-slot-number="slot.slotNumber" />
            </div>
            <div class="details">
                <div class="label">
                    <div>{{slot.slotType}}</div>
                </div>
                <div class="description help-text" v-if="slot.item">
                    {{slot.item.name}}, {{getEffects(slot.item)}}
                </div>
            </div>
        </div>
    </section>
</div>
    `
});

var _extends$9 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("recipe-details", {
    props: ["recipe"],

    methods: {
        ucfirst: Utils$1.ucfirst,

        placements(array) {
            return Object.keys(array.reduce((acc, i) => _extends$9({}, acc, { [i]: true }), {}));
        }
    },

    template: `
<modal v-if="recipe" @close="$emit('close')">
    <template slot="header">
        {{recipe.name}}
    </template>
    <template slot="main">
        <structure-description :building-code="recipe.id" />
        <div v-if="recipe && recipe.results">
            <recipe-diagram :recipe="recipe" />
            <hr/>
            <div v-if="recipe.results.length === 1">
                <item-properties :data="recipe.result"></item-properties>
                <hr>
            </div>
        </div>
        <div v-if="recipe.skill || recipe.tool || recipe.buildings">
            <div class="item-properties html">
                <div v-if="recipe.skill"><span class="property">Skill</span> <span class="value">{{recipe.skill}}</span></div>
                <div v-if="recipe.tool"><span class="property">Tool</span> <span class="value">{{ucfirst(recipe.tool)}}</span></div>
                <div v-if="recipe.buildings"><span class="property">Buildings</span> <span class="value">{{recipe.buildings.map && recipe.buildings.map(building => ucfirst(building)).join(', ')}}</span></div>
            </div>
            <hr>
        </div>
        <div v-if="recipe.placement">
            <div class="item-properties html">
                <div><span class="property">Placement</span> <span class="value">{{placements(recipe.placement).join(', ')}}</span></div>
            </div>
            <hr>
        </div>
        <div v-if="recipe.researchMaterials">
            <label class="item-properties html">Research materials:</label>
            <div class="item-list">
                <item-icon
                    v-for="material in recipe.researchMaterials"
                    :key="material.item.name"
                    :details="material.item"
                    :src="material.item.icon" 
                />
            </div>
        </div>
    </template>
</modal>
    `
});

Vue.component("structure-description", {
    props: {
        buildingCode: "",
        buildingId: null
    },

    subscriptions() {
        return {
            description: Rx.Observable.combineLatestMap({
                buildingCode: this.stream("buildingCode"),
                buildingId: this.stream("buildingId")
            }).switchMap(({ buildingCode, buildingId }) => Rx.Observable.fromPromise(ServerService$1.getInfo("structureDescription", {
                buildingCode,
                buildingId
            })))
        };
    },

    template: `
<div class="html structure-description" v-if="description">
    <div v-html="description"></div>
    <hr/>
</div>
    `
});

Vue.component("recipes-structures", {
    data: () => ({
        selectedCraftingRecipe: null,
        filterFn: () => true
    }),

    subscriptions() {
        return {
            buildingPlans: DataService$1.getMyBuildingPlansStream()
        };
    },

    computed: {
        showFiltering() {
            return this.buildingPlans && this.buildingPlans.length > 6;
        }
    },

    template: `
<section class="node-structures-frame" v-if="buildingPlans">
    <recipe-filter @input="filterFn = $event" v-if="showFiltering" />
    <header>Build</header>
    <div v-if="!buildingPlans.length" class="empty-list"></div>
    <div v-for="plan in buildingPlans" class="structure-listing-item" v-if="filterFn(plan)">
        <div @click="selectedCraftingRecipe = plan" class="list-item-with-props interactable">
            <div class="main-icon">
                <item-icon :src="plan.icon"></item-icon>
            </div>
            <div class="details">
                <div class="label nowrap">
                    <div>{{plan.name}}</div>
                </div>
                <div class="item-list">
                    <item-icon v-for="material in plan.materials" :key="material.item.name" :src="material.item.icon" :qty="material.qty" size="tiny"></item-icon>
                </div>
            </div>
        </div>
        <actions
            :target="plan" 
            :text="false"
        />
    </div>
    <!--<div v-if="hasIncompleteStructure" class="centered spacing-top">-->
        <!--<button @click="continueBuilding()">Continue building</button>-->
    <!--</div>-->
    <recipe-details :recipe="selectedCraftingRecipe" @close="selectedCraftingRecipe = null" />
</section>
    `
});

var _extends$10 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const recipeDifficulty = recipe => {
  const action = recipe.actions.find(a => a.id === "Craft");
  const chance = action && action.difficulty && action.difficulty.match(/[0-9]+/);
  return chance && chance[0] || Infinity;
};

const EMPTY_LABEL = "[Any]";
const CURRENT_TOOL_LABEL = "[Current tool]";
Vue.component("recipe-filter", {
  props: {
    skillsPool: null,
    sortingPools: null,
    itemPurposesPool: null,
    toolsPool: null,
    craftingFilter: false
  },

  data: () => ({
    textFilter: "",
    haveMaterials: false,
    skillFilter: EMPTY_LABEL,
    itemPurposeFilter: EMPTY_LABEL,
    toolFilter: EMPTY_LABEL,
    sortOrder: null
  }),

  watch: {
    sortingPools: {
      handler(values) {
        this.sortOrder = values && Object.keys(values).shift();
      },
      immediate: true
    },

    skillFilter(value) {
      ServerService$1.setSetting("skillFilter", value);
    },

    itemPurposeFilter(value) {
      ServerService$1.setSetting("itemPurposeFilter", value);
    }
  },

  subscriptions() {
    return {
      currentToolUtilities: DataService$1.getMyEquipmentStream().map(equipment => {
        const slot = equipment.find(e => e.slot === "Tool");
        const item = slot && slot.item;
        const utilities = item && item.properties && Object.keys(item.properties.utility || {});
        return utilities || [];
      }),
      settings: ServerService$1.getSettingsStream().first().do(({
        craftTextFilter,
        buildTextFilter,
        skillFilter,
        itemPurposeFilter
      }) => {
        if (this.craftingFilter) {
          this.textFilter = craftTextFilter || "";
        } else {
          this.textFilter = buildTextFilter || "";
        }
        if (this.skillsPool && skillFilter) {
          this.skillFilter = skillFilter;
        }
        if (this.itemPurposesPool && itemPurposeFilter) {
          this.itemPurposeFilter = itemPurposeFilter;
        }
        this.emit();
      })
    };
  },

  methods: {
    ucfirst: Utils.ucfirst,

    setToolFilter(filter) {
      this.toolFilter = filter;
      this.emit();
    },

    emitSort() {
      this.$emit("sort", this.sortOrder);
    },

    emit() {
      const filters = [];
      const textFilter = this.textFilter.toLowerCase();
      if (this.craftingFilter) {
        ServerService$1.setSetting("craftTextFilter", textFilter);
      } else {
        ServerService$1.setSetting("buildTextFilter", textFilter);
      }
      if (this.textFilter) {
        filters.push(recipe => {
          return recipe.name.toLowerCase().includes(textFilter.toLowerCase());
        });
      }

      if (this.haveMaterials) {
        filters.push(recipe => {
          return recipe.actions.some(a => (a.id === "Craft" || a.id === "Erect & Construct") && (a.message === true || a.message.includes("You need a ")));
        });
      }

      if (this.skillFilter !== EMPTY_LABEL) {
        filters.push(recipe => recipe.skill === this.skillFilter);
      }

      if (this.itemPurposeFilter !== EMPTY_LABEL) {
        filters.push(recipe => recipe.result.itemPurposes.includes(this.itemPurposeFilter));
      }

      if (this.toolFilter !== EMPTY_LABEL) {
        if (this.toolFilter === CURRENT_TOOL_LABEL) {
          filters.push(recipe => this.currentToolUtilities.includes(recipe.tool));
        } else {
          filters.push(recipe => this.toolFilter === recipe.tool);
        }
      }

      this.$emit("tool-filter", this.toolFilter);
      this.$emit("input", recipe => filters.reduce((acc, f) => acc && f(recipe), true));
    }
  },

  computed: {
    skillPoolOptions() {
      return [EMPTY_LABEL, ...this.skillsPool.sort()];
    },

    itemPurposesOptions() {
      return [EMPTY_LABEL, ...this.itemPurposesPool.sort()];
    },

    toolsPoolOptions() {
      return [EMPTY_LABEL, CURRENT_TOOL_LABEL, ...this.toolsPool.sort()];
    }
  },

  template: `
<section class="recipe-filter">
    <header>Filter</header>
    <div class="filter-body">
        <div class="filter-element">
            <span class="help-text text-input-label">Name:</span> <input type="text" v-model="textFilter" @input="emit" />
        </div>
<!--        <div class="filter-element">-->
<!--            <input type="checkbox" v-model="haveMaterials" @change="emit" />-->
<!--            <span class="help-text checkbox-label">Can make</span>-->
<!--        </div>-->
        <div v-if="skillsPool" class="filter-container">
            <span class="help-text text-input-label">Skill:</span> 
            <select v-model="skillFilter" @change="emit">
                <option v-for="skill in skillPoolOptions" :value="skill">{{skill}}</option>
            </select>
        </div>
        <div v-if="itemPurposesPool" class="filter-container">
            <span class="help-text text-input-label">Type:</span> 
            <select v-model="itemPurposeFilter" @change="emit">
                <option v-for="slot in itemPurposesOptions" :value="slot">{{slot}}</option>
            </select>
        </div>
        <div v-if="sortingPools" class="filter-container">
            <span class="help-text text-input-label">Tool:</span> 
            <select v-model="toolFilter" @change="emit">
                <option v-for="tool in toolsPoolOptions" :value="tool">{{ucfirst(tool)}}</option>
            </select>
        </div>
        <div v-if="sortingPools" class="filter-container">
            <span class="help-text text-input-label">Sort:</span> 
            <select v-model="sortOrder" @change="emitSort">
                <option v-for="(sort, key) in sortingPools" :value="key">{{key}}</option>
            </select>
        </div>
    </div>
</section>
    `
});

Vue.component("recipe-row-item", {
  props: ["recipe", "index"],

  template: `
<staggered-show
    group="recipe"
    :index="index"
    bundle="1"
    delay="10"
>
    <div class="list-item-with-props" @click="$emit('click')">
        <div class="list-item-with-props interactable" >
            <div class="main-icon">
                <item-icon :src="recipe.icon" :qty="recipe.qty" :name="recipe.name"></item-icon>
            </div>
            <div class="details">
                <div class="label nowrap">
                    <div>{{recipe.name}}</div>
                </div>
                <div class="item-list">
                    <item-icon
                        v-for="material in recipe.materials"
                        :key="material.item.name"
                        :src="material.item.icon"
                        :qty="material.qty"
                        size="tiny"
                    />
                </div>
            </div>
        </div>  
        <actions
            :target="recipe"
            :text="false" 
        />  
    </div>
</staggered-show>
    `
});

Vue.component("recipes-crafting", {
  data: () => ({
    selectedCraftingRecipe: null,
    filterFn: null,
    sorterId: null
  }),

  subscriptions() {
    return {
      recipes: DataService$1.getMyRecipesStream().do(() => console.log("loaded")),
      sorting: DataService$1.getMyRecipesStream().switchMap(() => ServerService$1.getSettingsStream()).first().do(({ recipeSort, recipeToolFilter }) => {
        setTimeout(() => {
          this.defaultSort = recipeSort;
          this.defaultTool = recipeToolFilter;
          if (this.$refs.recipeFilter) {
            if (recipeSort) {
              this.sorterId = this.$refs.recipeFilter.sortOrder = recipeSort;
            }
            if (recipeToolFilter) {
              this.$refs.recipeFilter.setToolFilter(recipeToolFilter);
            }
          }
        });
      })
    };
  },

  mounted() {
    if (this.$refs.recipeFilter) {
      if (this.defaultSort) {
        this.sorterId = this.$refs.recipeFilter.sortOrder = this.defaultSort;
      }
      if (this.defaultTool) {
        this.$refs.recipeFilter.setToolFilter(this.defaultTool);
      }
    }
  },

  watch: {
    sorterId(value) {
      ServerService$1.setSetting("recipeSort", value);
    }
  },

  computed: {
    showFiltering() {
      return this.recipes && this.recipes.length > 10;
    },

    skillsPool() {
      return this.recipes && Object.keys(this.recipes.filter(r => !!r.skill).reduce((acc, r) => _extends$10({}, acc, { [r.skill]: true }), {}));
    },

    itemPurposesPool() {
      const options = {};
      this.recipes.forEach(r => {
        r.result.itemPurposes.forEach(purpose => {
          options[purpose] = true;
        });
      });
      return Object.keys(options);
    },

    toolsPool() {
      const options = {};
      this.recipes.forEach(r => {
        if (r.tool) {
          options[r.tool] = true;
        }
      });
      return Object.keys(options);
    },

    sortsPool() {
      return {
        "Learn order": null,
        Alphabetical: (a, b) => a.name > b.name ? 1 : -1,
        Difficulty: (a, b) => recipeDifficulty(a) - recipeDifficulty(b)
      };
    },

    filteredSortedRecipesList() {
      if (!this.recipes || !this.filterFn) {
        return [];
      }
      const sorterFn = this.sortsPool[this.sorterId];
      const list = this.recipes.filter(r => r && this.filterFn(r));

      if (sorterFn) {
        list.sort(sorterFn);
      }
      return list;
    }
  },

  methods: {
    saveToolFilter(value) {
      ServerService$1.setSetting("recipeToolFilter", value);
    }
  },

  template: `
<section v-if="recipes">
    <recipe-filter
        :crafting-filter="true"
        @input="filterFn = $event"
        @sort="sorterId = $event"
        @tool-filter="saveToolFilter"
        v-show="showFiltering"
        :skills-pool="skillsPool"
        :sorting-pools="sortsPool"
        :item-purposes-pool="itemPurposesPool"
        :tools-pool="toolsPool"
        ref="recipeFilter" 
    />
    <header>Craft</header>
    <div v-if="!recipes.length" class="empty-list"></div>
    <div>
        <recipe-row-item
            v-for="(recipe, idx) in filteredSortedRecipesList"
            :key="recipe.id"
            :index="idx"
            :recipe="recipe"
            @click="selectedCraftingRecipe = recipe;"
        />
    </div>
    <recipe-details :recipe="selectedCraftingRecipe" @close="selectedCraftingRecipe = null" />
</section>
    `
});

var _extends$11 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("research", {
    data: () => ({
        selectResearchMaterialIdx: null,
        researchMatsSlots: [],
        toolBorder: Utils$1.equipmentSlotBorder("Tool"),
        showKnownItems: false,
        exportTextAreaText: "",
        selectItemFilter: ""
    }),

    subscriptions() {
        return {
            // knownItems: this.stream('showKnownItems')
            //     .switchMap(shown => shown ? DataService.getKnownItemsStream() : Rx.Observable.of(null)),
            tutorialArea: DataService$1.getIsTutorialAreaStream(),
            knownItems: DataService$1.getKnownItemsStream().map(items => Object.values(items.filter(item => item.tradeId && item.tradeId !== "null").reduce((acc, i) => {
                acc[i.itemCode] = i;
                return acc;
            }, {})).sort(Utils$1.itemsSorter)),
            researchMaterials: DataService$1.getResearchMaterialsStream().do(researchMaterials => {
                this.updateDisplayedMats(researchMaterials);
            }),
            recentResearches: DataService$1.getRecentResearchesStream(),
            myCreature: DataService$1.getMyCreatureStream(),
            availableItems: DataService$1.getAvailableItemsStream().startWith([])
        };
    },

    computed: {
        availableResearchMaterials() {
            const mats = {};
            this.availableItems.forEach(item => {
                if (mats[item.itemCode]) {
                    mats[item.itemCode].qty += item.qty;
                } else {
                    mats[item.itemCode] = _extends$11({}, item, {
                        integrity: 100
                    });
                }
            });
            return Object.values(mats).sort(Utils$1.itemsSorter);
        },

        getNextItemIdx() {
            const nullItem = this.researchMatsSlots.findIndex(m => !m.item);
            return nullItem !== -1 ? nullItem : this.researchMatsSlots.length;
        }
    },

    methods: {
        clear() {
            ServerService$1.request("updateResearchMaterials", []);
        },

        hasInsights(attempt) {
            return attempt.insights && (attempt.insights.somethingIsMissing || attempt.insights.requiredSkillNotMet || attempt.insights.wrongTool || attempt.insights.unnecessaryTool || attempt.insights.missingBuilding || attempt.insights.allNeededItemsWereThere || attempt.insights.atLeastOneItemMatches || attempt.insights.somethingIsNotAvailable);
        },

        updateDisplayedMats(researchMaterials) {
            const mats = Array.apply(null, Array(5)).map(() => ({
                item: null,
                qty: 1
            }));
            Object.keys(researchMaterials).forEach(material => mats[material] = researchMaterials[material]);
            this.researchMatsSlots = mats;
        },

        updateResearchMats() {
            const payload = this.researchMatsSlots.filter(mats => mats.item).map(mats => mats.item.itemCode);

            ServerService$1.request("updateResearchMaterials", payload);
        },

        selectResearchMaterial(item) {
            if (item === null) {
                this.researchMatsSlots[this.selectResearchMaterialIdx] = {
                    item: null,
                    qty: 1
                };
            } else {
                if (Object.values(this.researchMatsSlots).every(mats => !mats.item || mats.item.itemCode !== item.itemCode)) {
                    this.researchMatsSlots[this.selectResearchMaterialIdx] = this.researchMatsSlots[this.selectResearchMaterialIdx] || {};
                    this.researchMatsSlots[this.selectResearchMaterialIdx].item = item;
                }
            }
            this.selectResearchMaterialIdx = null;
            this.updateResearchMats();
        },

        clickedRecentResearch(event) {
            try {
                event.target.closest(".list-item-with-props").querySelector(".help-icon").__vue__.open = true;
            } catch (e) {}
        },

        getAttemptIcon(attempt) {
            if (attempt.result) {
                return attempt.result.icon;
            }
            if (!this.hasInsights(attempt)) {
                return "images/ui/checkbox_01.png";
            }
            if (attempt.insights.requiredSkillNotMet) {
                return "images/ui/checkbox_02_green.png";
            }
            if (!attempt.insights.somethingIsMissing && !attempt.insights.requiredSkillNotMet && !attempt.insights.wrongTool && !attempt.insights.unnecessaryTool && !attempt.insights.missingBuilding && !attempt.insights.allNeededItemsWereThere && attempt.insights.somethingIsNotAvailable) {
                return "images/ui/checkbox_02_blue.png";
            }
            return "images/ui/checkbox_02.png";
        },

        exportList() {
            const text = this.knownItems.map(item => item.name).join(", ");
            try {
                if (window.clipboardData) {
                    window.clipboardData.setData("Text", text);
                } else {
                    unsafeWindow.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
                    clipboardHelper.copyString(text);
                }
            } catch (e) {
                this.exportTextAreaText = text;

                this.$refs.exportTextarea.value = text;
                this.$refs.exportTextarea.select();
                this.$refs.exportTextarea.setSelectionRange(0, 99999);

                document.execCommand("copy");

                ToastNotification.notify("Copied to clipboard");
            }
        }
    },

    template: `
<div>
    <div>
        <modal v-if="selectResearchMaterialIdx !== null" @close="selectResearchMaterialIdx = null" class="select-materials">
            <template slot="header">
                Select material
            </template>
            <template slot="main">
                <input class="filter-input" v-model="selectItemFilter" placeholder="Start typing to filter..." />
                <div class="item-list">
                    <div class="utility-button-item" v-if="!selectItemFilter">
                        <item-icon
                            @click="selectResearchMaterial(null)"
                            src="images/ui/checkbox_01.png"
                        />
                    </div>
                    <item-icon
                        v-for="item in availableResearchMaterials"
                        v-if="item.name.toLowerCase().includes(selectItemFilter.toLowerCase())"
                        :class="{ disabled: item.nonResearchable || item.deadEnd }"
                        :key="item.itemCode"
                        :name="item.name"
                        @click="selectResearchMaterial(item)"
                        :src="item.icon"
                        :qty="item.qty"
                    />
                </div>
            </template>
        </modal>
    </div>
    <section class="relative">
        <header>
            Research
            <help-icon title="Research">
                You can discover new crafting recipes and constructions. Select one or multiple different items and start the research. Once finished you will see whether the selected items are right, if something is missing or something is unnecessary.
            </help-icon>
        </header>
        <div
            v-if="researchMatsSlots && researchMatsSlots[0] && researchMatsSlots[0].item"
            @click="clear();"
            class="button small clear-materials"
        >
            Clear
        </div>
        <div class="research-selection">
            <div class="tool-selector-section">
                <span class="help-text">Tool</span>
                <tool-selector />
            </div>
            <div class="research-materials">
                <span class="help-text">Materials</span>
                <div class="research-mats-list">
                    <div v-for="(material, idx) in researchMatsSlots" v-if="material" class="research-material interactable" @click="selectResearchMaterialIdx = idx;">
                        <item-icon v-if="material.item" :name="material.item && material.item.name" :src="material.item && material.item.icon"></item-icon>
                    </div>
                    <div @click="selectResearchMaterialIdx = getNextItemIdx" class="research-material interactable utility-button-item" v-if="getNextItemIdx < 10">
                        <item-icon src="images/ui/plus_01_org_small_dark.png"></item-icon>
                    </div>
                </div>
            </div>
        </div>
        <actions
            class="centered"
            :target="myCreature"
            id="Research" 
        />
    </section>
    <section v-if="recentResearches">
        <header class="subheader">Recent researches</header>
        <div v-if="!recentResearches.length" class="empty-list"></div>
        <div v-for="attempt in recentResearches" class="list-item-with-props" @click="clickedRecentResearch($event)" :class="{ interactable: !attempt.result }">
            <div class="main-icon">
                <item-icon :src="getAttemptIcon(attempt)"/>
            </div>
            <div class="details">
                <div v-if="attempt.result" class="label">
                    New recipe: {{attempt.result.name}}!
                </div>
                <div v-else class="label">
                    <!--{{attempt.insights}}-->
                    <template v-if="attempt.insights && attempt.insights.requiredSkillNotMet">                        
                        <div class="text">
                            <div class="difficulty-indicator" v-html="attempt.insights.requiredSkillNotMet"></div>
                        </div>
                        <help-icon title="Research result">
                            The recipe is correct, but the skill related to the target recipe is too low to guarantee success. Retrying the research a few times may result in a discovery.<br/>
                            The skill on which this recipe depends is listed in parentheses.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.wrongTool">
                        <div class="text">A different tool is needed</div>
                        <help-icon title="Research result">
                            The recipe is correct, but the tool used doesn't have the required utility.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.unnecessaryTool">
                        <div class="text">No tool is needed</div>
                        <help-icon title="Research result">
                            The recipe is correct, but it doesn't require a tool. Trying again without any tool equipped leads to a discovery.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.missingBuilding">
                        <div class="text">Specific building is needed</div>
                        <help-icon title="Research result">
                            The recipe is correct, including the tool, but there is also a building requirement for this recipe. Only buildings that are present in the location you're in while researching are considered.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.allNeededItemsWereThere">
                        <div class="text">Includes surplus items</div>
                        <help-icon title="Research result">
                            A subset of the materials you used leads to a discovery. This means that one or more materials are unnecessary.<br/>
                            Once you find the materials combination you may then need to adjust the tool used for research.  
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.somethingIsMissing">
                        <div class="text">Something is missing</div>
                        <help-icon title="Research result">
                            This combination of materials, along with one or more additional materials will lead to a discovery.<br/>
                            Once you find the materials combination you may then need to adjust the tool used for research.  
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.somethingIsNotAvailable">
                        <div class="text">Something new is needed</div>
                        <help-icon title="Research result">
                            This combination of materials, along with one or more additional materials will lead to a discovery. However, it seems your character has never seen at least one of those additional materials required.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.atLeastOneItemMatches">
                        <div class="text">Doesn't work</div>
                        <help-icon title="Research result">
                            This combination of materials is not correct, but one or more of the materials used in this attempt will still lead to new discoveries.
                        </help-icon>
                    </template>
                    <template v-else>
                        <div class="text">That's a dead end</div>
                        <help-icon title="Research result">
                            All of the materials used in this research are no longer leading to any discoverable technology. It's still possible that those materials have other uses you may discover by other means than research.
                        </help-icon>
                    </template>
                </div>
                <div class="item-list">
                    <item-icon :src="attempt.toolUsed ? attempt.toolUsed.icon : null" size="tiny" :border="toolBorder"></item-icon>
                    <item-icon v-for="material in attempt.materialsUsed" :key="material.item.name" :name="material.item && material.item.name" :src="material.item.icon" size="tiny"></item-icon>
                </div>
                <div v-if="attempt.insights && attempt.insights.theresMore" class="help-text">There are more recipes to be found with this tool and materials.</div>
            </div>
        </div>
    </section>
    <section v-if="knownItems && knownItems.length && !tutorialArea">
        <header>Other information</header>
        <div class="centered">
            <button @click="showKnownItems = true;">Known items</button>
        </div>
    </section>
    <modal v-if="knownItems && showKnownItems" @close="showKnownItems = false; exportTextAreaText = null;">
        <div slot="header">
            Known items
        </div>
        <div slot="main">
            <textarea class="export-window" ref="exportTextarea" :class="{hidden: !exportTextAreaText}">{{exportTextAreaText}}</textarea>
            <div v-if="!exportTextAreaText" class="item-list">
                <button @click="exportList()">Export</button>
                <div class="item-list">
                    <item v-for="item in knownItems" :key="item.itemCode" :data="item" />
                </div>
            </div>
        </div>
    </modal>
</div>
    `
});

Vue.component("slider", {
  props: {
    min: {
      default: 0
    },
    max: {
      default: 100
    },
    value: {
      type: Number
    },
    step: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    leftPosition() {
      return (this.value - this.min) / (this.max - this.min) * 100;
    },

    handleStyle() {
      return {
        left: `${this.leftPosition}%`
      };
    }
  },

  methods: {
    setValueBaseOnPosition(position) {
      if (position === null) {
        return;
      }
      position = position / this.$refs.background.clientWidth;
      position = Math.max(0, Math.min(1, position));
      if (this.step !== -1) {
        const stepsCount = (this.max - this.min) / this.step;
        position = Math.round(position * stepsCount) / stepsCount;
      }
      const value = position * (this.max - this.min) + this.min;
      if (this.old === value) {
        return;
      }
      this.old = value;
      this.$emit("input", value);
    },

    getOffsetX(event) {
      const left = this.$refs.background.getBoundingClientRect().left;
      if (event.clientX) {
        return event.clientX - left;
      }
      if (event.targetTouches && event.targetTouches.length === 1) {
        return event.targetTouches[0].clientX - left;
      }
      return null;
    },

    draggingBackground(event) {
      this.setValueBaseOnPosition(this.getOffsetX(event));
      this.startDragging(event);
    },

    startDragging(event) {
      const mouseMoveHandler = moveEvent => {
        this.setValueBaseOnPosition(this.getOffsetX(moveEvent));
      };
      const mouseUpHandler = () => {
        window.removeEventListener("mouseup", mouseUpHandler);
        window.removeEventListener("touchend", mouseUpHandler);
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("touchmove", mouseMoveHandler);
      };
      window.addEventListener("mouseup", mouseUpHandler);
      window.addEventListener("touchend", mouseUpHandler);
      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("touchmove", mouseMoveHandler);
    }
  },

  template: `
<div class="slider" :class="{ disabled: disabled }">
    <div class="background" ref="background" @mousedown="draggingBackground($event)" @touchstart="draggingBackground($event)"></div>
    <div class="handle-container">
        <div class="handle" :style="handleStyle" @mousedown="startDragging($event)" @touchstart="startDragging($event)"></div>    
    </div>
</div>
`
});

const LABELS_BLOOD = {
  0: "Never",
  1: "Extreme",
  2: "Severe",
  3: "Minor",
  4: "Initial",
  5: "Always"
};
const LABELS_PAIN = {
  0: "Never",
  1: "Extreme pain",
  2: "Major pain",
  3: "Pain",
  4: "Minor pain",
  5: "Always"
};

Vue.component("settings", {
  data: () => ({
    legalText: null,
    audioVolume: 0,
    painSafety: 0,
    bloodSafety: 0,
    weatherEffects: false,
    disableAutoRefresh: false
  }),

  computed: {
    painSafetyLabel() {
      return LABELS_PAIN[this.painSafety];
    },

    bloodSafetyLabel() {
      return LABELS_BLOOD[this.bloodSafety];
    }
  },

  created() {
    this.legalText = window.LEGAL_HTML;
    ServerService$1.getAudioVolumeStream().first().subscribe(value => {
      this.audioVolume = value;
    });

    ServerService$1.getLocalSettingStream("disableWeatherEffects").first().subscribe(disableWeatherEffects => {
      this.weatherEffects = !disableWeatherEffects;
    });

    ServerService$1.getLocalSettingStream("disableAutoRefresh").first().subscribe(disableAutoRefresh => {
      this.disableAutoRefresh = disableAutoRefresh;
    });
  },

  subscriptions() {
    const discordInfoStream = ServerService$1.getDataStream("discord-info");
    ServerService$1.request("get-discord-info");
    return {
      tutorialArea: DataService$1.getIsTutorialAreaStream(),
      dataUsed: ServerService$1.getUsedDataStream().map(number => Utils$1.formatSize(number)),
      joinDiscordUrl: Rx.Observable.fromPromise(ServerService$1.request("get-join-discord-url")),
      discordInfo: discordInfoStream,
      settings: ServerService$1.getSettingsStream().do(settings => {
        this.painSafety = settings.safeties.pain;
        this.bloodSafety = settings.safeties.blood;
      }),
      pushNotificationsAllowed: ServerService$1.getPushNotificationsAllowedStream(),
      pushNotificationsEnabled: ServerService$1.getPushNotificationsEnabledStream()
    };
  },

  methods: {
    restartTutorial() {
      window.tutorialInstance.restart();
      ContentFrameService.triggerClosePanel();
    },

    onChangePainSafety() {
      ServerService$1.setSetting("safeties.pain", this.painSafety);
    },

    onChangeBloodSafety() {
      ServerService$1.setSetting("safeties.blood", this.bloodSafety);
    },

    onChangeVolume() {
      ServerService$1.setAudioVolume(this.audioVolume);
    },

    updateSetting(key, value) {
      ServerService$1.setSetting(key, value);
    },

    setPushNotificationsEnabled(value) {
      ServerService$1.togglePushNotifications(value);
    },

    setWeatherEffects() {
      ServerService$1.setLocalSetting("disableWeatherEffects", !this.weatherEffects);
    },

    setDisableAutoRefresh() {
      ServerService$1.setLocalSetting("disableAutoRefresh", this.disableAutoRefresh);
    }
  },

  template: `
<div>
    <section v-if="tutorialArea">
        <header>Tutorials</header>
        <div class="centered">
            <button @click="restartTutorial()">Restart tutorial</button>
        </div>
    </section>
    <section>
        <header>Sound volume</header>
        <slider :min="0" :max="1" :step="0.05" v-model="audioVolume" @input="onChangeVolume()"></slider>
    </section>
    <section>
        <header>Discord</header>
        <div v-if="discordInfo">
            Discord user: {{discordInfo.name}}
        </div>
        <div class="centered">
            <a class="button" target="_blank" :href="joinDiscordUrl">
                {{discordInfo ? 'Change user' : 'Join on Discord'}}
            </a>
        </div>
    </section>
    <section v-if="settings">
        <header>
            Accident safety
            <help-icon title="Accident safety">
                You can use these settings to automatically adjust at what level your character will stop performing an action when they get an injury.<br/>
                By selecting "Never" your character will never stop the actions and continue regardless of their wounds.<br/>
                By selecting "Always" any accident will make the character stop performing the action.<br/>
                By selecting a specific value - only when character will be in that, or worse, state will they stop the action when accident happens.<br/>
            </help-icon>
        </header>
        <div class="help-text" :class="{ disabled: bloodSafety === 5 }"><span class="label">Pain threshold:</span> <span class="value">{{painSafetyLabel}}</span></div>
        <slider :disabled="bloodSafety === 5" :min="0" :max="5" :step="1" v-model="painSafety" @input="onChangePainSafety()"></slider>
        <div class="help-text" :class="{ disabled: painSafety === 5 }"><span class="label">Blood threshold:</span> <span class="value">{{bloodSafetyLabel}}</span></div>
        <slider :disabled="painSafety === 5" :min="0" :max="5" :step="1" v-model="bloodSafety" @input="onChangeBloodSafety()"></slider>
    </section>
    <section v-if="settings">
        <header>Notifications</header>
        <label class="checkbox-row">
            <div><input type="checkbox" v-model="pushNotificationsEnabled" @change="setPushNotificationsEnabled(pushNotificationsEnabled)" :disabled="!pushNotificationsAllowed" /></div>
            <div>Device <span v-if="!pushNotificationsAllowed">(allow notifications in your browser)</span></div>
        </label>
        <label class="checkbox-row" v-if="settings.notifications.slack !== undefined">
            <div><input type="checkbox" :checked="settings.notifications.slack" @change="updateSetting('notifications.slack', !settings.notifications.slack)" /></div>
            <div>Slack</div>
        </label>
        <label class="checkbox-row">
            <div><input type="checkbox" :checked="settings.notifications.discord" @change="updateSetting('notifications.discord', !settings.notifications.discord)" :disabled="!discordInfo" /></div>
            <div>Discord</div>
        </label>
        <label class="checkbox-row">
            <div><input type="checkbox" :checked="settings.alwaysNotify" @change="updateSetting('alwaysNotify', !settings.alwaysNotify)" /></div>
            <div>Send notification when the game is focused</div>
        </label>
    </section>
    <section v-if="settings">
        <header>Miscellaneous</header>
        <label class="checkbox-row">
            <div><input type="checkbox" v-model="weatherEffects" @change="setWeatherEffects" /></div>
            <div>Animated weather effects</div>
        </label>    
        <label class="checkbox-row">
            <div><input type="checkbox" v-model="disableAutoRefresh" @change="setDisableAutoRefresh" /></div>
            <div>Disable auto-reload on connection issues</div>
        </label>    
    </section>
    <br/>
    <div class="legal bright">Data used: {{dataUsed}}</div>
    <div class="legal bright" v-html="legalText"></div>
</div>
    `
});

Vue.component("storage-inventory", {
    props: ["filter"],

    subscriptions() {
        return {
            homeInventory: DataService$1.getMyHomeInventoryStream()
        };
    },

    template: `
<div v-if="homeInventory">
    <section>
        <header class="secondary">
            Storage
        </header>
        <carry-capacity-indicator
            :current="homeInventory.weight"
            :max="homeInventory.weightLimit"
        />
        <inventory :data="homeInventory.items" type="storage" :filter="filter"></inventory>
    </section>
</div>
    `
});

Vue.component("relationship-picker", {
  props: {
    creature: {
      default: {}
    }
  },

  data: () => ({
    relationshipOverride: null
  }),

  methods: {
    selectRelationship(relationship) {
      ServerService.request("applyRelationship", {
        creatureId: this.creature.id,
        relationship
      }).then(r => {
        if (r) {
          this.relationshipOverride = relationship;
          this.$emit("changed");
        }
      });
    }
  },

  computed: {
    relationship() {
      return this.relationshipOverride || this.creature.relationship;
    },
    isRival() {
      return this.relationship === "rival";
    },
    isNeutral() {
      return !this.isFriend && !this.isRival;
    },
    isFriend() {
      return this.relationship === "friend";
    }
  },

  template: `
<div class="relationship-picker">
    <div class="item rival" :class="{ active: isRival }">
        <div class="button action icon text" @click.prevent="selectRelationship('rival');">
            <span class="multicolor-icon"></span>
        </div>
        <div class="label">Rival</div>
    </div>
    <div class="item neutral" :class="{ active: isNeutral }">
        <div class="button action icon text" @click.prevent="selectRelationship('neutral');">
            <span class="multicolor-icon"></span>
        </div>
        <div class="label">Neutral</div>
    </div>
    <div class="item friend" :class="{ active: isFriend }">
        <div class="button action icon text" @click.prevent="selectRelationship('friend');">
            <span class="multicolor-icon"></span>
        </div>
        <div class="label">Friend</div>
    </div>
</div>
    `
});

var _extends$12 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Vue.component("relationships", {
  data: () => ({
    friends: [],
    rivals: [],
    enemies: [],
    editing: null
  }),

  subscriptions() {
    return {
      relationships: DataService$1.getRelationshipsStream().map(relationships => Object.keys(relationships).toObject(k => k, k => relationships[k].map(r => _extends$12({}, r, {
        lowercaseName: r.name.toLowerCase()
      })).sort((a, b) => {
        if (`${a.lowercaseName}` > `${b.lowercaseName}`) {
          return 1;
        }
        if (`${a.lowercaseName}` < `${b.lowercaseName}`) {
          return -1;
        }
        return 0;
      })))
    };
  },

  methods: {
    edit(relationship, type) {
      this.editing = relationship;
      this.editingCreature = {
        id: relationship.id,
        relationship: type
      };
    },

    startTrade(relationship) {
      ServerService$1.request("action", {
        action: "Trade",
        target: relationship.creatureId
      }).then(() => {
        ToastNotification.notify(`Starting trade with ${relationship.name}...`);
        ContentFrameService.triggerShowPanel("activeTrades");
      });
    }
  },

  template: `
<section class="relationships" v-if="relationships">
    <header>Friends</header>
    <div v-if="!relationships.friends.length" class="empty-list"></div>
    <div v-for="relationship in relationships.friends" class="item friend">
        <div class="name">{{relationship.name}}</div>
        <div class="action-container">
            <button class="action trade icon" @click="startTrade(relationship);">
                <div class="icon"></div>
            </button>
            <button class="action edit icon" @click="edit(relationship, 'friend');">
                <div class="icon"></div>
            </button>
        </div>
    </div>
    <header>Rivals</header>
    <div v-if="!relationships.rivals.length" class="empty-list"></div>
    <div v-for="relationship in relationships.rivals" class="item rival">
        <div class="name">{{relationship.name}}</div>
        <div class="action-container">
            <button class="action trade icon" @click="startTrade(relationship);">
                <div class="icon"></div>
            </button>
            <button class="action edit icon" @click="edit(relationship, 'rival');">
                <div class="icon"></div>
            </button>
        </div>
    </div>
    <header>Neutral</header>
    <div v-if="!relationships.neutrals.length" class="empty-list"></div>
    <div v-for="relationship in relationships.neutrals" class="item neutral">
        <div class="name">{{relationship.name}}</div>
        <div class="action-container">
            <button class="action trade icon" @click="startTrade(relationship);">
                <div class="icon"></div>
            </button>
            <button class="action edit icon" @click="edit(relationship, 'neutral');">
                <div class="icon"></div>
            </button>
        </div>
    </div>
    <modal v-if="editing" @close="editing = null;">
        <template slot="header">{{editing.name}}</template>
        <template slot="main">
            <relationship-picker :creature="editingCreature" @changed="editing = null" />
        </template>
    </modal>
</section>
    `
});

Vue.component("tool-selector", {
  template: `
<equipment-selector equipment-slot="Tool" class="tool-selector" />
`
});

const category = {
  props: {
    type: String,
    title: String,
    noOverlay: Boolean,
    number: Number,
    forceOn: Boolean,
    showButton: {
      type: Boolean,
      default: true
    },
    state: null,
    highlighted: false,
    onlySelected: Boolean
  },

  data: () => ({
    toggledOn: false
  }),

  mounted() {
    this.$parent.register(this);
  },

  watch: {
    state: {
      handler() {
        if (typeof this.state === "boolean") {
          this.toggledOn = this.state;
        }
      },
      immediate: true
    }
  },

  methods: {
    close() {
      if (this.toggledOn) {
        this.toggledOn = false;
        this.$parent.closed();
        this.$emit("off");
      }
    },

    open() {
      if (!this.toggledOn) {
        ContentFrameService.triggerBeforeOpenStream();
        this.toggledOn = true;
        this.$parent.opened(this);
        this.$emit("on");
      }
    },

    clicked() {
      const was = this.toggledOn;
      ContentFrameService.triggerBeforeOpenStream();
      this.toggledOn = !was;
      if (this.toggledOn) {
        this.$parent.opened(this);
        this.$emit("click");
        this.$emit("on");
      } else {
        this.$parent.closed(this);
        this.$emit("click");
        this.$emit("off");
      }
    }
  },

  template: `
<div class="category">
    <div class="btn" @click="clicked" :class="[type, { selected: toggledOn || forceOn, highlighted: highlighted }]" :title="title" v-if="showButton && (!onlySelected || toggledOn)">
        <div class="icon"></div>
        <div v-if="number !== undefined" class="number">{{number}}</div>
    </div>
    <div class="submenu" v-if="toggledOn">
        <slot></slot>
    </div>
</div>
    `
};
window.mainControlsCategory = category;

Vue.component("main-controls", {
  props: {
    onlySelected: Boolean
  },

  components: {
    category
  },

  data: () => ({
    showNodeDetails: null,
    showOverlay: false,
    isOnFightingScreen: false
  }),

  subscriptions() {
    const activeTradesStream = DataService$1.getPlayerInfoStream().map(playerInfo => playerInfo.unacceptedTradesCount);
    const newListingsCountStream = TradingService.getNewListingsStream().map(listingsByCreature => Object.values(listingsByCreature).reduce((acc, item) => acc + Object.values(item).length, 0));

    return {
      reset: ServerService$1.getResetStream().do(() => {
        this.triggerShowNodeDetails(true);
      }),
      isDungeon: ServerService$1.getIsDungeonStream(),
      travelMode: ServerService$1.getTravelModeStream(),
      playerInfo: DataService$1.getPlayerInfoStream(),
      tutorialArea: DataService$1.getIsTutorialAreaStream(),
      beforeOpen: ContentFrameService.getBeforeOpenStream().do(() => this.closeAll()),
      showNodeDetails: ContentFrameService.getShowNodeDetailsStream().do(() => {
        if (!this.showNodeDetails) {
          ContentFrameService.triggerBeforeOpenStream();
        }
        this.openPanelTab("nodePanel");
        this.showNodeDetails = true;
      }),
      mapMode: ContentFrameService.getMapModeStream(),
      node: ServerService$1.getNodeStream(),
      hostilesPresent: ServerService$1.getNodeStream().map(node => (node.creatures || []).some(c => c.hostile && !c.dead)),
      selectedNode: ContentFrameService.getSelectedNodeStream(),
      currentZLevel: MapService$1.getCurrentZLevelStream(),
      availableZLevels: MapService$1.getAvailableZLevelsStream(),
      activeTrades: activeTradesStream,
      newListingsCount: newListingsCountStream,
      extraComponents: ServerService$1.getDataStream("extraComponents").switchMap(extraComponents => {
        return Rx.Observable.combineLatest(extraComponents.map(extraComponent => Rx.Observable.fromPromise(ServerService$1.loadDynamicComponent(extraComponent))));
      }).startWith([]),
      tradingIndicatorNumber: Rx.Observable.combineLatestMap({
        activeTrades: activeTradesStream,
        newListingsCount: newListingsCountStream
      }).map(({ activeTrades, newListingsCount }) => {
        return activeTrades + newListingsCount || undefined;
      }),
      panelOpen: ContentFrameService.getShowPanelStream().do(panel => {
        switch (panel) {
          case null:
            this.closeAll();
            break;
          case "effects":
            this.openPanelTab("characterPanel", "effectsTab");
            break;
          case "quest":
            this.openPanelTab("characterPanel", "characterTab");
            break;
          case "log":
            this.openPanelTab("characterPanel", "logTab");
            break;
          case "erect":
            this.openPanelTab("craftingPanel", "buildingTab");
            break;
          case "activeTrades":
            this.openPanelTab("tradingPanel", "activeTrades");
            break;
        }
      })
    };
  },

  methods: {
    toggleTravelMode() {
      ServerService$1.toggleTravelMode(!this.travelMode);
    },

    openPanelTab(panelId, tab) {
      const panel = this.$refs[panelId];
      if (panel) {
        panel.open();
        if (tab) {
          const interval = setInterval(() => {
            const tabCmp = this.$refs[tab];
            if (tabCmp && tabCmp.$parent) {
              tabCmp.$parent.setActiveByComponent(tabCmp);
              clearInterval(interval);
            }
          }, 10);
        }
      }
    },

    register(vm) {
      this.categories = this.categories || [];
      this.categories.push(vm);
    },

    closeAll() {
      this.categories = this.categories || [];
      this.categories.forEach(vm => vm.close());
      ContentFrameService.triggerShowNodeDetails(null);
    },

    setMapMode(mapMode) {
      // this.closeAll();
      ContentFrameService.selectMapMode(mapMode);
      localStorage.setItem(`tabsAutoOpen.node-frame`, `undefined__${this.mapMode}`);
    },

    opened(categoryComponent) {
      if (!categoryComponent.noOverlay) {
        this.showOverlay = true;
      }
    },

    closed() {
      this.showOverlay = false;
    },

    showLevel(by) {
      MapService$1.changeZLevel(by);
    },

    goToFighting() {
      ServerService$1.toggleTravelMode(false);
      window.location.hash = "/fight";
    },

    goToMain() {
      window.location.hash = "/main";
    },

    clickedNodeButton() {
      ContentFrameService.triggerNodeSelected(this.node);
    },

    triggerShowNodeDetails(force = false) {
      if (this.selectedNode) {
        ServerService$1.selectLiveUpdateNodeId(this.selectedNode.id, force);
      }
    }
  },

  created() {
    this.isOnFightingScreen = window.location.hash === "#/fight";
  },

  template: `
<div class="main-controls-wrapper" v-if="node">
    <div>
        <div class="overlay" v-if="showOverlay" @click="closeAll()" />
    </div>
    <div class="main-controls">
        <div class="inner-wrapper">
            <div class="buttons">
                <category
                    :highlighted="true"
                    type="fighting-screen"
                    title="Fighting details"
                    :show-button="hostilesPresent"
                    :state="isOnFightingScreen"
                    @on="goToFighting()"
                    @off="goToMain()"
                />
                <category
                    type="travel"
                    title="Travel"
                    :no-overlay="true"
                    :only-selected="onlySelected && !travelMode"
                    :forceOn="travelMode"
                    v-if="!tutorialArea && !isDungeon"
                    @click="toggleTravelMode()"
                />
                <component v-for="componentName in extraComponents" :key="componentName" :is="componentName" />
                <category @on="triggerShowNodeDetails()" @click="clickedNodeButton()" type="node" ref="nodePanel" v-show="selectedNode" :only-selected="onlySelected" title="Selected area">
                    <tool-selector />
                    <div class="content-frame">
                        <tabs frame="1" placement="right" remember-id="node-frame">
                            <tab header-class="creatures" ref="creaturesTab" title="Creatures">
                                <template slot="heading">
                                    <node-header :node="selectedNode" />
                                </template>
                                <node-creatures :node="selectedNode" />
                            </tab>
                            <tab header-class="structures" ref="structuresTab" title="Structures">
                                <template slot="heading">
                                    <node-header :node="selectedNode" />
                                </template>
                                <node-structures :node="selectedNode" />
                            </tab>
                            <tab header-class="resources" ref="resourcesTab" title="Resources">
                                <template slot="heading">
                                    <node-header :node="selectedNode" />
                                </template>
                                <node-resources :node="selectedNode" />
                            </tab>
                            <tab header-class="on-the-ground" title="Items on the ground" v-if="node && selectedNode && node.id === selectedNode.id">
                                <template slot="heading">
                                    <node-header :node="selectedNode" />
                                </template>
                                <inventory-on-the-ground />
                            </tab>
                        </tabs>
                    </div>
                </category>
                <category type="character" ref="characterPanel" title="Character panel" :only-selected="onlySelected">
                    <tool-selector />
                    <div class="content-frame">
                        <tabs frame="1" placement="right" remember-id="character-frame">
                            <tab header-class="effects" ref="effectsTab" title="Effects">
                                <div>
                                    <section>
                                        <header>Effects</header>
                                    </section>
                                    <player-effects-full-panel />
                                    <section>
                                        <header>Summary</header>
                                    </section>
                                    <player-effects-summary />
                                </div>
                            </tab>
                            <tab header-class="stats" title="Statistics">
                                <player-stats />
                            </tab>
                            <tab header-class="quests" ref="characterTab" title="Quests">
                                <player-quests />
                            </tab>
                            <tab header-class="log" ref="logTab" title="Game log">
                                <game-chat
                                    :persistent="true"
                                />
                            </tab>
                            <tab header-class="settings" title="Settings">
                                <settings />
                            </tab>
                        </tabs>
                    </div>
                </category>
                <category type="items" title="Inventory" :only-selected="onlySelected">
                    <tool-selector />
                    <div class="content-frame">
                        <tabs frame="1" placement="right" remember-id="inventory-frame">
                            <tab header-class="inventory" title="Inventory">
                                <player-inventory />
                            </tab>
                            <tab header-class="equipment" title="Equipment">
                                <player-equipment />
                            </tab>
                            <tab header-class="furnishing" title="Furnishing" v-if="playerInfo.hasFurnishing">
                                <house-decorations />
                            </tab>
                            <tab header-class="on-the-ground" title="Items on the ground">
                                <inventory-on-the-ground :node="node" />
                            </tab>
                        </tabs>
                    </div>
                </category>
                <category type="craft" ref="craftingPanel" title="Crafting & Research" :only-selected="onlySelected">
                    <tool-selector />
                    <div class="content-frame">
                        <tabs frame="1" placement="right" remember-id="crafting-frame">
                            <tab header-class="item-craft" v-if="playerInfo.knowsCrafting" title="Crafting">
                                <recipes-crafting />
                            </tab>
                            <tab header-class="structure" v-if="playerInfo.knowsBuildingPlan" ref="buildingTab" title="Building">
                                <recipes-structures />
                            </tab>
                            <tab header-class="research" title="Research">
                                <research />
                            </tab>
                        </tabs>
                    </div>
                </category>
                <category type="trading" ref="tradingPanel" title="Interactions" v-if="!tutorialArea" :only-selected="onlySelected" :number="tradingIndicatorNumber">
                    <div class="content-frame">
                        <tabs frame="1" placement="right" remember-id="trade-frame">
                            <tab header-class="active-trades" ref="activeTrades" title="Current pending trades" :indicator="activeTrades">
                                <player-trades />
                            </tab>
                            <tab header-class="offers" title="Offers listings" :indicator="newListingsCount">
                                <auto-trade />
                            </tab>
                            <tab header-class="relationships" title="Relationships">
                                <relationships />
                            </tab>
                        </tabs>
                    </div>
                </category>
                <category class="relative" type="map-mode" title="Map display mode" :only-selected="onlySelected && !travelMode" :no-overlay="true">
                    <div class="btn none" @click="setMapMode()" title="Off" :class="{ selected: mapMode === undefined}">
                        <div class="icon" />
                    </div>
                    <div class="btn resources" @click="setMapMode('resources')" title="Resources" :class="{ selected: mapMode === 'resources'}">
                        <div class="icon" />
                    </div>
                    <div class="btn creatures" @click="setMapMode('creatures')" title="Creatures" :class="{ selected: mapMode === 'creatures'}">
                        <div class="icon" />
                    </div>
                    <div class="btn structures" @click="setMapMode('structures')" title="Structures" :class="{ selected: mapMode === 'structures'}">
                        <div class="icon" />
                    </div>
                    <div class="btn level-up" @click="showLevel(+1)" title="View level up" v-if="availableZLevels && availableZLevels[currentZLevel + 1]">
                        <div class="icon" />
                    </div>
                    <div class="btn level-down" @click="showLevel(-1)" title="View level down" v-if="availableZLevels && availableZLevels[currentZLevel - 1]">
                        <div class="icon" />
                    </div>
                </category>
            </div>
            <dungeon-controls v-if="!onlySelected" />
        </div>        
        <travel-controls v-if="travelMode" />
    </div>
</div>
    `
});

Vue.component("quest-notification", {
  subscriptions() {
    return {
      hasNewQuest: DataService$1.getMyQuestsStream().map(quests => quests.some(q => !q.reviewed))
    };
  },

  methods: {
    openQuestPanel() {
      ContentFrameService.triggerShowPanel("quest");
    }
  },

  template: `
<div
    v-if="hasNewQuest"
    class="quest-notification"
    @click="openQuestPanel"
>
    <div class="icon"></div>
</div>
    `
});

Vue.component("node-events", {
  data: () => ({
    showPlotText: null,
    showPlotStructureName: null
  }),

  subscriptions() {
    return {
      events: DataService$1.getEventsStream()
    };
  },

  methods: {
    onClick(event) {
      this.showPlotText = Utils$1.linebreaks(event.plotText);
      this.showPlotStructureName = event.name;
    }
  },

  template: `
<div v-if="events && events.length" class="node-events">
    <div v-for="event in events" class="event-icon" @click="onClick(event)">
        <item-icon :src="event.icon"></item-icon>
    </div>
    <modal v-if="showPlotText" @close="showPlotText = null;">
        <template>
            <template slot="header">{{showPlotStructureName}}</template>
            <template slot="main">
                <animated-text :text="showPlotText" />
            </template>
        </template>
    </modal>
</div>
    `
});

Vue.component("secondary-status", {
    template: `
<div class="secondary-status">
    <tutorial-trigger />
    <quest-notification />
    <node-events />
</div>
    `
});

Vue.component("audio-player", {
  data: () => ({
    muted: true,
    isStarted: false,
    appliedVolume: 0
  }),

  watch: {
    muted() {
      this.updateVolume(this.volumeSetting);
    }
  },

  subscriptions() {
    this.playedSounds = {};

    return {
      ambientAudio: DataService$1.getAmbientAudioStream().do(files => {
        this.updateSounds(files || []);
      }),
      volumeSetting: ServerService.getAudioVolumeStream().do(value => {
        this.updateVolume(value);
      })
    };
  },

  mounted() {
    this.boundFn = this.startPlaying.bind(this);
    window.addEventListener("mousedown", this.boundFn);
    window.addEventListener("blur", () => {
      this.muted = true;
    });
    window.addEventListener("focus", () => {
      this.muted = false;
    });
  },

  methods: {
    updateSounds(files) {
      if (!this.isStarted) {
        return;
      }
      Object.values(this.playedSounds).forEach(s => s.remove = true);
      files.forEach(file => {
        if (!this.playedSounds[file]) {
          this.playFile(file);
        }
        this.playedSounds[file].remove = false;
      });
      Object.keys(this.playedSounds).forEach(file => {
        if (this.playedSounds[file].remove) {
          this.playedSounds[file].howl.unload();
          delete this.playedSounds[file];
        }
      });
    },

    playFile(file) {
      this.playedSounds[file] = {
        howl: new Howl({
          src: [file],
          autoplay: true,
          loop: true,
          volume: this.appliedVolume
        })
      };
    },

    startPlaying() {
      this.isStarted = true;
      this.updateSounds(this.ambientAudio || []);
      window.removeEventListener("mousedown", this.boundFn);
      this.muted = false;
    },

    updateVolume(volumeSetting) {
      this.targetVolume = this.muted ? 0 : volumeSetting;

      this.appliedVolume = this.targetVolume;
      Object.values(this.playedSounds).forEach(s => {
        s.howl.volume(this.appliedVolume);
      });

      // const change = (this.targetVolume - this.appliedVolume) / 5;
      // if (change) {
      //     const interval = setInterval(() => {
      //         const sign = Math.sign(change);
      //         this.appliedVolume += change;
      //         if (this.appliedVolume * sign > this.targetVolume * sign) {
      //             this.appliedVolume = this.targetVolume;
      //             clearInterval(interval);
      //         }
      //         Object.values(this.playedSounds)
      //             .forEach(s => {
      //                 s.howl.volume(this.appliedVolume);
      //             });
      //     }, 100);
      // }
    }
  },

  template: `
<div class="audio-player"></div>
`
});

window.creaturesSorter = (a, b) => {
  if (!a.self !== !b.self) {
    return a.self ? -1 : 1;
  }
  if (!a.dead !== !b.dead) {
    return a.dead ? 1 : -1;
  }
  if (!a.hostile !== !b.hostile) {
    return a.hostile ? -1 : 1;
  }
  if (!a.isPlayer !== !b.isPlayer) {
    return a.isPlayer ? -1 : 1;
  }
  if (a.relationship !== b.relationship) {
    switch (true) {
      case a.relationship === "friend":
        return -1;
      case a.relationship === "rival":
        return 1;
      case b.relationship === "friend":
        return 1;
      case b.relationship === "rival":
        return -1;
    }
  }
  if (a.name > b.name) {
    return 1;
  } else {
    return -1;
  }
};

const MainView = {
  data: () => ({}),

  subscriptions() {
    return {
      travelMode: ServerService$1.getTravelModeStream(),
      tutorialArea: DataService$1.getIsTutorialAreaStream(),
      dead: ServerService$1.getDeadStream().do(data => {
        if (data.dead) {
          window.location.hash = "/dead";
        }
      }),
      acceptedLegalTerms: DataService$1.getAcceptedLegalTermsStream().do(acceptedLegalTerms => {
        if (!acceptedLegalTerms) {
          window.location.hash = "/register";
        }
      })
    };
  },

  created() {
    ServerService$1.registerHandler("clientSideEvent", data => {
      eval(data)(this, window);
    });
  },

  methods: {
    ucfirst: Utils$1.ucfirst,
    linebreaks: Utils$1.linebreaks,
    formatNumber: Utils$1.formatNumber
  },

  template: `
<div class="main-container" :class="{ 'travel-mode': travelMode }">
    <world-map class="world-map-container"></world-map>
    <!--<dialogue-panel />-->
    <main-status />
<!--    
    <main-status-bar></main-status-bar>
    <game-chat :hidden="mode !== 'chat'" @new-messages="newChatMessage = $event" ref="gameChat"></game-chat>
-->
    <secondary-status />
    <main-controls :only-selected="travelMode" />
    <game-chat />
    <ui-tutorial v-if="tutorialArea" />
</div>
    `
};

var _extends$13 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const PROJECTILE_TIME = 45;
const ANIMATION_FREQ = 30;

Vue.component("fighting-screen", {
  data: () => ({
    indicators: [],
    animation: null,
    animationStep: 0,
    animationDisplays: [],
    extraFrames: {
      hostiles: [],
      friendlies: []
    },
    source: null,
    target: null
  }),

  subscriptions() {
    const creaturesStream = ServerService$1.getNodeStream().pluck("creatures").map(creatures => [...creatures].sort(creaturesSorter));

    return {
      myInventory: DataService$1.getMyInventoryStream(),
      creatures: creaturesStream,
      friendlies: creaturesStream.map(creatures => creatures.filter(creature => !creature.hostile)),
      hostiles: creaturesStream.map(creatures => creatures.filter(creature => creature.hostile)),
      fightingFeedback: ServerService$1.getDataStream("fightingFeedback", false).do(fightingFeedback => {
        this.queueAnimation(fightingFeedback);
      })
    };
  },

  methods: {
    queueAnimation(details) {
      this.indicators.push(details);
    },

    displayStyle(animation, target, step) {
      const centerTarget = Utils$1.getDomElementCenter(target);
      if (!centerTarget[0]) {
        return {
          display: "none"
        };
      }
      const change = (step - PROJECTILE_TIME) / (100 - PROJECTILE_TIME);
      return {
        top: `calc(${centerTarget[1]}px - ${2.5 * change}vmin)`,
        left: `calc(${centerTarget[0]}px + ${8 * change}vmin)`
      };
    },

    triggerNextAnimation() {
      this.animation = this.indicators.shift();
      this.animationStep = 0;

      const getTargetEl = ref => this.$refs[ref] && this.$refs[ref][0] && this.$refs[ref][0].$el && this.$refs[ref][0].$el.querySelector(".avatar-icon");

      if (!this.animation) {
        this.extraFrames.hostiles = [];
        this.extraFrames.friendlies = [];
        setTimeout(() => {
          this.triggerNextAnimation();
        }, this.time);
        return;

        // TODO: DEBUG
        // const who = this.creatures[Math.floor(this.creatures.length * Math.random())].id;
        // let whom;
        // do {
        //     whom = this.creatures[Math.floor(this.creatures.length * Math.random())].id;
        // } while (whom === who);
        // this.animation = {
        //     who,
        //     whom,
        //     // miss: true,
        //     // damages: [],
        //     damages: [{"name":"Bruise","icon":"/resources/icons/creatures/yellow_17.png","category":80,"effects":{"Pain":{"value":127}},"order":80,"stacks":127,"duration":{"min":402840,"max":402840},"public":true,"stacked":127},{"name":"Internal damage","icon":"/resources/icons/creatures/red_35.png","category":80,"effects":{"Pain":{"value":4.41},"Internal damage":{"value":22}},"order":80,"stacks":22,"duration":{"min":143640,"max":143640},"severity":3,"public":true,"stacked":22},{"name":"Extreme pain","icon":"/resources/icons/creatures/tooth_t_nobg.png","category":70,"effects":{"Mood":{"value":-150}},"order":70,"duration":{"min":null,"max":null},"severity":4,"public":true,"stacked":1},{"name":"Blood Loss (initial)","icon":"/resources/icons/creatures/red_21_health.png","category":70,"effects":{"Strength":{"value":-3},"Dexterity":{"value":-5}},"order":70,"duration":{"min":null,"max":null},"severity":1,"public":true,"stacked":1}],
        // };
        // TODO: DEBUG
      }

      this.source = getTargetEl(`creature${this.animation.who}`);
      this.target = getTargetEl(`creature${this.animation.whom}`);

      this.extraFrames.hostiles = [];
      this.extraFrames.friendlies = [];

      if (this.source && !Utils$1.isDomElementDisplayed(this.source)) {
        this.source = null;
        const sourceCreature = this.creatures.find(c => c.id === this.animation.who);
        this.extraFrames[sourceCreature.hostile ? "hostiles" : "friendlies"].push(sourceCreature);
      }
      if (this.target && !Utils$1.isDomElementDisplayed(this.target)) {
        this.target = null;
        const targetCreature = this.creatures.find(c => c.id === this.animation.whom);
        this.extraFrames[targetCreature.hostile ? "hostiles" : "friendlies"].push(targetCreature);
      }

      this.timeout = setTimeout(() => {
        if (!this.source) {
          this.source = getTargetEl(`creatureExtra${this.animation.who}`);
        }
        if (!this.target) {
          this.target = getTargetEl(`creatureExtra${this.animation.whom}`);
        }

        this.timeout = setTimeout(() => {
          if (this.source && this.target) {
            this.addDamageDisplay();
          }
          this.triggerNextAnimation();
        }, this.time * PROJECTILE_TIME / 100);
      });
    },

    addDamageDisplay() {
      this.animationDisplays = [...this.animationDisplays, {
        animation: this.animation,
        animationStep: this.animationStep,
        target: this.target,
        style: this.displayStyle(this.animation, this.target, this.animationStep)
      }];
    },

    close() {
      ContentFrameService.triggerClosePanel();
    },

    consumables(item) {
      return item.actions.some(action => action.id === "Consume");
    }
  },

  computed: {
    finished() {
      if (!this.hostiles) {
        return false;
      }
      return this.hostiles.every(c => c.dead);
    },

    projectileStyle() {
      if (!this.animation || !this.source || !this.target || this.animationStep > PROJECTILE_TIME) {
        return null;
      }
      const centerSource = Utils$1.getDomElementCenter(this.source);
      const centerTarget = Utils$1.getDomElementCenter(this.target);

      const step = Math.pow(this.animationStep * 100 / (PROJECTILE_TIME * 10), 2);

      const variance = Math.abs(centerSource[1] - centerTarget[1]) * Math.sin(step * Math.PI / 100) / 5;
      const x = centerSource[0] * ((100 - step) / 100) + centerTarget[0] * (step / 100) + variance;
      const y = centerSource[1] * ((100 - step) / 100) + centerTarget[1] * (step / 100) + variance;

      // const x = 100 + Math.abs(this.animationStep - 25) * 25;
      // const y = 400 + 100 * Math.sin(Math.PI * this.animationStep / (12.5 / 2));

      const lastXY = this.lastXY || { x: 0, y: 0 };
      const rotation = -Math.PI / 2 + Math.atan2(y - lastXY.y, x - lastXY.x);

      this.lastXY = { x, y };

      return {
        top: `${y}px`,
        left: `${x}px`,
        transform: `rotate(${rotation}rad) scale(${(100 + this.animationStep * 3) / 200})`,
        opacity: (100 + this.animationStep * 2) / 200
      };
    }
  },

  mounted() {
    this.time = 1500;
    this.timeout = setTimeout(() => this.triggerNextAnimation());
    this.interval = setInterval(() => {
      this.time = 1500 - Math.min(Math.max(0, this.indicators.length - 6) * 20, 1000);
      const step = 100 * ANIMATION_FREQ / this.time;
      this.animationStep += step;
      this.animationDisplays = this.animationDisplays.filter(object => {
        object.animationStep += step;
        return object.animationStep <= 100;
      }).map(display => _extends$13({}, display, {
        style: this.displayStyle(display.animation, display.target, display.animationStep)
      }));
    }, ANIMATION_FREQ);
  },

  destroyed() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  },

  template: `
<div class="fighting-screen-view">
    <div class="strike-projectile" :style="projectileStyle" v-if="projectileStyle"></div>
    <div class="strike-display" v-for="display in animationDisplays" :style="display.style">
        <div class="label miss" v-if="display.animation.hidden">Hidden</div>
        <div class="label miss" v-else-if="display.animation.dodge">Dodge</div>
        <div class="label miss" v-else-if="display.animation.fleeMiss">Fleeing</div>
        <div class="label miss" v-else-if="display.animation.miss">Miss</div>
        <div class="label deflect" v-else-if="display.animation.damages && !display.animation.damages.length">
            <div class="extra-text" v-if="display.animation.graze">
                {{display.animation.graze ? 'Graze' : 'Hit'}}
            </div>
            Deflect
        </div>
        <div
            class="label hit"
            :class="{ graze: display.animation.graze }"
            v-else-if="display.animation.damages && display.animation.damages.length"
        >
            <div class="extra-text">{{display.animation.graze ? 'Graze' : 'Hit'}}</div>
            <div class="damages">
                <div v-for="effect in display.animation.damages">
                    <item-icon size="tiny" :src="effect.icon" :qty="effect.stacks" />
                </div>
            </div>
        </div>
        <div class="label miss" v-else>
            ???
        </div>
    </div>
    <div class="victory" v-if="finished" @click="close()">
        <div class="banner">
            <div class="label">Victory!</div>
        </div>
        <div class="overlay"></div>
    </div>
    <div class="main-display">
        <div class="creature-frames">
            <section>
                <header>Friendlies</header>
                <div v-if="creatures && !creatures.length" class="empty-list"></div>
                <div class="creature-list">
                    <creature-list-item
                        v-for="creature in friendlies"
                        :ref="'creature' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
                <div class="extra" v-if="extraFrames.friendlies.length">
                    <creature-list-item
                        v-for="creature in extraFrames.friendlies"
                        :ref="'creatureExtra' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
            </section>
            <section>
                <header>Hostiles</header>
                <div v-if="creatures && !creatures.length" class="empty-list"></div>
                <div class="creature-list">
                    <creature-list-item
                        v-for="creature in hostiles"
                        :ref="'creature' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
                <div class="extra" v-if="extraFrames.hostiles.length">
                    <creature-list-item
                        v-for="creature in extraFrames.hostiles"
                        :ref="'creatureExtra' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
            </section>
        </div>
        <div class="quick-actions">
            <equipment-selector equipment-slot="Weapon" class="tool-selector" />
            <div class="scrollable">
                <inventory v-if="myInventory" :data="myInventory.items" type="player" :filter="consumables" />
            </div>
        </div>    
    </div>
</div>
    `
});

const FightView = {
  data: () => ({}),

  subscriptions() {
    return {
      chat: ServerService$1.getChatMessageStream(),
      currentNodeId: DataService$1.getCurrentNodeIdStream().do(currentNodeId => {
        ServerService$1.selectLiveUpdateNodeId(currentNodeId);
      }),
      dead: ServerService$1.getDeadStream().do(data => {
        if (data.dead) {
          window.location.hash = "/dead";
        }
      }),
      acceptedLegalTerms: DataService$1.getAcceptedLegalTermsStream().do(acceptedLegalTerms => {
        if (!acceptedLegalTerms) {
          window.location.hash = "/register";
        }
      })
    };
  },

  created() {
    ServerService$1.registerHandler("clientSideEvent", data => {
      eval(data)(this, window);
    });
  },

  methods: {
    ucfirst: Utils$1.ucfirst,
    linebreaks: Utils$1.linebreaks,
    formatNumber: Utils$1.formatNumber,

    forceReloadPage() {
      console.log("reload3");
      window.location.reload();
    }
  },

  template: `
<div class="main-container">
    <main-controls :only-selected="true" />
    <fighting-screen />
</div>
    `
};

Vue.component("player-avatar", {
  props: {
    hairColor: false,
    skinColor: false,
    hairColorGrayness: 0,
    hairStyle: false,
    headOnly: false,
    size: {
      default: "normal"
    },
    creature: null
  },

  data: () => ({
    dead: false,
    sleeping: false,
    snoring: null,
    tired: false,
    blinking: false,
    happy: false,
    slightlySad: false,
    sad: false,
    verySad: false,
    gloomy: false,
    feelingPain: 0
  }),

  computed: {
    eyesState() {
      if (this.dead) {
        return "dead";
      }

      if (this.sleeping) {
        return "eyes_closed_2";
      }

      if (this.feelingPain >= 3) {
        return "eyes_closed_3";
      }
      if (this.feelingPain >= 1) {
        return "eyes_closed_1";
      }

      if (this.blinking) {
        return "eyes_closed_1";
      }
      if (this.tired) {
        return "eyes_3";
      }
      return "eyes_1";
    },

    mouthStatePrefix() {
      switch (this.creature.race) {
        case "Orc":
          return "fangs/";
        default:
          return "";
      }
    },

    mouthState() {
      if (this.dead) {
        return "tongue_out";
      }

      if (this.sleeping) {
        if (this.snoring === 1) {
          return "closed_1";
        }
        if (this.snoring === 0) {
          return "open_3";
        }
      }

      if (this.feelingPain >= 3) {
        return "pain_4";
      }
      if (this.feelingPain >= 1) {
        return "pain_1";
      }

      if (this.happy) return "smiling_wide_2";
      if (this.slightlySad) return "neutral";
      if (this.sad) return "sad_1";
      if (this.verySad) return "sad_2";
      if (this.gloomy) return "sad_3";
      return "smiling_low";
    },

    animations() {
      (this.animationsTimeouts || []).forEach(ai => clearInterval(ai));
      this.animationsTimeouts = [];

      if (this.creature) {
        if (this.creature.dead) {
          this.dead = true;
          return;
        }
        const smiling = {
          // Glad: true,
          // Happy: true,
          Cheerful: true,
          Overjoyed: true,
          Ecstatic: true
        };

        this.happy = this.hasBuff(b => smiling[b.name]);
        this.slightlySad = this.hasBuff("Slightly Sad");
        this.sad = this.hasBuff("Sad");
        this.verySad = this.hasBuff("Very Sad");
        this.gloomy = this.hasBuff("Gloomy");

        this.tired = this.hasBuff("Very Tired") || this.hasBuff("Exhausted");

        this.sleeping = this.isAction("Sleep");
        if (this.sleeping) {
          this.snoring = 0;
          this.repeatingAnimation(() => this.snoring = 1, () => this.snoring = 0, () => 1000 + Math.random() * 300, () => 1000 + Math.random() * 300);
        }

        const painDegree = this.hasBuff("Minor pain") && 1 || this.hasBuff("Pain") && 2 || this.hasBuff("Major pain") && 3 || this.hasBuff("Extreme pain") && 4;

        this.feelingPain = 0;
        this.repeatingAnimation(() => this.feelingPain = painDegree, () => this.feelingPain = 0, () => 12000 / painDegree + Math.random() * 2000, () => 4000 / (5 - painDegree) + Math.random() * 500);

        this.blinking = false;
        this.repeatingAnimation(() => this.blinking = true, () => this.blinking = false, () => 3000 + Math.random() * 1000, () => 300 + Math.random() * 200);
      }

      return "idle";
    },

    hairColorClass() {
      return `hair-color hair-color-${this.hairColor % LOOKS.HAIR_COLORS}-${this.hairColorGrayness || 0}`;
    },

    skinColorClass() {
      return `skin-color skin-color-${this.skinColor % LOOKS.SKIN_COLORS}`;
    },

    hairStyleClass() {
      return `hair-style-${this.hairStyle % LOOKS.HAIR_STYLES}`;
    },

    eyebrows() {
      return this.creature && this.creature.race === "Elf" ? "eyebrows2/" : "";
    }

    // 15, 16, 33?, 51
  },

  methods: {
    repeatingAnimation(applyCallback, unapply, delayGenerator, durationGenerator) {
      const timeout = setTimeout(() => {
        applyCallback();
        const idx = this.animationsTimeouts.indexOf(timeout);
        if (idx !== -1) {
          this.animationsTimeouts.splice(idx, 1);
        }
        this.repeatingAnimation(unapply, applyCallback, durationGenerator, delayGenerator);
      }, delayGenerator());

      this.animationsTimeouts.push(timeout);
    },

    isAction(name) {
      return this.creature.currentAction && this.creature.currentAction.actionId === name;
    },

    hasBuff(nameOrCallback) {
      let filter = nameOrCallback;
      if (typeof nameOrCallback !== "function") {
        filter = b => b.name.toLowerCase() === nameOrCallback.toLowerCase();
      }
      return this.creature.buffs && this.creature.buffs.some(filter);
    }
  },

  template: `
<div class="player-avatar" :class="[{ 'head-only': headOnly }, animations, size, creature.race]">
    <div class="avatar-body-wrapper">
        <div class="body">
            <div class="arm-anchor left">
                <div class="forearm" :class="skinColorClass"></div>
                <div class="hand" :class="skinColorClass"></div>
                <div class="fingers" :class="skinColorClass"></div>
            </div>
            <div class="leg-anchor left">
                <div class="hip" :class="skinColorClass"></div>
                <div class="foot" :class="skinColorClass"></div>
            </div>
            <div class="torso" :class="skinColorClass"></div>
            <div class="head-anchor">
                <div class="face" :class="skinColorClass"></div>
                <div class="eyes" :class="hairColorClass" :style="{ 'background-image': 'url(../images/avatars/body_parts/eyes_2/' + eyebrows + eyesState + '_brows.png)'}"></div>
                <div class="eyes" :style="{ 'background-image': 'url(../images/avatars/body_parts/eyes_2/' + eyebrows + eyesState + '_eyes.png)'}"></div>
                <div class="hair" :class="[hairColorClass, hairStyleClass]"></div>
                <div class="mouth" :style="{ 'background-image': 'url(../images/avatars/body_parts/mouth/' + mouthStatePrefix + mouthState + '.png)'}"></div>
                <div class="ear" :class="skinColorClass"></div>
            </div>
            <div class="leg-anchor right">
                <div class="hip" :class="skinColorClass"></div>
                <div class="foot" :class="skinColorClass"></div>
            </div>
            <div class="arm-anchor right">
                <div class="forearm" :class="skinColorClass"></div>
                <div class="hand" :class="skinColorClass"></div>
            </div>
        </div>
    </div>
</div>
    `
});

Vue.component("option-selector", {
  props: ["optionName", "options", "value"],

  mounted() {
    this.$emit("input", Math.floor(Math.random() * this.options));
  },

  methods: {
    prev() {
      this.$emit("input", (this.value + this.options - 1) % this.options);
    },

    next() {
      this.$emit("input", (this.value + this.options + 1) % this.options);
    }
  },

  template: `
<div class="option-selector">
    <div class="prev">
        <button @click="prev();">&lt;</button>
    </div>
    <div class="label">{{optionName}}</div>
    <div class="next">
        <button @click="next();">&gt;</button>
    </div>
</div>
    `
});

const AvatarCreatorView = {
  data: () => ({
    name: "",
    hairColor: 4,
    skinColor: 1,
    hairStyle: 9,
    raceIdx: 0,
    LOOKS: window.LOOKS
  }),

  methods: {
    goToGame() {
      window.location.hash = "/main";
    },

    createAvatar() {
      ServerService$1.createAvatar(this.name, {
        hairColor: this.hairColor,
        skinColor: this.skinColor,
        hairStyle: this.hairStyle
      }, this.selectedPerks, this.race).then(() => {
        this.goToGame();
      }).catch(error => {
        ToastNotification.notify(error);
      });
    },

    updatePerkSelection(selected) {
      this.selectedPerks = selected.map(p => p.perkCode);
    }
  },

  computed: {
    race() {
      return this.races && this.races[this.raceIdx];
    }
  },

  subscriptions() {
    const soulInfoStream = Rx.Observable.fromPromise(ServerService$1.request("getSoulInfo"));
    return {
      dead: ServerService$1.getDeadStream().do(data => {
        if (!data.dead) {
          window.location.hash = "/main";
        }
      }),
      soulLevel: soulInfoStream.pluck("soulLevel"),
      races: soulInfoStream.map(soulInfo => {
        return soulInfo.races;
      })
    };
  },

  template: `
<div class="avatar-creator-wrapper">
    <div class="avatar-creator">
        <div class="avatar">
            <player-avatar
                class="avatar-image"
                :creature="{ race: race }"
                :head-only="true"
                :hair-color="hairColor"
                :skin-color="skinColor"
                :hair-style="hairStyle"
                :mouth="1"
                size="huge"
            />
        </div>
        <div class="character-creator-wrapper">
            <section class="main-header">
                <header>Create new character</header>
            </section>
            <div class="preferences-wrapper">
                <div class="preferences">
                    <div class="name">
                        <span>Name</span>
                        <input name="user" v-model="name" />
                    </div>
                    <section>
                        <header>Appearance</header>
                        <div>
                            <option-selector v-if="races && races.length > 1" v-model="raceIdx" :optionName="'Race: ' + race" :options="races.length" />
                            <option-selector v-model="hairStyle" optionName="Hair style" :options="LOOKS.HAIR_STYLES" />
                            <option-selector v-model="hairColor" optionName="Hair color" :options="LOOKS.HAIR_COLORS" />
                            <option-selector v-model="skinColor" optionName="Skin tone" :options="LOOKS.SKIN_COLORS" />
                        </div>
                    </section>
                </div>
                <div class="preferences" v-if="soulLevel >= 1">
                    <perks @perks-selected="updatePerkSelection" />
                </div>
            </div>
            <div class="centered">
                <button @click="createAvatar()">Confirm</button>
            </div>
            
        </div>
    </div>
</div>
    `
};

const CreditsView = {
  methods: {
    goBack() {
      window.location = "#/main";
    }
  },

  template: `
<div>
    <dialog-pane-with-logo>
        <p>Design & Programming</p>
        <a class="credits" href="mailto:ethnar.dev@gmail.com" target="_blank">Arkadiusz Bisaga</a>
        <p>Graphics (attribution)</p>
        <a class="credits" href="https://assetstore.unity.com/publishers/13229" target="_blank">Rexard</a>
        <a class="credits" href="https://icons8.com/" target="_blank">Icons8</a>
        <p>Audio (attribution)</p>
        <a class="credits" href="https://freesound.org/people/anne82/">Anne82</a>
        <a class="credits" href="https://freesound.org/people/Arctura/">Arctura</a>
        <a class="credits" href="https://freesound.org/people/blouhond/">Blouhond</a>
        <a class="credits" href="https://freesound.org/people/craftcrest/">Craftcrest</a>
        <a class="credits" href="https://freesound.org/people/Eelke/">Eelke</a>
        <a class="credits" href="https://freesound.org/people/Imjeax/">Imjeax</a>
        <a class="credits" href="https://freesound.org/people/kangaroovindaloo/">Kangaroovindaloo</a>
        <a class="credits" href="https://freesound.org/people/LilyMarie/">LilyMarie</a>
        <a class="credits" href="https://freesound.org/people/LittleRobotSoundFactory/">LittleRobotSoundFactory</a>
        <a class="credits" href="https://freesound.org/people/Proxima4/">Proxima4</a>
        <a class="credits" href="https://freesound.org/people/Suburbanwizard/">Suburbanwizard</a>
        <br/>
        <button class="text" @click="goBack()">Go back</button>
    </dialog-pane-with-logo>
</div>
`
};

var _extends$14 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const DeadView = {
  subscriptions() {
    return {
      dead: ServerService$1.getDeadStream().do(data => {
        if (!data.dead) {
          window.location.hash = "/main";
        }
      }).map(data => console.log(data) || _extends$14({}, data, {
        reasonShort: (data.reason || "").replace("You died", "")
      }))
    };
  },

  methods: {
    continueAfterDeath() {
      this.$router.push(`avatar-creator`);
      console.log("reload2");
      window.location.reload();
    }
  },

  template: `
<div class="dead-frame">
    <div class="dead-text-wrapper">
        <div class="dead-text">
            <div class="you-died">You died</div>
            <div class="reason" v-if="dead">
                {{dead.reasonShort}}
            </div>
            <button @click="continueAfterDeath()">Continue</button>
        </div>
    </div>
</div>
    `
};

const RegisterView = {
  data: () => ({
    accepted: false,
    navigateAway: false
  }),

  subscriptions() {
    return {
      player: DataService$1.getAcceptedLegalTermsStream().do(acceptedLegalTerms => {
        if (acceptedLegalTerms && this.navigateAway) {
          window.location = "#/avatar-creator";
        }
      })
    };
  },

  methods: {
    confirm() {
      if (this.accepted) {
        ServerService.request("acceptLegalTerms").then(() => {
          this.navigateAway = true;
          if (!this.player) {
            window.location = "#/avatar-creator";
          }
        });
      } else {
        ToastNotification.notify("You must accept Terms and Conditions, Privacy Policy & Cookie Policy to proceed");
      }
    }
  },

  template: `
<div class="Register">
    <form>
        <dialog-pane-with-logo>
            <p>
                Welcome to Soulforged!<br/>
                Find out more about the game on our
                <a target="_blank" href="https://soulforged.net/pages/#/about">website</a>.
            </p>
            <label class="agree-text">
                <div>
                    <input type="checkbox" v-model="accepted" />
                </div>
                <div>
                    I agree to the 
                    <a target="_blank" href="https://soulforged.net/pages/#/legal/termsAndConditions">Terms and Conditions</a>, 
                    <a target="_blank" href="https://soulforged.net/pages/#/legal/privacyPolicy">Privacy Policy</a> and 
                    <a target="_blank" href="https://soulforged.net/pages/#/legal/cookiePolicy">Cookie Policy</a>.
                </div>
            </label>
            <button @click.prevent="confirm()">Register</button>
        </dialog-pane-with-logo>
    </form>
</div>
`
};

let tick = 0;
Vue.component("connection-checker", {
  data: () => ({
    connectionIssueLevel: 0,
    infoDialog: false,
    playerActive: true
  }),

  subscriptions() {
    return {
      ticker: DataService$1.getTickerStream().do(ticker => {
        ServerService$1.request("pong", this.playerActive, "p" + tick++ % 10);
        ticker = ticker || 1;

        this.connectionIssueLevel = 0;
        clearTimeout(this.timeoutCheck1);
        clearTimeout(this.timeoutCheck2);
        clearTimeout(this.timeoutCheck3);
        this.timeoutCheck1 = setTimeout(() => {
          this.connectionIssueLevel = 1;
        }, ticker * 1000 + 2000);
        this.timeoutCheck2 = setTimeout(() => {
          this.connectionIssueLevel = 2;
        }, ticker * 3000 + 8000);
        this.timeoutCheck3 = setTimeout(() => {
          ServerService$1.getLocalSettingStream("disableAutoRefresh").first().subscribe(disableAutoRefresh => {
            if (!disableAutoRefresh) {
              window.location.reload();
            }
          });
        }, ticker * 5000 + 30000);
      })
    };
  },

  methods: {
    forceReloadPage() {
      window.location.reload();
    },

    marksLastActive() {
      if (this.activityTimeout) {
        clearTimeout(this.activityTimeout);
      }
      this.playerActive = true;
      this.activityTimeout = setTimeout(() => {
        this.playerActive = false;
      }, 30000);
    }
  },

  created() {
    this.focusHandler = () => {
      setTimeout(() => {
        if (this.connectionIssueLevel > 0) {
          ServerService$1.reconnect();
        } else {
          this.marksLastActive();
        }
      }, 500);
    };
    this.blurHandler = () => {
      this.playerActive = false;
    };
    this.clickHandler = () => {
      this.marksLastActive();
    };
    this.marksLastActive();

    window.addEventListener("focus", this.focusHandler, false);
    window.addEventListener("blur", this.blurHandler, false);
    document.addEventListener("mousedown", this.clickHandler);
  },

  destroy() {
    window.removeEventListener("focus", this.focusHandler);
    window.removeEventListener("blur", this.blurHandler);
    document.removeEventListener("mousedown", this.clickHandler);
  },

  template: `
<div class="connection-checker">
    <transition name="fade">
        <div class="problem-icon-wrapper" v-if="!!connectionIssueLevel" @click="infoDialog = !infoDialog">
            <div class="problem-icon" :class="{ highlight: connectionIssueLevel === 2 }">
                <item-icon :src="'./images/connection' + connectionIssueLevel + '.png'"></item-icon>
            </div>
        </div>
    </transition>
    <modal v-if="infoDialog" @close="infoDialog = false">
        <template slot="header">
            Connection issues
        </template>
        <template slot="main">
            <div class="help-text">
                It appears there are some problems with the connection to the server.<br/>
                If they persist you can try to reload the page to resolve this.
            </div>
            <button @click="forceReloadPage();">Reload the page</button>
        </template>
    </modal>
</div>
    `
});

window.LEGAL_HTML = '© All rights reserved. <a href="#/credits">Credits</a>';
window.LOOKS = {
  HAIR_COLORS: 5,
  SKIN_COLORS: 6,
  HAIR_STYLES: 12
};
window.RESOURCE_SIZES = {
  0: "absent",
  1: "scarce",
  2: "ample",
  3: "abundant",
  4: "countless"
};

// document.addEventListener('click', () => {
//     var docElm = document.documentElement;
//     if (docElm.requestFullscreen) {
//         docElm.requestFullscreen();
//     } else if (docElm.mozRequestFullScreen) {
//         docElm.mozRequestFullScreen();
//     } else if (docElm.webkitRequestFullScreen) {
//         docElm.webkitRequestFullScreen();
//     }
// });

Vue.use(VueRx, Rx);
Vue.use(VueTouch);

Array.prototype.toObject = function (keyGetter, valueGetter = i => i) {
  const object = {};
  this.forEach((i, idx) => {
    object[keyGetter(i, idx)] = valueGetter(i);
  });
  return object;
};

Rx.Observable.combineLatestMap = map => {
  const keys = Object.keys(map);
  return Rx.Observable.combineLatest(Object.values(map)).map(result => result.toObject((v, idx) => keys[idx]));
};

Vue.prototype.stream = function (prop) {
  return this.$watchAsObservable(prop).pluck("newValue").startWith(this[prop]);
};

window.router = new VueRouter({
  routes: [{
    path: "/login",
    component: LoginView
  }, {
    path: "/avatar-creator",
    component: AvatarCreatorView
  }, {
    path: "/register",
    component: RegisterView
  }, {
    path: "/credits",
    component: CreditsView
  }, {
    path: "/dead",
    component: DeadView
  }, {
    path: "/main",
    component: MainView
  }, {
    path: "/fight",
    component: FightView
  }, {
    path: "*",
    redirect: "/main"
  }]
});

const app = new Vue({
  router: window.router,
  template: `
<div class="main-container-wrapper">
    <router-view></router-view>
    <toast-notification />
    <connection-checker />
    <audio-player />
</div>
    `
}).$mount("#app");

window.onerror = function (error) {
  console.error(error);
  ServerService.reportClientSideError({
    message: error.toString(),
    stack: error.stack
  });
};

Vue.config.errorHandler = (error, vm, info) => {
  console.error("Error in component:", vm.$vnode && vm.$vnode.tag, `(${info})`);
  console.error(error);
  ServerService.reportClientSideError({
    message: error.toString(),
    component: vm.$vnode && vm.$vnode.tag,
    info,
    stack: error.stack
  });
};

}());

import { pullNotifications } from "./pull-notifications.js";
import "../libs/json-delta.js";
import { ToastNotification } from "../components/generic/toast-notification.js";

const pendingRequests = {};
const updateHandlers = {};
const websocketProtocol =
  window.location.protocol === "https:" ? "wss:" : "ws:";
const domain = `${window.location.hostname}${
  window.location.port ? ":" + window.location.port : ""
}`;
const createAvatarUrl = "/api/createAvatar";
const avatarsUrl = "/api/getAvatars";

let previousData;
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

const fetcher = (url, params) =>
  new Promise((resolve, reject) =>
    fetch(url, params)
      .then(function(response) {
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
      })
      .catch(error => {
        reject(error);
      })
  );

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

      dataUsageStream
        .first()
        .subscribe(soFar => dataUsageStream.next(soFar + string.data.length));
      if (json.r6) {
        if (pendingRequests[json.key]) {
          pendingRequests[json.key](json.data);
          delete pendingRequests[json.key];
        } else {
          throw new Error(
            "Received response to a request that wasn't sent: " +
              JSON.stringify(json)
          );
        }
      }
      if (json.u5) {
        if (updateHandlers[json.u5]) {
          updateHandlers[json.u5](json.data);
        } else {
          console.warn(
            "Received update that does not have a handler: " + json.update
          );
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

    openPromise = new Promise(resolve => (connection.onopen = resolve)).then(
      () => connection
    );

    openPromise.then(() => {
      connected = true;
      pullNotifications.init().then(token => {
        pushNotificationsTokenStream.next(token);
        ServerService.getPushNotificationsEnabledStream()
          .first()
          .subscribe(value => {
            if (value === undefined) {
              setTimeout(() => {
                ServerService.togglePushNotifications(true);
              }, 5000);
            }
          });
        ServerService.request("get-push-notifications", { token });
      });
    });
  }
  return openPromise;
};

const dataStreams = {};
const dynamicComponentCache = {};
export const ServerService = (window.ServerService = {
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
      ServerService.registerHandler(topic, data => {
        dataStreams[topic].next(data);
      });
      ServerService.triggerDataFetch(topic);
    }
    return dataStreams[topic];
  },

  triggerDataFetch(topic) {
    ServerService.request("dataFetchTrigger", topic);
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
        connection.send(
          JSON.stringify({
            r6: name,
            params: params,
            key: key
          })
        );
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
    return ServerService.getNodeStream()
      .map(node => node.zLevel <= -9000)
      .distinctUntilChanged();
  },

  getNodeStream() {
    return DataService.getCurrentNodeIdStream().switchMap(nodeId =>
      MapService.getNodeStream(nodeId)
    );
  },

  getInfo(type, params) {
    return ServerService.request(`info.${type}`, params);
  },

  setSetting(key, value) {
    return ServerService.request("setUserSettings", {
      key,
      value
    });
  },

  getSettingsStream() {
    if (!settingsFetched) {
      setTimeout(() => ServerService.request(`getUserSettings`));
      settingsFetched = true;
    }
    return ServerService.getDataStream("user-settings");
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
    return ServerService.getNodeStream().map(node =>
      node.structures.find(s => s.inventory)
    );
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
      ServerService.registerHandler("dead", msg => {
        deadStream.next({
          dead: true,
          reason: msg
        });
      });
      ServerService.registerHandler("alive", () => {
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
    return Rx.Observable.fromPromise(pullNotifications.init()).switchMap(
      token =>
        ServerService.getDataStream("push-notifications")
          .filter(data => data.token === token)
          .map(data => data.enabled)
    );
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
        ServerService.request("set-push-notifications", {
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
      ServerService.registerHandler("chat-message", data => {
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
      ServerService.request("live-update-node", {
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
    ServerService.request("client-side-error", payload);
  }
});
window.ServerService = ServerService;

let startupId = null;
ServerService.registerHandler("startup-id", data => {
  if (startupId && startupId !== data) {
    window.location.reload();
  }
  startupId = data;
});

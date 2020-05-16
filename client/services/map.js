import { ServerService } from "./server.js";

let nodeIdsStream;
const nodesStreams = {};
let previousData = null;
let nodesByIds = {};
let usingMapDiffs = false;
const updatedStoredResourcesStream = new Rx.ReplaySubject(1);
let zLevelStream;
updatedStoredResourcesStream.next(true);

const availableZLevels = {};
const availableZLevelsStream = new Rx.ReplaySubject(1);

ServerService.getResetStream().subscribe(() => {
  previousData = null;
  usingMapDiffs = null;
});

export const MapService = (window.MapService = {
  getNodeIdsStream() {
    if (!nodeIdsStream) {
      const stream = new Rx.Subject();

      nodeIdsStream = stream
        .distinctUntilChanged(null, JSON.stringify)
        .shareReplay(1);

      ServerService.registerHandler("regionNameUpdate", data => {
        if (data) {
          data.nodeIds.forEach(nodeId => {
            const nodeStream = nodesStreams[nodeId];
            if (nodeStream) {
              nodeStream.first().subscribe(oldData => {
                nodeStream.next({
                  ...oldData,
                  region: data.regionName
                });
              });
            }
          });
        }
      });

      ServerService.registerHandler("remove-node-id", nodeId => {
        delete nodesByIds[nodeId];
        stream.next(Object.keys(nodesByIds));
      });

      ServerService.registerHandler("mapData", data => {
        if (previousData && usingMapDiffs) {
          data = window.jsonDelta.applyDiff(previousData, data);
        }
        if (usingMapDiffs) {
          previousData = data;
        } else {
          usingMapDiffs = true;
        }
        if (!data || !data.reduce) {
          console.error("Wrong map data:", data);
          return;
        }

        data.forEach(item => {
          nodesStreams[item.id] =
            nodesStreams[item.id] || new Rx.ReplaySubject(1);
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
      ServerService.getNodeStream()
        .pluck("zLevel")
        .distinctUntilChanged()
        .subscribe(currentZLevel => {
          zLevelStream.next(currentZLevel);
        });
    }
    return zLevelStream;
  },

  changeZLevel(changeBy) {
    MapService.getCurrentZLevelStream()
      .first()
      .subscribe(last => {
        zLevelStream.next(last + changeBy);
      });
  },

  getAvailableZLevelsStream() {
    return availableZLevelsStream;
  }
});

MapService.getNodeIdsStream();

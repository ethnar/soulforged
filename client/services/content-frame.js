import { MapService } from "./map.js";
import { ServerService } from "./server.js";

const beforeOpenStream = new Rx.Subject();
const showNodeDetails = new Rx.Subject();
const selectedNode = new Rx.ReplaySubject(1);
const panelStream = new Rx.Subject();
const mapModeStream = new Rx.ReplaySubject(1);
let liveNodeId;
selectedNode.next(null);

export const ContentFrameService = (window.ContentFrameService = {
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
        return ServerService.getNodeStream();
      }
      return MapService.getNodeStream(nodeId);
    });
  },

  triggerShowNodeDetails(node) {
    if (node) {
      showNodeDetails.next(true);
    }
    liveNodeId = node && node.id;
    ServerService.selectLiveUpdateNodeId(liveNodeId);
  },

  triggerNodeSelected(node) {
    selectedNode.next(node && node.id);
  }
});

ServerService.getResetStream().subscribe(() => {
  ServerService.selectLiveUpdateNodeId(liveNodeId);
});

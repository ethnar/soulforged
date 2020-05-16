import { MapService } from "../../services/map.js";
import { ServerService } from "../../services/server.js";
import { DataService } from "../../services/data.js";
import { Utils } from "../generic/utils.js";
import "./map-node.js";
import "./actions.js";
import "./map-overlay.js";
import "../generic/radial-progress.js";

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
    const playerInfoStream = DataService.getPlayerInfoStream();
    const nodeStream = ServerService.getNodeStream();
    const nodeIdsStream = MapService.getNodeIdsStream().do(() => {
      this.updateActual();
    });
    const pathNodesStream = playerInfoStream
      .map(playerInfo => [playerInfo.location, ...playerInfo.travelQueue])
      .distinctUntilChanged(null, JSON.stringify)
      .switchMap(travelQueue => {
        const nodeStreams = {};
        travelQueue.forEach(nodeId => {
          nodeStreams[nodeId] = MapService.getNodeStream(nodeId).first();
        });

        return Rx.Observable.combineLatestMap(nodeStreams);
      });

    const nodesStream = nodeIdsStream
      .switchMap(nodeIds =>
        Rx.Observable.combineLatest(
          nodeIds.map(nodeId => MapService.getNodeStream(nodeId).first())
        )
      )
      .shareReplay(1);
    const boxStream = nodesStream
      .map(nodes => {
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
      })
      .shareReplay(1);
    const sizeStream = boxStream.map(box => ({
      width: box.right - box.left + 1,
      height: box.bottom - box.top + 1
    }));
    const nodeTokensStream = Rx.Observable.combineLatestMap({
      nodes: nodesStream,
      box: boxStream,
      playerInfo: playerInfoStream,
      currentNode: nodeStream
    })
      .throttleTime(100)
      .map(({ nodes, box, playerInfo, currentNode }) => {
        const offsetX = -box.left;
        const offsetY = -box.top;
        return nodes
          .map(node => ({
            ...node,
            isInRange: node.isInVisionRange,
            creatures: (node.creatures || []).sort(creaturesSorter),
            hasHostiles: (node.creatures || []).some(c => c.hostile && !c.dead),
            hasFriendlies: (node.creatures || []).some(
              c => !c.hostile && !c.dead
            ),
            highlight:
              playerInfo.travelQueue[playerInfo.travelQueue.length - 1] ===
              node.id,
            x: node.x + offsetX,
            y: node.y + offsetY
          }))
          .toObject(node => node.id);
      })
      .shareReplay(1);
    const pathsStream = Rx.Observable.combineLatest([
      pathNodesStream,
      boxStream,
      playerInfoStream
    ]).map(([nodes, box, playerInfo]) => {
      const offsetX = -box.left;
      const offsetY = -box.top;

      let current = playerInfo.location;

      return playerInfo.travelQueue
        .map(nodeId => {
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
            length: Math.round(
              Math.sqrt(
                Math.pow(Math.abs(node.x - travelNode.x), 2) +
                  Math.pow(Math.abs(node.y - travelNode.y), 2)
              )
            ),
            angle: Math.atan2(node.y - travelNode.y, node.x - travelNode.x)
          };
        })
        .filter(path => !!path);
    });
    const currentNodeIdStream = ServerService.getNodeStream()
      .map(node => node.id)
      .distinctUntilChanged();

    const mapOffsetStream = Rx.Observable.merge(
      currentNodeIdStream.first(),
      ServerService.getIsDungeonStream().switchMap(isDungeon =>
        isDungeon ? currentNodeIdStream : Rx.Observable.empty()
      )
    )
      .distinctUntilChanged()
      .switchMap(nodeId =>
        nodeTokensStream
          .map(nodes => Object.values(nodes).find(node => node.id === nodeId))
          .first()
      )
      .do(node => {
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
    const regionsStream = Rx.Observable.combineLatest([
      nodeIdsStream.switchMap(nodeIds =>
        Rx.Observable.combineLatest(
          nodeIds.map(nodeId => MapService.getNodeStream(nodeId))
        )
      ),
      boxStream
    ])
      .throttleTime(500)
      .map(([nodes, box]) => {
        const offsetX = -box.left;
        const offsetY = -box.top;
        return nodes
          .map(node => ({
            id: node.id,
            region: node.region,
            x: node.x + offsetX,
            y: node.y + offsetY,
            zLevel: node.zLevel
          }))
          .reduce(
            (acc, node) =>
              node.region
                ? {
                    ...acc,
                    [node.region]: [
                      ...(acc[node.region] || []),
                      {
                        x: node.x,
                        y: node.y,
                        zLevel: node.zLevel || 0
                      }
                    ]
                  }
                : acc,
            {}
          );
      })
      .map(regions => {
        const result = {};
        Object.keys(regions).forEach(regionName => {
          const positions = regions[regionName];
          const x =
            positions.reduce((acc, p) => acc + p.x, 0) / positions.length;
          const y =
            positions.reduce((acc, p) => acc + p.y, 0) / positions.length;

          const zLevel = positions[0].zLevel;

          let angle =
            (positions.length * positions.reduce((a, p) => a + p.x * p.y, 0) -
              positions.reduce((a, p) => a + p.x, 0) *
                positions.reduce((a, p) => a + p.y, 0)) /
            (positions.length * positions.reduce((a, p) => a + p.x * p.x, 0) -
              Math.pow(
                positions.reduce((a, p) => a + p.x, 0),
                2
              ));

          const stretch = Math.max(
            Math.abs(
              positions.reduce((acc, p) => Math.min(acc, p.x), Infinity) -
                positions.reduce((acc, p) => Math.max(acc, p.x), -Infinity)
            ),
            Math.abs(
              positions.reduce((acc, p) => Math.min(acc, p.y), Infinity) -
                positions.reduce((acc, p) => Math.max(acc, p.y), -Infinity)
            )
          );
          const textSize =
            Math.min(Math.max(stretch / (regionName.length * 3), 2), 4.5) * 6;

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
      currentZLevel: MapService.getCurrentZLevelStream()
    };
  },

  computed: {
    draggableMapStyle() {
      return {
        width: this.size.width + "px",
        height: this.size.height + "px",
        transform:
          "translate(" +
          (-this.mapOffsetActual.x + "px,") +
          (-this.mapOffsetActual.y + "px") +
          ") scale(" +
          this.scaleActual +
          ")"
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

      this.mapOffset.x = Math.min(
        this.mapOffset.x,
        (this.box.right - this.box.left) * this.scale
      );
      this.mapOffset.y = Math.min(
        this.mapOffset.y,
        (this.box.bottom - this.box.top) * this.scale
      );
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
      const maxRes = Math.max(
        (screen && screen.width) || 0,
        (screen && screen.height) || 0
      );
      return Math.max(4, 4 + Math.floor(((maxRes - 640) * 4) / 1280));
    },
    setScale(scale, x, y) {
      if (!this.mapOffset) {
        return;
      }
      const maxZoom = this.getMaxZoom();
      scale = Math.min(Math.max(0.5, scale), maxZoom);
      this.previousScale = this.previousScale || 1;
      localStorage.setItem("map-zoom-scale", scale);
      this.mapOffset.x = (this.mapOffset.x * scale) / this.scale;
      this.mapOffset.y = (this.mapOffset.y * scale) / this.scale;
      this.scale = scale;
      this.updateActual();
    },
    onWheel(event) {
      let deltaY = event.deltaY;
      if (Utils.isFirefox() && parseInt(deltaY, 10) === deltaY) {
        deltaY *= 20;
      }
      this.setScale(this.previousScale - deltaY / 100);
      this.previousScale = this.scale;
      event.stopPropagation();
      event.preventDefault();
    },
    onPinch(event) {
      this.setScale(
        this.previousScale * event.scale,
        event.center.x,
        event.center.y
      );
    },
    regionNameOpacity(position) {
      return Math.min(
        1,
        0.16 +
          Math.abs(position.y * this.scale - this.mapOffset.y) / 300 +
          Math.abs(position.x * this.scale - this.mapOffset.x) / 300
      );
    },
    updateActual() {
      if (!this.updateTimeout) {
        this.updateTimeout = setTimeout(() => {
          this.updateTimeout = null;
          this.mapOffsetActual = { ...this.mapOffset };
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
        top:
          (this.mapOffsetActual.y - height / 2) / this.scaleActual -
          NODE_SIZE_BUFFER,
        left:
          (this.mapOffsetActual.x - width / 2) / this.scaleActual -
          NODE_SIZE_BUFFER,
        right:
          (this.mapOffsetActual.x + width / 2) / this.scaleActual +
          NODE_SIZE_BUFFER,
        bottom:
          (this.mapOffsetActual.y + height / 2) / this.scaleActual +
          NODE_SIZE_BUFFER
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

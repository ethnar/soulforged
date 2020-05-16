import { ContentFrameService } from "../../services/content-frame.js";
import { ServerService } from "../../services/server.js";
import { MapService } from "../../services/map.js";
import { Utils } from "../generic/utils.js";
import "./actions.js";
import "./frames/node-creatures.js";
import "./frames/node-resources.js";
import "./frames/node-structures.js";
import "../generic/radial-progress.js";
import "../generic/tooltip.js";
import { DataService } from "../../services/data.js";
import "../generic/staggered-show.js";

Vue.component("node-header", {
  props: {
    node: null
  },

  subscriptions() {
    return {
      currentTime: DataService.getCurrentTimeInMinutesStream()
    };
  },

  methods: {
    formatTimeAgo: Utils.formatTimeAgo,

    triggerAction(actionId) {
      ServerService.request("action", {
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
      const style = {
        ...this.nodeToken.style,
        "z-index": 900000 + this.nodeToken.style["z-index"]
      };
      if (this.isDungeon && this.nodeToken.isInVisionRange) {
        style["z-index"] += 300000;
      }
      return style;
    },

    nodeTokenStyle() {
      const style = {
        ...this.nodeToken.style
      };
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
      return [
        {
          nearby: this.nodeToken.isInVisionRange,
          current: this.nodeToken.currentLocation,
          "very-old": this.nodeToken.veryOld
        },
        "map-mode-" + this.mapMode
      ];
    },

    structureIcons() {
      const integrity = x => (x.integrity ? x.integrity[0] : 200);
      return Object.values(
        this.nodeToken.structures
          .filter(structure => structure.complete !== false)
          .reduce((acc, structure) => {
            acc[structure.icon] = acc[structure.icon] || {
              icon: structure.icon,
              count: 0,
              integrity: [Infinity]
            };
            acc[structure.icon].count += 1;
            acc[structure.icon].integrity =
              integrity(structure) < integrity(acc[structure.icon])
                ? structure.integrity
                : acc[structure.icon].integrity;
            return acc;
          }, {})
      ).sort((a, b) => {
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
    const nodeTokenStream = Rx.Observable.combineLatest(
      this.stream("nodeId").switchMap(nodeId =>
        MapService.getNodeStream(nodeId)
      ),
      this.stream("box")
    ).map(([nodeToken, box]) => {
      return {
        ...nodeToken,
        style: {
          left: nodeToken.x - box.left + "px",
          top: nodeToken.y - box.top + "px",
          "z-index": 9000 + nodeToken.y
        }
      };
    });

    return {
      travelMode: ServerService.getTravelModeStream(),
      isDungeon: ServerService.getIsDungeonStream(),
      nodeToken: nodeTokenStream,
      hasEnemies: nodeTokenStream.map(nodeToken =>
        nodeToken.creatures.some(c => c.hostile && !c.dead)
      ),
      hasUnknowns: nodeTokenStream.map(nodeToken =>
        nodeToken.creatures.some(c => !c.hostile && !c.friendly && !c.dead)
      ),
      hasFriends: nodeTokenStream.map(nodeToken =>
        nodeToken.creatures.some(
          c => c.friendly && !c.dead && !c.self && c.relationship === "friend"
        )
      ),
      hasNeutrals: nodeTokenStream.map(nodeToken =>
        nodeToken.creatures.some(
          c => c.friendly && !c.dead && !c.self && !c.relationship
        )
      ),
      hasRivals: nodeTokenStream.map(nodeToken =>
        nodeToken.creatures.some(
          c => c.friendly && !c.dead && !c.self && c.relationship === "rival"
        )
      ),
      mapMode: ContentFrameService.getMapModeStream(),
      currentZLevel: MapService.getCurrentZLevelStream()
    };
  },

  methods: {
    onClick() {
      if (this.interactable && this.clickable) {
        if (this.travelMode) {
          ServerService.triggerTravelStream(this.nodeToken.id);
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
      const visible =
        visibleBox.top < posY &&
        visibleBox.bottom > posY &&
        visibleBox.left < posX &&
        visibleBox.right > posX;
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

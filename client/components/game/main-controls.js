import "../generic/tabs.js";
import "./current-action.js";
import "./dungeon-controls.js";
import "./travel-controls.js";
import "./frames/auto-trade.js";
import "./frames/inventory-on-the-ground.js";
import "./frames/player-effects.js";
import "./frames/player-effects-summary.js";
import "./frames/player-inventory.js";
import "./frames/player-equipment.js";
import "./frames/player-stats.js";
import "./frames/player-trades.js";
import "./frames/player-quests.js";
import "./frames/house-decorations.js";
import "./frames/recipes-structures.js";
import "./frames/recipes-crafting.js";
import "./frames/research.js";
import "./frames/settings.js";
import "./frames/storage-inventory.js";
import "./frames/relationships.js";
import "./tool-selector.js";
import { ServerService } from "../../services/server.js";
import { ContentFrameService } from "../../services/content-frame.js";
import { MapService } from "../../services/map.js";
import { TradingService } from "../../services/trading.js";
import { DataService } from "../../services/data.js";

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
    const activeTradesStream = DataService.getPlayerInfoStream().map(
      playerInfo => playerInfo.unacceptedTradesCount
    );
    const newListingsCountStream = TradingService.getNewListingsStream().map(
      listingsByCreature =>
        Object.values(listingsByCreature).reduce(
          (acc, item) => acc + Object.values(item).length,
          0
        )
    );

    return {
      reset: ServerService.getResetStream().do(() => {
        this.triggerShowNodeDetails(true);
      }),
      isDungeon: ServerService.getIsDungeonStream(),
      travelMode: ServerService.getTravelModeStream(),
      playerInfo: DataService.getPlayerInfoStream(),
      tutorialArea: DataService.getIsTutorialAreaStream(),
      beforeOpen: ContentFrameService.getBeforeOpenStream().do(() =>
        this.closeAll()
      ),
      showNodeDetails: ContentFrameService.getShowNodeDetailsStream().do(() => {
        if (!this.showNodeDetails) {
          ContentFrameService.triggerBeforeOpenStream();
        }
        this.openPanelTab("nodePanel");
        this.showNodeDetails = true;
      }),
      mapMode: ContentFrameService.getMapModeStream(),
      node: ServerService.getNodeStream(),
      hostilesPresent: ServerService.getNodeStream().map(node =>
        (node.creatures || []).some(c => c.hostile && !c.dead)
      ),
      selectedNode: ContentFrameService.getSelectedNodeStream(),
      currentZLevel: MapService.getCurrentZLevelStream(),
      availableZLevels: MapService.getAvailableZLevelsStream(),
      activeTrades: activeTradesStream,
      newListingsCount: newListingsCountStream,
      extraComponents: ServerService.getDataStream("extraComponents")
        .switchMap(extraComponents => {
          return Rx.Observable.combineLatest(
            extraComponents.map(extraComponent =>
              Rx.Observable.fromPromise(
                ServerService.loadDynamicComponent(extraComponent)
              )
            )
          );
        })
        .startWith([]),
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
      ServerService.toggleTravelMode(!this.travelMode);
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
      localStorage.setItem(
        `tabsAutoOpen.node-frame`,
        `undefined__${this.mapMode}`
      );
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
      MapService.changeZLevel(by);
    },

    goToFighting() {
      ServerService.toggleTravelMode(false);
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
        ServerService.selectLiveUpdateNodeId(this.selectedNode.id, force);
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

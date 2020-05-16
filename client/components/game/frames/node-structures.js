import { ServerService } from "../../../services/server.js";
import { Utils } from "../../generic/utils.js";
import { ContentFrameService } from "../../../services/content-frame.js";
import { DataService } from "../../../services/data.js";
import "../list-occupants.js";

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
    linebreaks: Utils.linebreaks,

    saveStructureText() {
      ServerService.request("writeOnStructure", {
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
      return (
        Array.isArray(values) && values.map(value => `${value}%`).join(" ~ ")
      );
    }
  },

  subscriptions() {
    return {
      currentNodeId: DataService.getCurrentNodeIdStream(),
      buildingPlans: DataService.getMyBuildingPlansStream()
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
      return (
        this.showDetails && Utils.getIntegrityClass(this.showDetails.integrity)
      );
    },

    isCurrentNode() {
      return this.node && this.currentNodeId === this.node.id;
    },

    sortedStructures() {
      return [...(this.node.structures || [])].sort((a, b) => {
        if (a.complete !== b.complete) {
          return a.complete ? -1 : 1;
        }
        const integrity = x => (x.integrity ? x.integrity[0] : 50);
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

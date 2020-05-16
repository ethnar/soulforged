import { Utils } from "../../generic/utils.js";
import "../list-occupants.js";

Vue.component("node-resources", {
  props: {
    node: null
  },

  data: () => ({
    RESOURCE_SIZES,
    showDetailsId: null
  }),

  methods: {
    ucfirst: Utils.ucfirst
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

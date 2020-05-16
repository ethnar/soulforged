import { ServerService } from "../../../services/server.js";
import "../recipe-details.js";
import { DataService } from "../../../services/data.js";

Vue.component("recipes-structures", {
  data: () => ({
    selectedCraftingRecipe: null,
    filterFn: () => true
  }),

  subscriptions() {
    return {
      buildingPlans: DataService.getMyBuildingPlansStream()
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

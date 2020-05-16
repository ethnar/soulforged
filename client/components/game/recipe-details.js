import { Utils } from "../generic/utils.js";
import { ServerService } from "../../services/server.js";

Vue.component("recipe-details", {
  props: ["recipe"],

  methods: {
    ucfirst: Utils.ucfirst,

    placements(array) {
      return Object.keys(array.reduce((acc, i) => ({ ...acc, [i]: true }), {}));
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
      }).switchMap(({ buildingCode, buildingId }) =>
        Rx.Observable.fromPromise(
          ServerService.getInfo("structureDescription", {
            buildingCode,
            buildingId
          })
        )
      )
    };
  },

  template: `
<div class="html structure-description" v-if="description">
    <div v-html="description"></div>
    <hr/>
</div>
    `
});

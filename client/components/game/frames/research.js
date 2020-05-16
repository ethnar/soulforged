import { ServerService } from "../../../services/server.js";
import { Utils } from "../../generic/utils.js";
import { DataService } from "../../../services/data.js";
import { ToastNotification } from "../../generic/toast-notification.js";

Vue.component("research", {
  data: () => ({
    selectResearchMaterialIdx: null,
    researchMatsSlots: [],
    toolBorder: Utils.equipmentSlotBorder("Tool"),
    showKnownItems: false,
    exportTextAreaText: "",
    selectItemFilter: ""
  }),

  subscriptions() {
    return {
      // knownItems: this.stream('showKnownItems')
      //     .switchMap(shown => shown ? DataService.getKnownItemsStream() : Rx.Observable.of(null)),
      tutorialArea: DataService.getIsTutorialAreaStream(),
      knownItems: DataService.getKnownItemsStream().map(items =>
        Object.values(
          items
            .filter(item => item.tradeId && item.tradeId !== "null")
            .reduce((acc, i) => {
              acc[i.itemCode] = i;
              return acc;
            }, {})
        ).sort(Utils.itemsSorter)
      ),
      researchMaterials: DataService.getResearchMaterialsStream().do(
        researchMaterials => {
          this.updateDisplayedMats(researchMaterials);
        }
      ),
      recentResearches: DataService.getRecentResearchesStream(),
      myCreature: DataService.getMyCreatureStream(),
      availableItems: DataService.getAvailableItemsStream().startWith([])
    };
  },

  computed: {
    availableResearchMaterials() {
      const mats = {};
      this.availableItems.forEach(item => {
        if (mats[item.itemCode]) {
          mats[item.itemCode].qty += item.qty;
        } else {
          mats[item.itemCode] = {
            ...item,
            integrity: 100
          };
        }
      });
      return Object.values(mats).sort(Utils.itemsSorter);
    },

    getNextItemIdx() {
      const nullItem = this.researchMatsSlots.findIndex(m => !m.item);
      return nullItem !== -1 ? nullItem : this.researchMatsSlots.length;
    }
  },

  methods: {
    clear() {
      ServerService.request("updateResearchMaterials", []);
    },

    hasInsights(attempt) {
      return (
        attempt.insights &&
        (attempt.insights.somethingIsMissing ||
          attempt.insights.requiredSkillNotMet ||
          attempt.insights.wrongTool ||
          attempt.insights.unnecessaryTool ||
          attempt.insights.missingBuilding ||
          attempt.insights.allNeededItemsWereThere ||
          attempt.insights.atLeastOneItemMatches ||
          attempt.insights.somethingIsNotAvailable)
      );
    },

    updateDisplayedMats(researchMaterials) {
      const mats = Array.apply(null, Array(5)).map(() => ({
        item: null,
        qty: 1
      }));
      Object.keys(researchMaterials).forEach(
        material => (mats[material] = researchMaterials[material])
      );
      this.researchMatsSlots = mats;
    },

    updateResearchMats() {
      const payload = this.researchMatsSlots
        .filter(mats => mats.item)
        .map(mats => mats.item.itemCode);

      ServerService.request("updateResearchMaterials", payload);
    },

    selectResearchMaterial(item) {
      if (item === null) {
        this.researchMatsSlots[this.selectResearchMaterialIdx] = {
          item: null,
          qty: 1
        };
      } else {
        if (
          Object.values(this.researchMatsSlots).every(
            mats => !mats.item || mats.item.itemCode !== item.itemCode
          )
        ) {
          this.researchMatsSlots[this.selectResearchMaterialIdx] =
            this.researchMatsSlots[this.selectResearchMaterialIdx] || {};
          this.researchMatsSlots[this.selectResearchMaterialIdx].item = item;
        }
      }
      this.selectResearchMaterialIdx = null;
      this.updateResearchMats();
    },

    clickedRecentResearch(event) {
      try {
        event.target
          .closest(".list-item-with-props")
          .querySelector(".help-icon").__vue__.open = true;
      } catch (e) {}
    },

    getAttemptIcon(attempt) {
      if (attempt.result) {
        return attempt.result.icon;
      }
      if (!this.hasInsights(attempt)) {
        return "images/ui/checkbox_01.png";
      }
      if (attempt.insights.requiredSkillNotMet) {
        return "images/ui/checkbox_02_green.png";
      }
      if (
        !attempt.insights.somethingIsMissing &&
        !attempt.insights.requiredSkillNotMet &&
        !attempt.insights.wrongTool &&
        !attempt.insights.unnecessaryTool &&
        !attempt.insights.missingBuilding &&
        !attempt.insights.allNeededItemsWereThere &&
        attempt.insights.somethingIsNotAvailable
      ) {
        return "images/ui/checkbox_02_blue.png";
      }
      return "images/ui/checkbox_02.png";
    },

    exportList() {
      const text = this.knownItems.map(item => item.name).join(", ");
      try {
        if (window.clipboardData) {
          window.clipboardData.setData("Text", text);
        } else {
          unsafeWindow.netscape.security.PrivilegeManager.enablePrivilege(
            "UniversalXPConnect"
          );
          const clipboardHelper = Components.classes[
            "@mozilla.org/widget/clipboardhelper;1"
          ].getService(Components.interfaces.nsIClipboardHelper);
          clipboardHelper.copyString(text);
        }
      } catch (e) {
        this.exportTextAreaText = text;

        this.$refs.exportTextarea.value = text;
        this.$refs.exportTextarea.select();
        this.$refs.exportTextarea.setSelectionRange(0, 99999);

        document.execCommand("copy");

        ToastNotification.notify("Copied to clipboard");
      }
    }
  },

  template: `
<div>
    <div>
        <modal v-if="selectResearchMaterialIdx !== null" @close="selectResearchMaterialIdx = null" class="select-materials">
            <template slot="header">
                Select material
            </template>
            <template slot="main">
                <input class="filter-input" v-model="selectItemFilter" placeholder="Start typing to filter..." />
                <div class="item-list">
                    <div class="utility-button-item" v-if="!selectItemFilter">
                        <item-icon
                            @click="selectResearchMaterial(null)"
                            src="images/ui/checkbox_01.png"
                        />
                    </div>
                    <item-icon
                        v-for="item in availableResearchMaterials"
                        v-if="item.name.toLowerCase().includes(selectItemFilter.toLowerCase())"
                        :class="{ disabled: item.nonResearchable || item.deadEnd }"
                        :key="item.itemCode"
                        :name="item.name"
                        @click="selectResearchMaterial(item)"
                        :src="item.icon"
                        :qty="item.qty"
                    />
                </div>
            </template>
        </modal>
    </div>
    <section class="relative">
        <header>
            Research
            <help-icon title="Research">
                You can discover new crafting recipes and constructions. Select one or multiple different items and start the research. Once finished you will see whether the selected items are right, if something is missing or something is unnecessary.
            </help-icon>
        </header>
        <div
            v-if="researchMatsSlots && researchMatsSlots[0] && researchMatsSlots[0].item"
            @click="clear();"
            class="button small clear-materials"
        >
            Clear
        </div>
        <div class="research-selection">
            <div class="tool-selector-section">
                <span class="help-text">Tool</span>
                <tool-selector />
            </div>
            <div class="research-materials">
                <span class="help-text">Materials</span>
                <div class="research-mats-list">
                    <div v-for="(material, idx) in researchMatsSlots" v-if="material" class="research-material interactable" @click="selectResearchMaterialIdx = idx;">
                        <item-icon v-if="material.item" :name="material.item && material.item.name" :src="material.item && material.item.icon"></item-icon>
                    </div>
                    <div @click="selectResearchMaterialIdx = getNextItemIdx" class="research-material interactable utility-button-item" v-if="getNextItemIdx < 10">
                        <item-icon src="images/ui/plus_01_org_small_dark.png"></item-icon>
                    </div>
                </div>
            </div>
        </div>
        <actions
            class="centered"
            :target="myCreature"
            id="Research" 
        />
    </section>
    <section v-if="recentResearches">
        <header class="subheader">Recent researches</header>
        <div v-if="!recentResearches.length" class="empty-list"></div>
        <div v-for="attempt in recentResearches" class="list-item-with-props" @click="clickedRecentResearch($event)" :class="{ interactable: !attempt.result }">
            <div class="main-icon">
                <item-icon :src="getAttemptIcon(attempt)"/>
            </div>
            <div class="details">
                <div v-if="attempt.result" class="label">
                    New recipe: {{attempt.result.name}}!
                </div>
                <div v-else class="label">
                    <!--{{attempt.insights}}-->
                    <template v-if="attempt.insights && attempt.insights.requiredSkillNotMet">                        
                        <div class="text">
                            <div class="difficulty-indicator" v-html="attempt.insights.requiredSkillNotMet"></div>
                        </div>
                        <help-icon title="Research result">
                            The recipe is correct, but the skill related to the target recipe is too low to guarantee success. Retrying the research a few times may result in a discovery.<br/>
                            The skill on which this recipe depends is listed in parentheses.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.wrongTool">
                        <div class="text">A different tool is needed</div>
                        <help-icon title="Research result">
                            The recipe is correct, but the tool used doesn't have the required utility.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.unnecessaryTool">
                        <div class="text">No tool is needed</div>
                        <help-icon title="Research result">
                            The recipe is correct, but it doesn't require a tool. Trying again without any tool equipped leads to a discovery.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.missingBuilding">
                        <div class="text">Specific building is needed</div>
                        <help-icon title="Research result">
                            The recipe is correct, including the tool, but there is also a building requirement for this recipe. Only buildings that are present in the location you're in while researching are considered.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.allNeededItemsWereThere">
                        <div class="text">Includes surplus items</div>
                        <help-icon title="Research result">
                            A subset of the materials you used leads to a discovery. This means that one or more materials are unnecessary.<br/>
                            Once you find the materials combination you may then need to adjust the tool used for research.  
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.somethingIsMissing">
                        <div class="text">Something is missing</div>
                        <help-icon title="Research result">
                            This combination of materials, along with one or more additional materials will lead to a discovery.<br/>
                            Once you find the materials combination you may then need to adjust the tool used for research.  
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.somethingIsNotAvailable">
                        <div class="text">Something new is needed</div>
                        <help-icon title="Research result">
                            This combination of materials, along with one or more additional materials will lead to a discovery. However, it seems your character has never seen at least one of those additional materials required.
                        </help-icon>
                    </template>
                    <template v-else-if="attempt.insights && attempt.insights.atLeastOneItemMatches">
                        <div class="text">Doesn't work</div>
                        <help-icon title="Research result">
                            This combination of materials is not correct, but one or more of the materials used in this attempt will still lead to new discoveries.
                        </help-icon>
                    </template>
                    <template v-else>
                        <div class="text">That's a dead end</div>
                        <help-icon title="Research result">
                            All of the materials used in this research are no longer leading to any discoverable technology. It's still possible that those materials have other uses you may discover by other means than research.
                        </help-icon>
                    </template>
                </div>
                <div class="item-list">
                    <item-icon :src="attempt.toolUsed ? attempt.toolUsed.icon : null" size="tiny" :border="toolBorder"></item-icon>
                    <item-icon v-for="material in attempt.materialsUsed" :key="material.item.name" :name="material.item && material.item.name" :src="material.item.icon" size="tiny"></item-icon>
                </div>
                <div v-if="attempt.insights && attempt.insights.theresMore" class="help-text">There are more recipes to be found with this tool and materials.</div>
            </div>
        </div>
    </section>
    <section v-if="knownItems && knownItems.length && !tutorialArea">
        <header>Other information</header>
        <div class="centered">
            <button @click="showKnownItems = true;">Known items</button>
        </div>
    </section>
    <modal v-if="knownItems && showKnownItems" @close="showKnownItems = false; exportTextAreaText = null;">
        <div slot="header">
            Known items
        </div>
        <div slot="main">
            <textarea class="export-window" ref="exportTextarea" :class="{hidden: !exportTextAreaText}">{{exportTextAreaText}}</textarea>
            <div v-if="!exportTextAreaText" class="item-list">
                <button @click="exportList()">Export</button>
                <div class="item-list">
                    <item v-for="item in knownItems" :key="item.itemCode" :data="item" />
                </div>
            </div>
        </div>
    </modal>
</div>
    `
});

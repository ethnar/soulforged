import { ServerService } from "../../services/server.js";
import { Utils } from "../generic/utils.js";
import { DataService } from "../../services/data.js";
import "./toggle-filter-button.js";

const weaponSkillLevelLabels = {
  0: "None",
  1: "Negligible",
  2: "Very Low",
  3: "Low",
  4: "Moderate",
  5: "High",
  6: "Very High",
  7: "Tremendous",
  8: "Massive",
  9: "Gigantic",
  10: "Extreme"
};

Vue.component("buff-value", {
  props: {
    buff: Object
  },

  computed: {
    rawNumberValue() {
      let result;
      if (this.buff && typeof this.buff === "object") {
        result = this.buff.value;
      } else {
        result = this.buff;
      }
      return Utils.decimalTwo(result);
    },
    displayValue() {
      return Utils.formatEffectValue(this.buff, this.rawNumberValue);
    },
    isPositive() {
      let check = this.rawNumberValue;
      if (this.buff.multiplier) {
        check -= 100;
      }
      if (this.buff.negative) {
        return check < 0;
      }
      return check > 0;
    },
    isNegative() {
      let check = this.rawNumberValue;
      if (this.buff.multiplier) {
        check -= 100;
      }
      if (this.buff.negative) {
        return check > 0;
      }
      return check < 0;
    }
  },

  template: `
<span :class="{ positive: isPositive, negative: isNegative }" v-if="!buff.discrete">{{displayValue}}</span>
`
});

Vue.component("item-icon", {
  props: {
    src: String,
    name: {
      type: String
    },
    qty: {
      default: 1
    },
    level: {
      type: Number
    },
    integrity: {
      default: 100
    },
    integrityType: "",
    size: {
      type: String,
      default: "normal"
    },
    trinket: {
      type: Array,
      default: null
    },
    details: {
      type: Object,
      default: null
    },
    border: {
      default: 1
    },
    alwaysShowQty: {}
  },

  data: () => ({
    showDialog: false
  }),

  computed: {
    stringQty() {
      return typeof this.qty === "string";
    },
    isSplitQty() {
      return typeof this.qty === "string" && this.qty.includes("/");
    },
    splitQty() {
      return this.qty.split("/").map(v => +v);
    },

    detailsTransformed() {
      const result = this.details;
      if (
        this.details &&
        this.details.weight &&
        typeof this.details.weight === "number"
      ) {
        result.weight = {
          single: this.details.weight,
          total: this.qty * this.details.weight
        };
      }
      return result;
    },

    finalIntegrityClass() {
      return Utils.getIntegrityClass(this.integrity);
    },

    trinketProps() {
      if (!this.trinket && this.name) {
        if (this.name.indexOf("Research Concept") >= 0) {
          return [
            {
              stat: this.name.replace(/.*Research Concept: /, "")
            }
          ];
        }
        return null;
      }
      return this.trinket;
    },

    adjustedQty() {
      return Utils.formatNumber(Math.round(this.qty));
    },

    borderClass() {
      return `border-${this.border}`;
    }
  },

  methods: {
    onClick($event) {
      if (this.details) {
        this.showDialog = true;
      } else {
        this.$emit("click", $event);
      }
    }
  },

  template: `
<div>
    <div class="item-icon" :class="[ name, { interactable: $listeners.click || details }, size, borderClass ]">
        <div class="border"></div>
        <div class="slot" @click="onClick">
            <div class="img-bg"></div>
            <div class="img" :style="src && { 'background-image': 'url(' + src + ')' }"></div>
            <span class="qty" :class="{ limit: splitQty[0] > splitQty[1] }" v-if="isSplitQty">{{splitQty[0]}} <span class="secondary">/ {{splitQty[1]}}</span></span>
            <span class="qty" v-else-if="stringQty">{{qty}}</span>
            <span class="qty" v-else-if="alwaysShowQty || (qty && qty > 1) || qty === 0">{{adjustedQty}}</span>
            <span class="level" v-if="level && size !== 'tiny'">{{level}}%</span>
            <span class="integrity" v-if="finalIntegrityClass" :class="[finalIntegrityClass, integrityType]"></span>
            <span class="trinket" v-if="trinketProps">
                <div v-for="buff in trinketProps" class="trinket-props">
                    <div class="skill">{{buff.stat}}</div> <div class="value">{{buff.value}}</div>
                </div>
            </span>
        </div>
    </div>
    <modal v-if="details && showDialog" @close="showDialog = false;" class="item-modal">
        <template slot="header">{{details.name}} <span v-if="details.qty">({{details.qty}})</span></template>
        <template slot="main">
            <item-properties :data="detailsTransformed"></item-properties>
        </template>
    </modal>
</div>
    `
});

Vue.component("item-properties", {
  props: ["data"],

  data: () => ({
    weaponSkillLevelLabels
  }),

  computed: {
    properties() {
      return (this.data && this.data.properties) || {};
    },
    utility() {
      return this.properties.utility;
    },
    utilityDescription() {
      return Object.keys(this.utility).map(
        tool =>
          `${tool[0].toUpperCase()}${tool.slice(1)} (${Utils.decimalTwo(
            100 * this.utility[tool]
          )}% action speed)`
      );
    },
    damage() {
      return (
        (this.properties && this.properties.damage) ||
        (this.data && this.data.damage)
      );
    },
    armor() {
      return this.properties && this.properties.armor;
    },
    hitChance() {
      return (
        (this.properties && this.properties.hitChance) ||
        (this.data && this.data.hitChance)
      );
    },
    buffs() {
      if (!this.data || !this.data.buffs) {
        return null;
      }
      return Object.values(this.data.buffs).map(item => ({
        ...item,
        stat: Utils.ucfirst(item.stat)
      }));
    },
    expiresInFormatted() {
      if (!this.data.expiresIn) {
        return undefined;
      }
      if (this.data.expiresIn.length <= 1) {
        return null;
      }
      if (this.data.expiresIn[0] === 0) {
        return `Less than ${Utils.formatTime(this.data.expiresIn[1] * 60, 2)}`;
      }
      return this.data.expiresIn
        .map(minutes => Utils.formatTime(minutes * 60, 2))
        .join(" ~ ");
    },
    integrityDisplay() {
      return (
        this.data.integrity &&
        Array.isArray(this.data.integrity) &&
        this.data.integrity.map(value => `${value}%`).join(" ~ ")
      );
    },
    finalIntegrityClass() {
      return Utils.getIntegrityClass(this.data.integrity);
    }
  },

  methods: {
    formatTime: Utils.formatTime,

    diminishingReturnDisplay: diminishingReturns => {
      if (!diminishingReturns) {
        return "";
      }
      let result = diminishingReturns[0] * 100 + "%";
      if (diminishingReturns[0] !== diminishingReturns[1]) {
        result += " - " + diminishingReturns[1] * 100 + "%";
      }
      return result;
    }
  },

  template: `
<div class="item-properties html">
    <div v-if="integrityDisplay === '0%'">
        <span class="property no-colon red">Unusable</span>
    </div>
    <div v-if="data.integrity">
        <span class="property">{{'Condition'}}</span>
        <span class="value">
            {{integrityDisplay}}
        </span>
        <span class="integrity-icon" :class="[finalIntegrityClass, data.integrityType ]"></span>
    </div>
    <div v-if="expiresInFormatted">
        <span class="property">Expires in</span>
        <span class="value" v-if="expiresInFormatted">
            {{expiresInFormatted}}
        </span>
    </div>
    <div v-if="data && data.weight">
        <span class="property">Weight</span>
        <span class="value">
            {{data.weight.single}}kg <span v-if="data.weight.total">({{Math.round(+data.weight.total * 100) / 100}}kg)</span>
        </span>
    </div>
    <div v-if="data && data.container">
        <span class="property">Container</span>
        <span class="value">
            {{data.container}}
        </span>
    </div>
    <div v-if="properties.nutrition">
        <span class="property">Nutrition</span><span class="value">{{properties.nutrition}}</span>
    </div>
    <div v-if="buffs && buffs.length">
        <span class="property">Effects</span>
        <div v-for="buff in buffs" v-if="buff && buff.value">
            <div v-if="typeof buff.value === 'number'" class="value">
                {{buff.stat}}<span v-if="!buff.discrete">:</span> <buff-value :buff="buff" /> <span v-if="buff.duration">({{formatTime(buff.duration)}})</span>
            </div>
            <div v-else-if="typeof buff.value === 'boolean' && buff.value" class="value">
                {{buff.stat}} ({{formatTime(buff.duration)}})
            </div>
        </div>
        <div v-if="data.properties.diminishingReturn || data.properties.diminishingReturn === 0">Stacking coefficient: <span class="value">{{diminishingReturnDisplay(data.properties.diminishingReturn)}}</span></div>
    </div>
    <div v-if="damage">
        <div>
            <span class="property">Skill</span><span class="value">{{properties.weaponSkill}}</span>
        </div>
        <div>
            <span class="property">Hit chance</span><span class="value">{{hitChance}}%</span>
        </div>
        <div class="property">Damage</div>
        <div class="value" v-for="(value, type) in damage">
            {{type}}: <decimal-secondary :value="value" /></span>
        </div>
        <div>
            <span class="property">Skill impact</span><span class="value">{{weaponSkillLevelLabels[properties.weaponSkillLevel]}}</span>
        </div>
    </div>
    <div v-if="utility" class="clear-both">
        <span class="property">Tool</span>
        <div class="value" v-for="util in utilityDescription">
            {{util}}
        </div>
    </div>
</div>
    `
});

Vue.component("item", {
  props: {
    data: {},
    small: {
      default: false
    },
    interactable: {
      default: true
    },
    border: {}
  },

  data: () => ({
    showDialog: false
  }),

  subscriptions() {
    return {
      crafting: this.stream("showDialog")
        .switchMap(showDialog =>
          showDialog
            ? Rx.Observable.combineLatest(
                this.$watchAsObservable("data", { immediate: true }).pluck(
                  "newValue"
                ),
                DataService.getMyRecipesStream()
              )
            : Rx.Observable.empty()
        )
        .map(([item, recipes]) =>
          recipes.filter(recipe => {
            return (
              recipe &&
              recipe.materials.some(material => {
                return (
                  item &&
                  material.item &&
                  material.item.itemCode === item.itemCode
                );
              })
            );
          })
        )
    };
  },

  methods: {
    onClick(event) {
      if (this.interactable) {
        this.showDialog = true;
      } else {
        this.$emit("click", event);
      }
    }
  },

  computed: {
    trinketInfo() {
      if (this.data && this.data.houseDecoration) {
        return this.data.buffs;
      }
    }
  },

  template: `
<div>
    <item-icon
        :src="data && data.icon"
        :qty="data && data.qty"
        :integrity="data && data.integrity"
        :integrity-type="data.integrityType"
        :small="small"
        :trinket="trinketInfo"
        :border="border"
        :name="data && data.name"
        @click="onClick"
    ></item-icon>
    <modal v-if="data && showDialog" @close="showDialog = false;" class="item-modal">
        <template slot="header"><entity-name :entity="data" :editable="true" /> <span v-if="data.qty">({{data.qty}})</span></template>
        <template slot="main">
            <div class="main-icon">
                <item-icon :src="data && data.icon" />
            </div>
            <item-properties :data="data"></item-properties>
            <div v-if="crafting && crafting.length">
                Craft:
                <div class="item-craft-recipes">
                    <div v-for="recipe in crafting" class="item-craft-recipe">
                        <actions
                            :target="recipe"
                            id="Craft"
                            @action="showDialog = false;" 
                        >
                            <template slot="Craft">
                                <item-icon :src="recipe.icon" :name="recipe.name"></item-icon>
                            </template>
                        </actions>
                    </div>
                </div>
            </div>
            <actions
                class="actions"
                :target="data"
                :icon="true"
                @action="showDialog = false"
            />
        </template>
    </modal>
</div>
    `
});

Vue.component("inventory", {
  props: ["data", "slots", "type", "filter"],

  data: () => ({
    nameFilter: ""
  }),

  subscriptions() {
    return {
      borders: this.stream("type")
        .switchMap(type =>
          type === "player"
            ? DataService.getMyEquipmentStream()
            : DataService.getMyFurnitureStream()
        )
        .map(items => {
          if (!items) {
            return {};
          }
          const temp = {};
          const result = {};
          items.forEach(slot => {
            if (slot.item) {
              temp[slot.item.id] = temp[slot.item.id] || {};
              const value = Utils.equipmentSlotBorder(
                slot.slot || slot.slotType
              );
              value.split(" ").forEach(i => {
                temp[slot.item.id][i] = true;
              });
              result[slot.item.id] = Object.keys(temp[slot.item.id]).join(" ");
            }
          });
          return result;
        })
    };
  },

  computed: {
    sorted() {
      return this.data.slice(0).sort(Utils.itemsSorter);
    }
  },

  methods: {
    filtered(item) {
      return !this.filter || this.filter(item);
    }
  },

  template: `
<div>
    <div class="item-list" v-if="data">
        <item
            v-for="(item, idx) in sorted"
            :data="item"
            :key="'i' + item.id"
            :border="borders && borders[item.id]"
            v-if="filtered(item)"
        />
<!--
    <div v-for="(item, idx) in sorted">
        <div style="display: flex;">
            <item :data="item" :key="'i' + item.id" :border="borders && borders[item.id]" v-if="filtered(item)"></item>
            {{item.name}}
        </div>
    </div>
-->
    </div>
</div>
    `
});

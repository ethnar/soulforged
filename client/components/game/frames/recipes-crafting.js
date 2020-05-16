import { ServerService } from "../../../services/server.js";
import { DataService } from "../../../services/data.js";
import "../recipe-details.js";
import "../../generic/staggered-show.js";

const recipeDifficulty = recipe => {
  const action = recipe.actions.find(a => a.id === "Craft");
  const chance =
    action && action.difficulty && action.difficulty.match(/[0-9]+/);
  return (chance && chance[0]) || Infinity;
};

const EMPTY_LABEL = "[Any]";
const CURRENT_TOOL_LABEL = "[Current tool]";
Vue.component("recipe-filter", {
  props: {
    skillsPool: null,
    sortingPools: null,
    itemPurposesPool: null,
    toolsPool: null,
    craftingFilter: false
  },

  data: () => ({
    textFilter: "",
    haveMaterials: false,
    skillFilter: EMPTY_LABEL,
    itemPurposeFilter: EMPTY_LABEL,
    toolFilter: EMPTY_LABEL,
    sortOrder: null
  }),

  watch: {
    sortingPools: {
      handler(values) {
        this.sortOrder = values && Object.keys(values).shift();
      },
      immediate: true
    },

    skillFilter(value) {
      ServerService.setSetting("skillFilter", value);
    },

    itemPurposeFilter(value) {
      ServerService.setSetting("itemPurposeFilter", value);
    }
  },

  subscriptions() {
    return {
      currentToolUtilities: DataService.getMyEquipmentStream().map(
        equipment => {
          const slot = equipment.find(e => e.slot === "Tool");
          const item = slot && slot.item;
          const utilities =
            item &&
            item.properties &&
            Object.keys(item.properties.utility || {});
          return utilities || [];
        }
      ),
      settings: ServerService.getSettingsStream()
        .first()
        .do(
          ({
            craftTextFilter,
            buildTextFilter,
            skillFilter,
            itemPurposeFilter
          }) => {
            if (this.craftingFilter) {
              this.textFilter = craftTextFilter || "";
            } else {
              this.textFilter = buildTextFilter || "";
            }
            if (this.skillsPool && skillFilter) {
              this.skillFilter = skillFilter;
            }
            if (this.itemPurposesPool && itemPurposeFilter) {
              this.itemPurposeFilter = itemPurposeFilter;
            }
            this.emit();
          }
        )
    };
  },

  methods: {
    ucfirst: Utils.ucfirst,

    setToolFilter(filter) {
      this.toolFilter = filter;
      this.emit();
    },

    emitSort() {
      this.$emit("sort", this.sortOrder);
    },

    emit() {
      const filters = [];
      const textFilter = this.textFilter.toLowerCase();
      if (this.craftingFilter) {
        ServerService.setSetting("craftTextFilter", textFilter);
      } else {
        ServerService.setSetting("buildTextFilter", textFilter);
      }
      if (this.textFilter) {
        filters.push(recipe => {
          return recipe.name.toLowerCase().includes(textFilter.toLowerCase());
        });
      }

      if (this.haveMaterials) {
        filters.push(recipe => {
          return recipe.actions.some(
            a =>
              (a.id === "Craft" || a.id === "Erect & Construct") &&
              (a.message === true || a.message.includes("You need a "))
          );
        });
      }

      if (this.skillFilter !== EMPTY_LABEL) {
        filters.push(recipe => recipe.skill === this.skillFilter);
      }

      if (this.itemPurposeFilter !== EMPTY_LABEL) {
        filters.push(recipe =>
          recipe.result.itemPurposes.includes(this.itemPurposeFilter)
        );
      }

      if (this.toolFilter !== EMPTY_LABEL) {
        if (this.toolFilter === CURRENT_TOOL_LABEL) {
          filters.push(recipe =>
            this.currentToolUtilities.includes(recipe.tool)
          );
        } else {
          filters.push(recipe => this.toolFilter === recipe.tool);
        }
      }

      this.$emit("tool-filter", this.toolFilter);
      this.$emit("input", recipe =>
        filters.reduce((acc, f) => acc && f(recipe), true)
      );
    }
  },

  computed: {
    skillPoolOptions() {
      return [EMPTY_LABEL, ...this.skillsPool.sort()];
    },

    itemPurposesOptions() {
      return [EMPTY_LABEL, ...this.itemPurposesPool.sort()];
    },

    toolsPoolOptions() {
      return [EMPTY_LABEL, CURRENT_TOOL_LABEL, ...this.toolsPool.sort()];
    }
  },

  template: `
<section class="recipe-filter">
    <header>Filter</header>
    <div class="filter-body">
        <div class="filter-element">
            <span class="help-text text-input-label">Name:</span> <input type="text" v-model="textFilter" @input="emit" />
        </div>
<!--        <div class="filter-element">-->
<!--            <input type="checkbox" v-model="haveMaterials" @change="emit" />-->
<!--            <span class="help-text checkbox-label">Can make</span>-->
<!--        </div>-->
        <div v-if="skillsPool" class="filter-container">
            <span class="help-text text-input-label">Skill:</span> 
            <select v-model="skillFilter" @change="emit">
                <option v-for="skill in skillPoolOptions" :value="skill">{{skill}}</option>
            </select>
        </div>
        <div v-if="itemPurposesPool" class="filter-container">
            <span class="help-text text-input-label">Type:</span> 
            <select v-model="itemPurposeFilter" @change="emit">
                <option v-for="slot in itemPurposesOptions" :value="slot">{{slot}}</option>
            </select>
        </div>
        <div v-if="sortingPools" class="filter-container">
            <span class="help-text text-input-label">Tool:</span> 
            <select v-model="toolFilter" @change="emit">
                <option v-for="tool in toolsPoolOptions" :value="tool">{{ucfirst(tool)}}</option>
            </select>
        </div>
        <div v-if="sortingPools" class="filter-container">
            <span class="help-text text-input-label">Sort:</span> 
            <select v-model="sortOrder" @change="emitSort">
                <option v-for="(sort, key) in sortingPools" :value="key">{{key}}</option>
            </select>
        </div>
    </div>
</section>
    `
});

Vue.component("recipe-row-item", {
  props: ["recipe", "index"],

  template: `
<staggered-show
    group="recipe"
    :index="index"
    bundle="1"
    delay="10"
>
    <div class="list-item-with-props" @click="$emit('click')">
        <div class="list-item-with-props interactable" >
            <div class="main-icon">
                <item-icon :src="recipe.icon" :qty="recipe.qty" :name="recipe.name"></item-icon>
            </div>
            <div class="details">
                <div class="label nowrap">
                    <div>{{recipe.name}}</div>
                </div>
                <div class="item-list">
                    <item-icon
                        v-for="material in recipe.materials"
                        :key="material.item.name"
                        :src="material.item.icon"
                        :qty="material.qty"
                        size="tiny"
                    />
                </div>
            </div>
        </div>  
        <actions
            :target="recipe"
            :text="false" 
        />  
    </div>
</staggered-show>
    `
});

Vue.component("recipes-crafting", {
  data: () => ({
    selectedCraftingRecipe: null,
    filterFn: null,
    sorterId: null
  }),

  subscriptions() {
    return {
      recipes: DataService.getMyRecipesStream().do(() => console.log("loaded")),
      sorting: DataService.getMyRecipesStream()
        .switchMap(() => ServerService.getSettingsStream())
        .first()
        .do(({ recipeSort, recipeToolFilter }) => {
          setTimeout(() => {
            this.defaultSort = recipeSort;
            this.defaultTool = recipeToolFilter;
            if (this.$refs.recipeFilter) {
              if (recipeSort) {
                this.sorterId = this.$refs.recipeFilter.sortOrder = recipeSort;
              }
              if (recipeToolFilter) {
                this.$refs.recipeFilter.setToolFilter(recipeToolFilter);
              }
            }
          });
        })
    };
  },

  mounted() {
    if (this.$refs.recipeFilter) {
      if (this.defaultSort) {
        this.sorterId = this.$refs.recipeFilter.sortOrder = this.defaultSort;
      }
      if (this.defaultTool) {
        this.$refs.recipeFilter.setToolFilter(this.defaultTool);
      }
    }
  },

  watch: {
    sorterId(value) {
      ServerService.setSetting("recipeSort", value);
    }
  },

  computed: {
    showFiltering() {
      return this.recipes && this.recipes.length > 10;
    },

    skillsPool() {
      return (
        this.recipes &&
        Object.keys(
          this.recipes
            .filter(r => !!r.skill)
            .reduce((acc, r) => ({ ...acc, [r.skill]: true }), {})
        )
      );
    },

    itemPurposesPool() {
      const options = {};
      this.recipes.forEach(r => {
        r.result.itemPurposes.forEach(purpose => {
          options[purpose] = true;
        });
      });
      return Object.keys(options);
    },

    toolsPool() {
      const options = {};
      this.recipes.forEach(r => {
        if (r.tool) {
          options[r.tool] = true;
        }
      });
      return Object.keys(options);
    },

    sortsPool() {
      return {
        "Learn order": null,
        Alphabetical: (a, b) => (a.name > b.name ? 1 : -1),
        Difficulty: (a, b) => recipeDifficulty(a) - recipeDifficulty(b)
      };
    },

    filteredSortedRecipesList() {
      if (!this.recipes || !this.filterFn) {
        return [];
      }
      const sorterFn = this.sortsPool[this.sorterId];
      const list = this.recipes.filter(r => r && this.filterFn(r));

      if (sorterFn) {
        list.sort(sorterFn);
      }
      return list;
    }
  },

  methods: {
    saveToolFilter(value) {
      ServerService.setSetting("recipeToolFilter", value);
    }
  },

  template: `
<section v-if="recipes">
    <recipe-filter
        :crafting-filter="true"
        @input="filterFn = $event"
        @sort="sorterId = $event"
        @tool-filter="saveToolFilter"
        v-show="showFiltering"
        :skills-pool="skillsPool"
        :sorting-pools="sortsPool"
        :item-purposes-pool="itemPurposesPool"
        :tools-pool="toolsPool"
        ref="recipeFilter" 
    />
    <header>Craft</header>
    <div v-if="!recipes.length" class="empty-list"></div>
    <div>
        <recipe-row-item
            v-for="(recipe, idx) in filteredSortedRecipesList"
            :key="recipe.id"
            :index="idx"
            :recipe="recipe"
            @click="selectedCraftingRecipe = recipe;"
        />
    </div>
    <recipe-details :recipe="selectedCraftingRecipe" @close="selectedCraftingRecipe = null" />
</section>
    `
});

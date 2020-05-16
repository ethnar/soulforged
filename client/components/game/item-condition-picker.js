const CONDITIONS = {
  UPTO100: [50, 100],
  UPTO50: [20, 50],
  UPTO20: [0, 20],
  UPTO0: [0]
};

Vue.component("item-condition-picker", {
  props: {
    item: null,
    value: null
  },

  data: () => ({
    CONDITIONS,
    INTEGRITY_CLASS: Object.keys(CONDITIONS).toObject(
      key => key,
      key => Utils.getIntegrityClass(CONDITIONS[key])
    )
  }),

  methods: {
    selectTargets(targets) {
      this.$emit("input", targets);
    },

    compare(v1, v2) {
      return JSON.stringify(v1) === JSON.stringify(v2);
    }
  },

  created() {
    this.$emit("input", CONDITIONS.UPTO100);
  },

  template: `
<div class="item-condition-picker">
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO100) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO100);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO100, item && item.integrityType ]"></span>
        </div>
        <div class="text">100% ~ 50%</div>
    </div>
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO50) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO50);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO50, item && item.integrityType ]"></span>
        </div>
        <div class="text">50% ~ 20%</div>
    </div>
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO20) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO20);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO20, item && item.integrityType ]"></span>
        </div>
        <div class="text">20% ~ 0%</div>
    </div>
    <div class="item" :class="{ active: compare(value, CONDITIONS.UPTO0) }">
        <div class="button action icon text" @click.prevent="selectTargets(CONDITIONS.UPTO0);">
            <span class="integrity-icon force" :class="[INTEGRITY_CLASS.UPTO0, item && item.integrityType ]"></span>
        </div>
        <div class="text">0%</div>
    </div>
</div>
    `
});

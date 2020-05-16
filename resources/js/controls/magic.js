Vue.component("backend-magic", {
  components: {
    category: window.mainControlsCategory
  },

  methods: {
    register(...args) {
      return this.$parent.register(...args);
    },
    closed(...args) {
      return this.$parent.closed(...args);
    },
    opened(...args) {
      return this.$parent.opened(...args);
    }
  },

  template: `
<category type="node" ref="nodePanel" title="Selected area">
    <tool-selector />
    <div class="content-frame">
        <tabs frame="1" placement="right">
            <tab header-class="creatures" title="Creatures">
                <player-effects />
            </tab>
        </tabs>
    </div>
</category>
    `
});

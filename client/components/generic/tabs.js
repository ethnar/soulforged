Vue.component("tab", {
  props: ["header", "headerClass", "title", "indicator"],

  data: () => ({
    visible: false
  }),

  watch: {
    indicator(newValue) {
      this.$parent.updateTab(this);
    }
  },

  mounted() {
    const nodes = [].slice
      .call(this.$el.parentNode.childNodes)
      .filter(node => node.nodeType !== node.TEXT_NODE);
    const idx = nodes.indexOf(this.$el);

    this.$parent.registerTab(
      idx,
      this.header,
      this.headerClass,
      this.setVisibility,
      this
    );
  },

  destroyed() {
    this.$parent.unregisterTab(this.header, this.headerClass);
  },

  methods: {
    setVisibility(visible) {
      this.visible = visible;
    }
  },

  template: `
<div class="tab-wrapper" v-if="visible">
    <slot name="heading"></slot>
    <div class="tab">
        <slot></slot>
    </div>
</div>
    `
});

export default Vue.component("tabs", {
  props: {
    placement: {},
    rememberId: {},
    url: {
      default: true
    }
  },

  data: () => ({
    tabs: [],
    lastTab: null
  }),

  mounted() {
    if (this.url) {
      const startingTab = this.$router.currentRoute.query.tab;
      if (startingTab) {
        const tab =
          this.tabs.find(tab => tab.header === startingTab) || this.tabs[0];
        this.setActive(tab);
      }
    }
    if (this.rememberId) {
      const startingTab = localStorage.getItem(
        `tabsAutoOpen.${this.rememberId}`
      );
      if (startingTab) {
        const tab =
          this.tabs.find(tab => tab.id === startingTab) || this.tabs[0];
        this.setActive(tab);
      }
    }
  },

  methods: {
    updateTab(compVm) {
      const tab = this.tabs.find(t => t.compVm === compVm);
      tab.indicator = compVm.indicator;
    },

    registerTab(idx, header, headerClass, setActiveCallback, compVm) {
      const title = compVm.title;
      const indicator = compVm.indicator;
      this.tabs.splice(idx, 0, {
        id: header + "__" + headerClass,
        header: header,
        headerClass: headerClass,
        callback: setActiveCallback,
        title,
        indicator,
        compVm
      });
      if (!this.lastTab) {
        this.lastTab = this.tabs[0];
        if (this.lastTab) {
          this.lastTab.callback(true);
        }
      }
    },

    unregisterTab(header, headerClass) {
      const idx = this.tabs.findIndex(
        t => t.header === header && t.headerClass === headerClass
      );

      if (idx !== -1) {
        const needToActivate = this.lastTab === this.tabs[idx];
        this.tabs.splice(idx, 1);
        if (needToActivate) {
          this.lastTab = this.tabs[0];
          if (this.lastTab) {
            this.lastTab.callback(true);
          }
        }
      }
    },

    setActive(tab) {
      this.lastTab.callback(false);
      tab.callback(true);
      this.lastTab = tab;
      if (this.rememberId) {
        localStorage.setItem(`tabsAutoOpen.${this.rememberId}`, tab.id);
      }
      if (this.url) {
        this.$router.push({ query: { tab: tab.header } });
      }
    },

    setActiveByComponent(cmp) {
      const tab = this.tabs.find(
        t => t.header === cmp.header && t.headerClass === cmp.headerClass
      );

      if (tab) {
        this.setActive(tab);
      }
    }
  },

  template: `
<div class="tabs" :class="'placement-' + placement">
    <div class="tab-headers">
        <div v-for="tab in tabs" class="tab-header" :class="[{ active: tab === lastTab}, tab.headerClass]" @click="setActive(tab);" :title="tab.title">
            {{tab.header}}
            <div class="indicator" v-if="tab.indicator">{{tab.indicator}}</div>
        </div>
    </div>
    <div class="tab-contents">
        <slot></slot>
    </div>
</div>
    `
});

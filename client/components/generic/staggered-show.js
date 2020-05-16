const showQueue = {};
let showQueueTimeout = null;
const getShowQueue = group => {
  showQueue[group] = showQueue[group] || [];
  return showQueue[group];
};
const startShowQueueTimeout = (group, delay, bundle) => {
  showQueueTimeout = setTimeout(() => {
    showQueueTimeout = null;
    if (getShowQueue(group).length) {
      let item;
      for (let i = 0; i < bundle; i++) {
        item = getShowQueue(group).shift();
        if (!item) {
          break;
        }
        item.show();
      }
      startShowQueueTimeout(group, delay, bundle);
    }
  }, delay);
};
const queueShowRecipe = (
  group,
  component,
  index = 0,
  delay = 50,
  bundle = 1
) => {
  if (index > getShowQueue(group).length) {
    index = getShowQueue(group).length;
  }
  getShowQueue(group).splice(index, 0, component);
  if (!showQueueTimeout) {
    startShowQueueTimeout(group, delay, bundle);
  }
};
const unqueueShowRecipe = (group, component) => {
  showQueue[group] = showQueue[group] || [];
  showQueue[group] = getShowQueue(group).filter(c => c !== component);
};
Vue.component("staggered-show", {
  props: ["index", "group", "delay", "forceShow", "bundle"],

  data: () => ({
    shown: false
  }),

  created() {
    if (this.forceShow) {
      this.shown = true;
    } else {
      queueShowRecipe(this.group, this, this.index, this.delay, this.bundle);
    }
  },

  destroyed() {
    if (!this.shown) {
      unqueueShowRecipe(this.group, this);
    }
  },

  methods: {
    show() {
      this.shown = true;
    }
  },

  template: `
<transition name="fade">
    <div v-if="shown">
        <slot />    
    </div>
</transition>
  `
});

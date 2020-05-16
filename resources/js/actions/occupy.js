Vue.component("backend-occupy", {
  props: {
    actionTarget: null,
    action: null
  },

  data: () => ({
    translated: false,
    allowLevel: 0
  }),

  subscriptions() {
    return {};
  },

  methods: {
    confirm() {
      ServerService.request("action", {
        action: "Occupy",
        target: this.actionTarget.id,
        extra: this.allowLevel
      });
      this.$emit("close");
    },

    setLevel(level) {
      this.allowLevel = level;
    }
  },

  computed: {},

  created() {
    this.allowLevel = this.actionTarget.occupyLevel || 0;
  },

  template: `
<div class="occupy-backend">
    <help-icon title="Occupying" class="right">
        You can attempt to restrict who will have access to the buildings or resources.<br/>
        <br/>
        If you decide to occupy the building or resource, anyone who you don't permit to access it will have an option to assault you, automatically starting a duel between them and yourself. In addition, they will start a duel with all other characters that are blocking their access to the building.<br/>
        <br/>
        If combat is triggered, the hostile relationship will last until either someone dies or both sides choose to end the hostilities (end the duel).  
    </help-icon>
    <interruption-warning :action="action" :target="actionTarget" />
    <div class="blocking-selection">
        <div class="item level-3" :class="{ active: allowLevel === 3 }">
            <div class="button action icon text" @click.prevent="setLevel(3);">
                <span class="icon-wrapper self"><span class="multicolor-icon"></span></span>
            </div>
            <div class="text">Block everyone</div>
        </div>    
        <div class="item level-2" :class="{ active: allowLevel === 2 }">
            <div class="button action icon text" @click.prevent="setLevel(2);">
                <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
                <span class="icon-wrapper self"><span class="multicolor-icon"></span></span>
            </div>
            <div class="text">Only allow friends</div>
        </div>
        <div class="item level-1" :class="{ active: allowLevel === 1 }">
            <div class="button action icon text" @click.prevent="setLevel(1);">
                <span class="icon-wrapper neutral"><span class="multicolor-icon"></span></span>
                <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
                <span class="icon-wrapper self"><span class="multicolor-icon"></span></span>
            </div>
            <div class="text">Block rivals</div>
        </div>
        <div class="item level-0" :class="{ active: allowLevel === 0 }">
            <div class="button action icon text" @click.prevent="setLevel(0);">
                <span class="icon-wrapper rival"><span class="multicolor-icon"></span></span>
                <span class="icon-wrapper neutral"><span class="multicolor-icon"></span></span>
                <span class="icon-wrapper friend"><span class="multicolor-icon"></span></span>
                <span class="icon-wrapper self"><span class="multicolor-icon"></span></span>
            </div>
            <div class="text">Don't block anyone</div>
        </div>
    </div>
    <confirm-with-wakeup-warning :action="action" @action="confirm();" />
</div>
    `
});

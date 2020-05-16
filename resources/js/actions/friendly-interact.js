Vue.component("backend-friendly-interact", {
  props: {
    actionTarget: null
  },

  methods: {
    confirm(interactionType) {
      ServerService.request("action", {
        action: "Interact",
        target: this.actionTarget.id,
        extra: interactionType
      });
      this.$emit("close");
    }
  },

  template: `
<form>
    <section class="actions-list">
<!--        <header>Interaction</header>-->
<!--        <span class="html">Interaction</span>-->
        <div class="button action icon text" @click.prevent="confirm('cheerup');">
            <div :style="{ 'background-image': 'url(/images/icons8-so-so-100.png)' }" class="icon"></div>
            <div class="text">Cheer up</div>
        </div>
        <div class="button action icon text" @click.prevent="confirm('insult');">
            <div :style="{ 'background-image': 'url(/images/icons8-clenched-fist-100.png)' }" class="icon"></div>
            <div class="text">Slight</div>
        </div>
    </section>
</form>
    `
});

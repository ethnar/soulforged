Vue.component("backend-pet-interact", {
  props: {
    action: null,
    actionTarget: null
  },

  methods: {
    confirm(interactionType) {
      ServerService.request("action", {
        action: "PetInteract",
        target: this.actionTarget.id,
        extra: interactionType
      }).then(() => {
        this.$emit("close");
      });
    }
  },

  template: `
<form>
    <difficulty-indicator :action="action" />
    <interruption-warning :action="action" :target="actionTarget" />
    <div class="clear-both" />
    <section class="actions-list" v-if="action">
        <div v-for="interaction in action.interactions" class="button action icon text" @click.prevent="confirm(interaction);">
            <div class="text">{{interaction}}</div>
        </div>
    </section>
</form>
    `
});
Vue.component("backend-pet-interact-rename", {
  props: {
    actionTarget: null
  },

  data: () => ({
    preferredName: "",
  }),

  mounted() {
    this.preferredName = this.actionTarget.name || "";
  },

  methods: {
    confirm() {
      ServerService.request("action", {
        action: "InteractPetRename",
        target: this.actionTarget.id,
        extra: {
          interactionType: 'rename',
          name: this.preferredName
        }
      }).then(() => {
        this.$emit("close");
      });
    }
  },

  template: `
<form>
    <div>
        Provide the new name:<br/>
        <input v-model="preferredName">
        <button type="submit" @click.prevent="confirm();">Confirm</button>
    </div>
</form>
    `
});

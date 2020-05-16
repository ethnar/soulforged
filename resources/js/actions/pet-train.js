Vue.component("backend-pet-train", {
  props: {
    action: null,
    actionTarget: null
  },

  data: () => ({
    selectedTraining: null,
    processing: null,
  }),

  methods: {
    select() {
      this.processing = ServerService.request("action", {
        action: "PetTrain",
        target: this.actionTarget.id,
        extra: this.selectedTraining
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
    <label v-for="trainingOption in action.trainingOptions" class="training-option">
        <div class="selection">
            <input
                type="checkbox"
                :checked="selectedTraining === trainingOption.trainingId"
                @click="selectedTraining = trainingOption.trainingId"
            />
        </div>
        <div class="details">
            <div class="name">{{trainingOption.name}} {{trainingOption.level}}</div>
            <div class="description help-text">{{trainingOption.description}}</div>
        </div>
    </label>
    <loader-button
        @click="select()"
        :disabled="!selectedTraining"
        :promise="processing"    
    >
        Start Training
    </loader-button>
</form>
    `
});

Vue.component("backend-pet-interact-reassign", {
  props: {
    actionTarget: null
  },

  data: () => ({
    reassign: false
  }),

  subscriptions() {
    const creaturesStream = ServerService.getNodeStream().pluck("creatures");

    return {
      creatures: creaturesStream.map(creatures =>
        creatures
          .filter(c => c.friendly)
          .filter(c => !c.self)
          .filter(c => !!c.race)
          .sort(creaturesSorter)
      )
    };
  },

  methods: {
    reassignTo(creature) {
      ServerService.request("action", {
        action: "InteractPetAssign new owner",
        target: this.actionTarget.id,
        extra: {
          creatureId: creature.id,
          interactionType: 'reassign'
        }
      }).then(() => {
        this.$emit("close");
      });
    },
  },

  template: `
<form>
    <section>
        <header>Assign new owner</header>
        <creature-list-item
            v-for="creature in creatures"
            v-if="!creature.dead"
            :creature="creature"
            :include-actions="false"
            :key="creature.id"
        >
            <button type="submit" @click.prevent="reassignTo(creature);">Assign</button>
        </creature-list-item>
    </section>
</form>
    `
});

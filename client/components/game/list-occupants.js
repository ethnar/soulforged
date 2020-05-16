import "./creature.js";

Vue.component("list-occupants", {
  props: {
    node: null,
    target: null
  },

  data: () => ({}),

  subscriptions() {
    const creaturesStream = this.stream("node")
      .pluck("creatures")
      .map(creatures => [...creatures].sort(creaturesSorter));

    const blockingIdsStream = this.stream("target").pluck("blockedBy");

    return {
      creatures: Rx.Observable.combineLatestMap({
        creatures: creaturesStream,
        blockingIds: blockingIdsStream
      }).map(({ creatures, blockingIds }) => {
        const blockedIdsMap = (blockingIds || []).toObject(id => id);

        return creatures.filter(c => blockedIdsMap[c.id]);
      })
    };
  },

  template: `
<section class="list-occupants" v-if="creatures && creatures.length">
    <header>Blocked by</header>
    <section>
        <creature-list-item
            v-for="creature in creatures"
            :creature="creature"
            :key="creature.id"
            :include-actions="false"
        >
        </creature-list-item>
    </section>
</section>
    `
});

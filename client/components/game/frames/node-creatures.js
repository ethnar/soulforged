import { ServerService } from "../../../services/server.js";
import "../creature.js";

Vue.component("node-creatures", {
  props: {
    node: null
  },

  data: () => ({}),

  subscriptions() {
    const creaturesStream = this.stream("node").pluck("creatures");

    return {
      creatures: creaturesStream.map(creatures =>
        [...creatures].sort(creaturesSorter)
      )
    };
  },

  template: `
<section class="node-details">
    <actions
        class="centered"
        :target="node"
        :exclude="['Name town', 'Name region', 'Travel']"        
    />
    <header>Creatures</header>
    <div v-if="!node.isInVisionRange" class="empty-list">Unknown</div>
    <div v-else-if="!creatures.length" class="empty-list"></div>
    <section>
        <creature-list-item
            v-for="creature in creatures"
            :creature="creature"
            :key="creature.id">
        </creature-list-item>
    </section>
</section>
    `
});

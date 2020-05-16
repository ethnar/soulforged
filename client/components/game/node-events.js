import { Utils } from "../generic/utils.js";
import { DataService } from "../../services/data.js";

Vue.component("node-events", {
  data: () => ({
    showPlotText: null,
    showPlotStructureName: null
  }),

  subscriptions() {
    return {
      events: DataService.getEventsStream()
    };
  },

  methods: {
    onClick(event) {
      this.showPlotText = Utils.linebreaks(event.plotText);
      this.showPlotStructureName = event.name;
    }
  },

  template: `
<div v-if="events && events.length" class="node-events">
    <div v-for="event in events" class="event-icon" @click="onClick(event)">
        <item-icon :src="event.icon"></item-icon>
    </div>
    <modal v-if="showPlotText" @close="showPlotText = null;">
        <template>
            <template slot="header">{{showPlotStructureName}}</template>
            <template slot="main">
                <animated-text :text="showPlotText" />
            </template>
        </template>
    </modal>
</div>
    `
});

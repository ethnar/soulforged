import "../recipe-details.js";
import "../relationship-picker.js";
import { DataService } from "../../../services/data.js";
import { ServerService } from "../../../services/server.js";
import { ToastNotification } from "../../generic/toast-notification.js";
import { ContentFrameService } from "../../../services/content-frame.js";

Vue.component("relationships", {
  data: () => ({
    friends: [],
    rivals: [],
    enemies: [],
    editing: null
  }),

  subscriptions() {
    return {
      relationships: DataService.getRelationshipsStream().map(relationships =>
        Object.keys(relationships).toObject(
          k => k,
          k =>
            relationships[k]
              .map(r => ({
                ...r,
                lowercaseName: r.name.toLowerCase()
              }))
              .sort((a, b) => {
                if (`${a.lowercaseName}` > `${b.lowercaseName}`) {
                  return 1;
                }
                if (`${a.lowercaseName}` < `${b.lowercaseName}`) {
                  return -1;
                }
                return 0;
              })
        )
      )
    };
  },

  methods: {
    edit(relationship, type) {
      this.editing = relationship;
      this.editingCreature = {
        id: relationship.id,
        relationship: type
      };
    },

    startTrade(relationship) {
      ServerService.request("action", {
        action: "Trade",
        target: relationship.creatureId
      }).then(() => {
        ToastNotification.notify(`Starting trade with ${relationship.name}...`);
        ContentFrameService.triggerShowPanel("activeTrades");
      });
    }
  },

  template: `
<section class="relationships" v-if="relationships">
    <header>Friends</header>
    <div v-if="!relationships.friends.length" class="empty-list"></div>
    <div v-for="relationship in relationships.friends" class="item friend">
        <div class="name">{{relationship.name}}</div>
        <div class="action-container">
            <button class="action trade icon" @click="startTrade(relationship);">
                <div class="icon"></div>
            </button>
            <button class="action edit icon" @click="edit(relationship, 'friend');">
                <div class="icon"></div>
            </button>
        </div>
    </div>
    <header>Rivals</header>
    <div v-if="!relationships.rivals.length" class="empty-list"></div>
    <div v-for="relationship in relationships.rivals" class="item rival">
        <div class="name">{{relationship.name}}</div>
        <div class="action-container">
            <button class="action trade icon" @click="startTrade(relationship);">
                <div class="icon"></div>
            </button>
            <button class="action edit icon" @click="edit(relationship, 'rival');">
                <div class="icon"></div>
            </button>
        </div>
    </div>
    <header>Neutral</header>
    <div v-if="!relationships.neutrals.length" class="empty-list"></div>
    <div v-for="relationship in relationships.neutrals" class="item neutral">
        <div class="name">{{relationship.name}}</div>
        <div class="action-container">
            <button class="action trade icon" @click="startTrade(relationship);">
                <div class="icon"></div>
            </button>
            <button class="action edit icon" @click="edit(relationship, 'neutral');">
                <div class="icon"></div>
            </button>
        </div>
    </div>
    <modal v-if="editing" @close="editing = null;">
        <template slot="header">{{editing.name}}</template>
        <template slot="main">
            <relationship-picker :creature="editingCreature" @changed="editing = null" />
        </template>
    </modal>
</section>
    `
});

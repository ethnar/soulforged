import { ServerService } from "../../../services/server.js";
import { Utils } from "../../generic/utils.js";
import { DataService } from "../../../services/data.js";
import { ToastNotification } from "../../generic/toast-notification.js";

Vue.component("player-trades", {
  data: () => ({
    addingItem: null,
    selectedItem: null,
    selectedQty: 1,
    executingPromise: {},
    executingPromiseCancel: {}
  }),

  subscriptions() {
    return {
      trades: DataService.getMyTradesStream(),
      availableForTrade: DataService.getAvailableItemsStream().map(items => {
        const mats = {};
        items.sort(Utils.itemsSorter).forEach(item => {
          const key = item.tradeId;
          if (!key || key === "null") {
            return;
          }
          if (mats[key]) {
            mats[key].qty += item.qty;
          } else {
            mats[key] = {
              ...item
            };
          }
        });
        return mats;
      })
    };
  },

  methods: {
    commenceTrade(trade) {
      this.$set(
        this.executingPromise,
        trade.id,
        ServerService.request("commenceTrade", {
          trade: trade.id
        }).then(result => {
          if (result !== true && result !== false) {
            ToastNotification.notify(result);
          }
        })
      );
    },

    acceptTrade(trade) {
      this.$set(
        this.executingPromise,
        trade.id,
        ServerService.request("acceptTrade", {
          trade: trade.id
        })
      );
    },

    cancelTrade(trade) {
      this.$set(
        this.executingPromiseCancel,
        trade.id,
        ServerService.request("cancelTrade", {
          trade: trade.id
        })
      );
    },

    selectingItem(item) {
      this.selectedItem = item;
    },

    addingItemTo(trade) {
      this.addingItem = trade;
      this.selectedItem = null;
      this.selectedQty = 1;
    },

    removeItemFromTrade(trade, removeIdx) {
      ServerService.request("setTradeItems", {
        trade: trade.id,
        items: trade.items.yours
          .filter((item, idx) => removeIdx !== idx)
          .map(i => ({
            tradeId: i.item.tradeId,
            qty: i.qty
          }))
      });
    },

    applyItemSelection() {
      // TODO: ensure no duplicates
      ServerService.request("setTradeItems", {
        trade: this.addingItem.id,
        items: [
          ...(this.addingItem.items.yours || []).map(i => ({
            tradeId: i.item.tradeId,
            qty: i.qty
          })),
          {
            tradeId: this.selectedItem.tradeId,
            qty: this.selectedQty
          }
        ]
      });
      this.addingItem = null;
    },

    includedAlready(tradeId) {
      const trade = this.trades.find(t => t.id === this.addingItem.id);
      return trade.items.yours.some(i => i.item.tradeId === tradeId);
    }
  },

  template: `
<div class="player-trades" v-if="trades">
    <section>
        <header>Pending Trades</header>
        <div v-if="!trades.length" class="empty-list"></div>
    </section>
    <section v-for="trade in trades">
        <header>Trade: {{trade.with}}</header>
        <div class="trade-sides">
            <div class="trade-side" :class="{ accepted: trade.accepted.you }">
                <span class="header">Your items</span>
                <div class="item-list">
                    <div v-for="(item, idx) in trade.items.yours">
                        <item-icon @click="removeItemFromTrade(trade, idx)" :src="item.item.icon" :qty="item.qty" :trinket="item.item.houseDecoration ? item.item.buffs : null" :integrity="item.item.integrity"></item-icon>
                    </div>
                </div>
                <div class="utility-button-item">
                    <item-icon @click="addingItemTo(trade)" src="images/ui/plus_01_org_small_dark.png"></item-icon>
                </div>
            </div>
            <div class="trade-side" :class="{ accepted: trade.accepted.them }">
                <span class="header">Their items</span>
                <div class="item-list">
                    <div v-for="(item, idx) in trade.items.theirs">
                        <item-icon :src="item.item.icon" :qty="item.qty" :integrity="item.item.integrity" :details="item.item" :trinket="item.item.houseDecoration ? item.item.buffs : null"></item-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="centered">
            <loader-button
                class="button"
                @click="commenceTrade(trade)"
                v-if="trade.accepted.you && trade.accepted.them"
                :promise="executingPromise[trade.id]"
            >
                Commence
            </loader-button>
            <loader-button
                class="button"
                @click="acceptTrade(trade)"
                v-else
                :promise="executingPromise[trade.id]"
                :class="{ disabled: trade.acceptBlocked || (!trade.items.theirs.length && !trade.items.yours.length) }"
            >
                Accept
            </loader-button>
            <loader-button :promise="executingPromiseCancel[trade.id]" class="button" @click="cancelTrade(trade)">Cancel</loader-button>
        </div>
    </section>
    <modal v-if="addingItem" @close="addingItem = null" class="player-trades">
        <template slot="header">
            Select item
        </template>
        <template slot="main" class="item-list">
            <div class="item-list">
                <item-icon
                    v-for="item in availableForTrade"
                    :key="item.tradeId"
                    v-if="!includedAlready(item.tradeId)"
                    :class="{ selected: selectedItem && selectedItem.tradeId === item.tradeId }"
                    :src="item.icon"
                    :qty="item.qty"
                    :integrity="item.integrity"
                    :trinket="item.houseDecoration ? item.buffs : null"
                    @click="selectingItem(item)"
                >
                </item-icon>
            </div>
            <div v-if="selectedItem" class="help-text">{{selectedItem.name}}</div>
            <form class="controls">
                <number-selector class="number-select" v-model="selectedQty" :min="1" :max="(selectedItem && selectedItem.qty) || 1"></number-selector>
                <div>
                    <button :disabled="!selectedItem" @click.prevent="applyItemSelection();">Confirm</button>
                </div>
            </form>
        </template>
    </modal>
</div>
    `
});

import { ServerService } from "../../../services/server.js";
import { ToastNotification } from "../../generic/toast-notification.js";
import { Utils } from "../../generic/utils.js";
import { TradingService } from "../../../services/trading.js";
import { DataService } from "../../../services/data.js";
import "../target-relationship-picker.js";
import "../item-condition-picker.js";

Vue.component("auto-trade", {
  data: () => ({
    sides: ["offering", "asking"],
    newListing: {
      offering: [],
      asking: []
    },
    addingToSide: null,
    selectedItem: null,
    selectedQty: 1,
    repetitions: 1,
    addingNewListing: false,
    acceptingTrade: false,
    currentAcceptTrade: null,
    acceptTradeTimes: 1,
    editingListingId: null,
    listingTarget: null,
    selectIntegrity: null,
    itemFilter: ""
  }),

  subscriptions() {
    const nodeStream = ServerService.getNodeStream();
    const newListingsStream = TradingService.getNewListingsStream();
    const tradeListingsStream = DataService.getTradeListingsStream();

    return {
      node: nodeStream,
      knownItems: DataService.getKnownItemsStream(),
      availableItemsCounts: DataService.getAvailableItemsCountsStream().startWith(
        {}
      ),
      myTradeListings: tradeListingsStream.pluck("self").map(listings => {
        const val = ({ listingTarget }) =>
          listingTarget === "friends"
            ? 1
            : listingTarget === "no-rivals"
            ? 2
            : 3;
        let lastLabel = null;
        return [...listings]
          .sort((a, b) => val(a) - val(b))
          .map(listing => {
            listing.showLabel =
              lastLabel !== listing.listingTarget
                ? listing.listingTarget.replace("-", " ")
                : null;
            lastLabel = listing.listingTarget;
            return listing;
          });
      }),
      tradeListings: tradeListingsStream.pluck("others"),
      newListings: newListingsStream.first().do(() => {
        TradingService.updateRememberedListingsStream();
      }),
      availableForTrade: DataService.getAvailableItemsStream().map(items => {
        const mats = {};

        items.sort(Utils.itemsSorter).forEach(item => {
          const key = item.tradeId;
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

  computed: {
    additionsOptions() {
      const skip = {};
      this.newListing.asking.forEach(listing => {
        skip[listing.item.itemCode] = true;
      });

      const available = Object.values(
        this.knownItems
          .filter(item => !skip[item.itemCode])
          .reduce((acc, i) => {
            acc[i.itemCode] = i;
            return acc;
          }, {})
      ).sort(Utils.itemsSorter);

      return available;
    }
  },

  methods: {
    ucfirst: Utils.ucfirst,
    min(...args) {
      return Math.min(...args);
    },

    tradingQuantityDisplay(side, element) {
      const total = element.qty * this.acceptTradeTimes;
      if (side === "asking") {
        return (
          total +
          " / " +
          (this.availableItemsCounts[element.item.itemCode] || 0)
        );
      }
      return total;
    },

    addingItemToListing(side) {
      this.addingToSide = side;
      this.selectedQty = 1;
    },

    selectingItem(item, withIntegrity = false) {
      this.selectedItem = item;
      if (withIntegrity) {
        this.selectIntegrity = item.integrity;
      }
    },

    applyItemSelection() {
      this.newListing[this.addingToSide] = [
        ...this.newListing[this.addingToSide],
        {
          item: {
            ...this.selectedItem,
            integrity: this.selectIntegrity,
            tradeId: this.selectedItem.tradeId.replace(
              "[50,100]",
              JSON.stringify(this.selectIntegrity)
            )
          },
          qty: this.selectedQty
        }
      ];
      this.addingToSide = null;
    },

    commitListing() {
      if (this.editingListingId) {
        this.removeListing(this.editingListingId);
      }
      this.editingListingId = null;

      const getPayload = elements => {
        return elements.map(element => ({
          tradeId: element.item.tradeId,
          qty: element.qty
        }));
      };

      ServerService.request("addListing", {
        offering: getPayload(this.newListing.offering),
        asking: getPayload(this.newListing.asking),
        repetitions: this.repetitions,
        listingTarget: this.listingTarget
      }).then(() => {
        this.cancelListing();
      });
    },

    cancelListing() {
      this.newListing = {
        offering: [],
        asking: []
      };
      this.repetitions = 1;

      this.addingNewListing = false;
      this.editingListingId = null;
    },

    removeListing(tradeListingId) {
      ServerService.request("removeListing", {
        tradeListingId
      });
    },

    acceptTrade() {
      this.acceptingTrade = true;

      ServerService.request("acceptTradeListing", {
        creatureId: this.currentAcceptTrade.character.id,
        tradeListingId: this.currentAcceptTrade.listing.tradeListingId,
        qty: this.acceptTradeTimes
      }).then(response => {
        setTimeout(() => {
          this.acceptingTrade = false;
        }, 500);

        if (response === true) {
          this.currentAcceptTrade = null;
          response = "Trade complete";
        }
        ToastNotification.notify(response);
      });
    },

    openAcceptTrade(character, listing) {
      this.currentAcceptTrade = {
        character,
        listing
      };
    },

    editListing(listing) {
      this.editingListingId = listing.tradeListingId;
      this.listingTarget = listing.listingTarget;

      this.newListing = JSON.parse(JSON.stringify(listing));
      this.repetitions = listing.repetitions;

      this.addingNewListing = true;
    },

    addNewListing() {
      this.listingTarget = "no-rivals";
      this.addingNewListing = true;
    },

    removeItemFromNewListing(side, itemCode) {
      const idx = this.newListing[side].findIndex(
        element => element.item.itemCode === itemCode
      );

      if (idx !== -1) {
        this.newListing[side].splice(idx, 1);
      }
    }
  },

  template: `
<div class="auto-trade player-trades" v-if="myTradeListings && knownItems">
    <section>
        <header>Trade listings</header>
        <!--<div>TODO: Add a toggle on/off</div>-->
        <table v-if="myTradeListings.filter(listing => editingListingId !== listing.tradeListingId).length" class="full-width">
            <tr class="header">
                <td v-for="side in sides" :class="side">
                    {{ucfirst(side)}}
                </td>
                <td colspan="2" width="1%">
                    Times
                </td>
            </tr>
            <template v-for="(listing, listingIdx) in myTradeListings" v-if="editingListingId !== listing.tradeListingId">
                <tr v-if="listing.showLabel">
                    <td colspan="4" class="listing-target">{{ucfirst(listing.showLabel)}}</td>
                </tr>
                <tr>
                    <td v-for="side in sides" :class="side">
                        <item-icon
                            v-for="element in listing[side]"
                            size="small"
                            :key="element.item.tradeId"
                            :src="element.item.icon"
                            :qty="element.qty"
                            :details="element.item"
                            :trinket="element.item.houseDecoration && element.item.buffs"
                            :integrity="element.item.integrity"
                            :integrityType="element.item.integrityType"
                        ></item-icon>
                    </td>
                    <td class="count">
                        {{listing.repetitions}} <span v-if="listing.maxRepetitions < 9999">({{listing.maxRepetitions}})</span>
                    </td>
                    <td class="action-container">
                        <button class="action edit icon" @click="editListing(listing);">
                            <div class="icon"></div>
                        </button>
                        <button class="action delete icon" @click="removeListing(listing.tradeListingId);">
                            <div class="icon"></div>
                        </button>
                    </td>
                </tr>
            </template>
        </table>
        <modal v-if="addingNewListing" class="new-listing" @close="cancelListing()">
            <template slot="header">
                {{editingListingId ? 'Update listing' : 'Add listing'}}
            </template>
            <template slot="main">
                <table class="full-width">
                    <tr class="header">
                        <td v-for="side in sides" :class="side">
                            <section><header class="secondary">{{ucfirst(side)}}</header></section>
                        </td>
                        <td width="1%">
                            <section><header class="secondary">Times</header></section>
                        </td>
                    </tr>
                    <tr>
                        <td v-for="side in sides" :class="side">
                            <div class="wrapping">
                                <item-icon
                                    v-for="element in newListing[side]"
                                    :key="element.item.tradeId"
                                    :src="element.item.icon"
                                    :integrity="element.item.integrity"
                                    :integrityType="element.item.integrityType"
                                    :trinket="element.item.houseDecoration && element.item.buffs"
                                    :qty="element.qty"
                                    @click="removeItemFromNewListing(side, element.item.itemCode);"
                                ></item-icon>
                            </div>
                            <div class="utility-button-item">
                                <item-icon
                                    @click="addingItemToListing(side)"
                                    src="images/ui/plus_01_org_small_dark.png"
                                ></item-icon>
                            </div>
                        </td>
                        <td>
                            <number-selector class="number-select" v-model="repetitions" :min="0" :max="9999"></number-selector>
                        </td>
                    </tr>
                </table>
                <section><header class="secondary">Available to:</header></section>
                <target-relationship-picker v-model="listingTarget" />
                <div class="centered">
                    <button class="button" @click="commitListing();">Confirm {{editingListingId ? 'changes' : 'listing'}}</button>
                </div>
                <div class="centered">
                    <button class="button" @click="cancelListing();">Cancel</button>
                </div>
            </template>
        </modal>
        <div class="centered">
            <button class="button" @click="addNewListing();">New listing</button>
        </div>
    </section>
    <section v-for="character in tradeListings" v-if="character.listings && character.listings.length">
        <header class="no-wrap">{{character.name}}: Trade listing</header>
        <table class="full-width">
            <tr class="header">
                <td v-for="side in sides" :class="side" width="33%">
                    {{ucfirst(side)}}
                </td>
                <td colspan="2">
                    Times
                </td>
            </tr>
            <tr
                v-for="listing in character.listings"
                class="item-listing-offer"
                :class="{ 'is-new-listing': newListings[character.id] && newListings[character.id][listing.tradeListingId] }"
            >
                <td v-for="side in sides" :class="side">
                    <item-icon
                        v-for="element in listing[side]"
                        size="small"
                        :key="element.item.tradeId"
                        :src="element.item.icon"
                        :qty="element.qty"
                        :details="element.item"
                        :integrity="element.item.integrity"
                        :integrityType="element.item.integrityType"
                        :trinket="element.item.houseDecoration && element.item.buffs"
                    ></item-icon>
                </td>
                <td class="count">
                    {{min(listing.repetitions, listing.maxRepetitions)}}
                </td>
                <td>
                    <button class="action accept icon" :disabled="acceptingTrade" @click="openAcceptTrade(character, listing)">
                        <div class="icon"></div>
                    </button>
                </td>
            </tr>
        </table>
    </section>
    <modal class="auto-trade player-trades" v-if="currentAcceptTrade" @close="currentAcceptTrade = null">
        <template slot="header">
            Trade: {{currentAcceptTrade.character.name}}
        </template>
        <template slot="main" class="item-list">
            <div class="flex-grow">
                <table class="full-width">
                    <tr>
                        <td width="50%"><section><header class="secondary">Receiving</header></section></td>
                        <td width="50%"><section><header class="secondary">Giving</header></section></td>
                    </tr>
                    <tr>
                        <td v-for="side in sides" :class="side">
                            <item-icon
                                v-for="element in currentAcceptTrade.listing[side]"
                                :key="element.item.tradeId"
                                :src="element.item.icon"
                                :qty="tradingQuantityDisplay(side, element)"
                                :integrity="element.item.integrity"
                                :integrityType="element.item.integrityType"
                                :trinket="element.item.houseDecoration && element.item.buffs"
                                :details="element.item"
                            ></item-icon>
                        </td>
                    </tr>
                </table>
            </div>
            <form class="controls">
                <number-selector class="number-select" v-model="acceptTradeTimes" :min="1" :max="min(currentAcceptTrade.listing.repetitions, currentAcceptTrade.listing.maxRepetitions)"></number-selector>
                <div>
                    <button @click.prevent="acceptTrade();">Confirm</button>
                </div>
            </form>
        </template>
    </modal>
    <modal class="auto-trade player-trades" v-if="addingToSide" @close="addingToSide = null">
        <template slot="header">
            Select item
        </template>
        <template slot="main" class="item-list">
            <div class="item-selection">
                <input v-model="itemFilter" placeholder="Start typing to filter..." />
                <section v-if="addingToSide === 'offering'">
                    <header class="secondary">Inventory</header>
                    <div class="item-list">
                        <item
                            v-for="item in availableForTrade"
                            v-if="item.tradeId && item.tradeId !== 'null' && item.name.toLowerCase().includes(itemFilter.toLowerCase())"
                            :key="item.tradeId"
                            :data="item"
                            :interactable="false"
                            :class="{ selected: selectedItem && selectedItem.tradeId === item.tradeId }"
                            @click="selectingItem(item, true)"
                        />
                    </div>
                </section>
                <section>
                    <header class="secondary">Known items</header>
                    <div class="item-list">
                        <item
                            v-for="item in additionsOptions"
                            v-if="item.tradeId && item.tradeId !== 'null' && item.name.toLowerCase().includes(itemFilter.toLowerCase())"
                            :key="item.tradeId"
                            :data="item"
                            :interactable="false"
                            :class="{ selected: selectedItem && selectedItem.tradeId === item.tradeId }"
                            @click="selectingItem(item)"
                        />
                    </div>
                </section>
<!--                <div v-if="selectedItem" class="help-text">{{selectedItem.name}}</div>-->
            </div>
            <div class="other-selection">
                <item-condition-picker v-model="selectIntegrity" :item="selectedItem" />
                <form class="controls">
                    <number-selector class="number-select" v-model="selectedQty" :min="1" :max="9999"></number-selector>
                    <div>
                        <button :disabled="!selectedItem" @click.prevent="applyItemSelection();">Confirm</button>
                    </div>
                </form>
            </div>
        </template>
    </modal>
</div>
    `
});

import { Utils } from "../generic/utils.js";
import { DataService } from "../../services/data.js";

const SELF_DOWN = ["Store", "Dump"];
const SELF_UP = ["Pick up", "Take"];
const HOME_DOWN = ["Take", "Dump "];
const HOME_UP = ["Store"];

Vue.component("carry-capacity-predictor", {
  props: {
    action: null,
    target: null,
    qty: 0
  },

  subscriptions() {
    const actionStream = this.stream("action");
    const selfDownStream = actionStream.map(
      action => action && SELF_DOWN.includes(action.name)
    );
    const selfUpStream = actionStream.map(
      action => action && SELF_UP.includes(action.name)
    );
    const homeDownStream = actionStream.map(
      action => action && HOME_DOWN.includes(action.name)
    );
    const homeUpStream = actionStream.map(
      action => action && HOME_UP.includes(action.name)
    );
    const anySelf = Rx.Observable.combineLatest([
      selfDownStream,
      selfUpStream
    ]).map(values => values.reduce((acc, v) => v || acc, false));
    const anyHome = Rx.Observable.combineLatest([
      homeDownStream,
      homeUpStream
    ]).map(values => values.reduce((acc, v) => v || acc, false));
    return {
      inventory: anySelf.switchMap(any =>
        any ? DataService.getMyInventoryStream() : Rx.Observable.of(null)
      ),
      homeInventory: anyHome.switchMap(any =>
        any ? DataService.getMyHomeInventoryStream() : Rx.Observable.of(null)
      ),
      selfDown: selfDownStream,
      selfUp: selfUpStream,
      homeDown: homeDownStream,
      homeUp: homeUpStream
    };
  },

  computed: {
    totalWeight() {
      return this.qty * (this.target && this.target.weight.single);
    }
  },

  template: `
<div class="carry-capacity-predictor" v-if="inventory || homeInventory">
    <div class="predictor-side" v-if="inventory">
        <label>Inventory</label>
        <carry-capacity-indicator
            v-if="inventory && selfUp"
            :current="inventory.weights.currentWeight + totalWeight"
            :thresholds="inventory.weights.thresholds"
        />
        <carry-capacity-indicator
            v-if="inventory && selfDown"
            :current="inventory.weights.currentWeight - totalWeight"
            :thresholds="inventory.weights.thresholds"
        />
    </div>
    <div class="arrow arrow-right" v-if="selfDown && homeUp"></div>
    <div class="arrow arrow-left" v-if="selfUp && homeDown"></div>
    <div class="predictor-side" v-if="homeInventory">
        <label>Storage</label>
        <carry-capacity-indicator
            v-if="homeInventory && homeUp"
            :current="homeInventory.weight + totalWeight"
            :max="homeInventory.weightLimit"
        />
        <carry-capacity-indicator
            v-if="homeInventory && homeDown"
            :current="homeInventory.weight - totalWeight"
            :max="homeInventory.weightLimit"
        />
    </div>
    <div class="arrow arrow-right" v-if="(selfDown && !homeUp) || (!selfUp && homeDown)"></div>
</div>
    `
});

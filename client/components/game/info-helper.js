import { ServerService } from "../../services/server.js";

Vue.component("info-helper", {
  props: ["info", "params"],

  data: () => ({
    showing: false
  }),

  subscriptions() {
    return {
      infoData: Rx.Observable.combineLatestMap({
        info: this.stream("info"),
        params: this.stream("params"),
        showing: this.stream("showing")
      }).switchMap(({ info, params, showing }) =>
        showing
          ? Rx.Observable.fromPromise(ServerService.getInfo(info, params))
          : Rx.Observable.of("")
      )
    };
  },

  template: `
<help-icon class="action-help-icon" :title="infoData.title" @show="showing = true" @hide="showing = false">
    <div v-html="infoData.text" />
</help-icon>
    `
});

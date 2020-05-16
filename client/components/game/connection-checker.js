import { DataService } from "../../services/data.js";
import { ServerService } from "../../services/server.js";

let tick = 0;
Vue.component("connection-checker", {
  data: () => ({
    connectionIssueLevel: 0,
    infoDialog: false,
    playerActive: true
  }),

  subscriptions() {
    return {
      ticker: DataService.getTickerStream().do(ticker => {
        ServerService.request("pong", this.playerActive, "p" + (tick++ % 10));
        ticker = ticker || 1;

        this.connectionIssueLevel = 0;
        clearTimeout(this.timeoutCheck1);
        clearTimeout(this.timeoutCheck2);
        clearTimeout(this.timeoutCheck3);
        this.timeoutCheck1 = setTimeout(() => {
          this.connectionIssueLevel = 1;
        }, ticker * 1000 + 2000);
        this.timeoutCheck2 = setTimeout(() => {
          this.connectionIssueLevel = 2;
        }, ticker * 3000 + 8000);
        this.timeoutCheck3 = setTimeout(() => {
          ServerService.getLocalSettingStream("disableAutoRefresh")
            .first()
            .subscribe(disableAutoRefresh => {
              if (!disableAutoRefresh) {
                window.location.reload();
              }
            });
        }, ticker * 5000 + 30000);
      })
    };
  },

  methods: {
    forceReloadPage() {
      window.location.reload();
    },

    marksLastActive() {
      if (this.activityTimeout) {
        clearTimeout(this.activityTimeout);
      }
      this.playerActive = true;
      this.activityTimeout = setTimeout(() => {
        this.playerActive = false;
      }, 30000);
    }
  },

  created() {
    this.focusHandler = () => {
      setTimeout(() => {
        if (this.connectionIssueLevel > 0) {
          ServerService.reconnect();
        } else {
          this.marksLastActive();
        }
      }, 500);
    };
    this.blurHandler = () => {
      this.playerActive = false;
    };
    this.clickHandler = () => {
      this.marksLastActive();
    };
    this.marksLastActive();

    window.addEventListener("focus", this.focusHandler, false);
    window.addEventListener("blur", this.blurHandler, false);
    document.addEventListener("mousedown", this.clickHandler);
  },

  destroy() {
    window.removeEventListener("focus", this.focusHandler);
    window.removeEventListener("blur", this.blurHandler);
    document.removeEventListener("mousedown", this.clickHandler);
  },

  template: `
<div class="connection-checker">
    <transition name="fade">
        <div class="problem-icon-wrapper" v-if="!!connectionIssueLevel" @click="infoDialog = !infoDialog">
            <div class="problem-icon" :class="{ highlight: connectionIssueLevel === 2 }">
                <item-icon :src="'./images/connection' + connectionIssueLevel + '.png'"></item-icon>
            </div>
        </div>
    </transition>
    <modal v-if="infoDialog" @close="infoDialog = false">
        <template slot="header">
            Connection issues
        </template>
        <template slot="main">
            <div class="help-text">
                It appears there are some problems with the connection to the server.<br/>
                If they persist you can try to reload the page to resolve this.
            </div>
            <button @click="forceReloadPage();">Reload the page</button>
        </template>
    </modal>
</div>
    `
});
